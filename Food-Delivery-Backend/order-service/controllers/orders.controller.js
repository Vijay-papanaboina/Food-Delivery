// Removed uuid import - using database-generated IDs now
import {
  upsertOrder,
  getOrder,
  updateOrderStatus,
  insertOrderItems,
} from "../repositories/orders.repo.mongoose.js";
import {
  getUserOrders,
  getOrderStats as getOrderStatsRepo,
  getRestaurantOrders,
} from "../repositories/orders.stats.repo.mongoose.js";
import { TOPICS, publishMessage } from "../config/kafka.js";
import { logger } from "../utils/logger.js";
import { Order } from "../db/mongoose-schema.js";
import { transformOrder } from "../utils/dataTransformation.js";

export const buildCreateOrderController =
  (producer, serviceName) => async (req, res) => {
    const userId = req.user?.userId; // Get user ID from JWT token
    const {
      restaurantId,
      items,
      deliveryAddress,
      customerName,
      customerPhone,
    } = req.body;

    try {
      logger.info("Order creation started", {
        userId,
        restaurantId,
        itemsCount: items?.length || 0,
      });

      // Validate required fields
      if (
        !restaurantId ||
        !items ||
        !deliveryAddress ||
        !customerName ||
        !customerPhone
      ) {
        logger.warn("Order creation failed - missing required fields", {
          hasRestaurantId: !!restaurantId,
          hasItems: !!items,
          hasDeliveryAddress: !!deliveryAddress,
          hasCustomerName: !!customerName,
          hasCustomerPhone: !!customerPhone,
        });
        return res.status(400).json({
          error:
            "Missing required fields: restaurantId, items, deliveryAddress, customerName, customerPhone",
        });
      }

      // Validate items array
      if (!Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ error: "Items must be a non-empty array" });
      }

      // Validate each item in the array
      for (const [index, item] of items.entries()) {
        if (!item.id || !item.price || !item.quantity) {
          return res.status(400).json({
            error: `Item at index ${index} missing required fields: id, price, quantity`,
          });
        }
        if (typeof item.price !== "number" || item.price <= 0) {
          return res.status(400).json({
            error: `Item at index ${index} has invalid price: must be a positive number`,
          });
        }
        if (
          typeof item.quantity !== "number" ||
          item.quantity <= 0 ||
          !Number.isInteger(item.quantity)
        ) {
          return res.status(400).json({
            error: `Item at index ${index} has invalid quantity: must be a positive integer`,
          });
        }
      }

      // Validate data types
      if (typeof restaurantId !== "string" || typeof userId !== "string") {
        return res.status(400).json({
          error: "restaurantId and userId must be strings",
        });
      }

      // Validate customer info data types
      if (
        typeof customerName !== "string" ||
        typeof customerPhone !== "string"
      ) {
        return res.status(400).json({
          error: "customerName and customerPhone must be strings",
        });
      }

      // Validate deliveryAddress structure
      if (typeof deliveryAddress !== "object" || deliveryAddress === null) {
        return res.status(400).json({
          error: "deliveryAddress must be an object",
        });
      }

      const requiredAddressFields = ["street", "city", "state", "zipCode"];
      for (const field of requiredAddressFields) {
        if (
          !deliveryAddress[field] ||
          typeof deliveryAddress[field] !== "string"
        ) {
          return res.status(400).json({
            error: `deliveryAddress.${field} is required and must be a string`,
          });
        }
      }

      // Validate restaurant status and menu items via restaurant-service
      const restaurantServiceUrl =
        process.env.RESTAURANT_SERVICE_URL || "http://localhost:5006";
      const statusResp = await fetch(
        `${restaurantServiceUrl}/api/restaurant-service/restaurants/${restaurantId}/status`,
      );
      if (!statusResp.ok) {
        return res.status(400).json({ error: "Restaurant not found" });
      }
      const statusJson = await statusResp.json();
      if (!statusJson.isOpen) {
        return res.status(400).json({
          error: "Restaurant is currently closed",
          reason: statusJson.reason,
        });
      }

      const validateResp = await fetch(
        `${restaurantServiceUrl}/api/restaurant-service/restaurants/${restaurantId}/menu/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        },
      );
      if (!validateResp.ok) {
        return res.status(400).json({ error: "Failed to validate menu items" });
      }
      const validateJson = await validateResp.json();
      if (!validateJson.valid) {
        return res
          .status(400)
          .json({ error: "Invalid menu items", details: validateJson.errors });
      }

      const validatedItems = validateJson.items;
      const subtotal = validatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Fetch restaurant details to get delivery fee
      const restaurantResp = await fetch(
        `${restaurantServiceUrl}/api/restaurant-service/restaurants/${restaurantId}`,
      );
      if (!restaurantResp.ok) {
        return res.status(400).json({
          error: "Failed to fetch restaurant details",
        });
      }
      const restaurantData = await restaurantResp.json();
      const deliveryFee =
        parseFloat(restaurantData.restaurant.delivery_fee) || 0;

      const total = subtotal + deliveryFee;

      // Frontend must provide complete customer info - no fallback needed
      const finalCustomerName = customerName;
      const finalCustomerPhone = customerPhone;

      // Create order with embedded items using Mongoose
      const createdOrder = await Order.create({
        restaurantId,
        userId,
        deliveryAddress,
        customerName: finalCustomerName || null,
        customerPhone: finalCustomerPhone || null,
        status: "pending",
        paymentStatus: "pending",
        total: total,
        items: validatedItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.price,
        })),
        createdAt: new Date(),
        confirmedAt: null,
        deliveredAt: null,
      });

      // Get the complete order with items for response
      const completeOrder = await getOrder(createdOrder._id.toString());

      logger.info("Order created in database", {
        orderId: createdOrder._id.toString(),
        total: createdOrder.total,
      });

      // Publish event AFTER database insert with the generated ID
      await publishMessage(
        producer,
        TOPICS.ORDER_CREATED,
        {
          orderId: createdOrder._id.toString(),
          restaurantId: createdOrder.restaurantId,
          items: validatedItems, // Use validated items for Kafka event
          userId: createdOrder.userId,
          total: createdOrder.total,
          createdAt: createdOrder.createdAt,
        },
        createdOrder._id.toString(),
      );

      logger.info("Order created event published", {
        orderId: createdOrder._id.toString(),
        topic: TOPICS.ORDER_CREATED,
      });

      res.status(201).json({
        message: "Order created successfully",
        order: transformOrder(completeOrder),
      });
    } catch (error) {
      logger.error("Order creation failed", {
        error: error.message,
        stack: error.stack,
        userId,
        restaurantId,
      });
      console.error(`❌ [${serviceName}] Error creating order:`, error.message);
      res
        .status(500)
        .json({ error: "Failed to create order", details: error.message });
    }
  };

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrder(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order retrieved successfully", order: transformOrder(order) });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve order", details: error.message });
  }
};

export const listOrders = async (req, res) => {
  try {
    const { status, limit } = req.query;
    const userId = req.user.userId; // Get user ID from JWT token

    const rawOrders = await getUserOrders(userId, {
      status,
      limit,
    });
    const orders = rawOrders.map(transformOrder);
    res.json({
      message: "Orders retrieved successfully",
      orders,
      total: orders.length,
    });
  } catch (error) {
    console.error(`❌ [order-service] Error retrieving orders:`, error.message);
    res
      .status(500)
      .json({ error: "Failed to retrieve orders", details: error.message });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const stats = await getOrderStatsRepo();
    res.json({ message: "Order statistics retrieved successfully", stats });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve order statistics",
      details: error.message,
    });
  }
};

export const getRestaurantOrderStatsController = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const orders = await getRestaurantOrders(restaurantId, { limit: 100 });
    const stats = {
      totalOrders: orders.length,
      todayOrders: orders.filter(o => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(o.createdAt) >= today;
      }).length,
      todayRevenue: orders
        .filter(o => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return new Date(o.createdAt) >= today;
        })
        .reduce((sum, o) => sum + o.total, 0)
        .toFixed(2),
      averagePreparationTime: 15, // Mock value
    };
    res.json({
      message: "Restaurant order statistics retrieved successfully",
      stats,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve restaurant order statistics",
      details: error.message,
    });
  }
};

export const updateOrderStatusController = async (req, res) => {
  const { orderId } = req.params;
  const { status, paymentStatus } = req.body;

  try {
    // Check if order exists first
    const existingOrder = await getOrder(orderId);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Use simple UPDATE instead of upsert
    const confirmedAt =
      status === "confirmed" ? new Date().toISOString() : null;
    const deliveredAt =
      status === "delivered" ? new Date().toISOString() : null;

    const updatedOrder = await updateOrderStatus(
      orderId,
      status,
      paymentStatus,
      confirmedAt,
      deliveredAt,
    );

    logger.info("Order status updated successfully", {
      orderId,
      oldStatus: existingOrder.status,
      newStatus: status,
    });

    res.json({
      message: "Order status updated successfully",
      order: transformOrder(updatedOrder),
    });
  } catch (error) {
    logger.error("Failed to update order status", {
      orderId,
      error: error.message,
    });
    res
      .status(500)
      .json({ error: "Failed to update order status", details: error.message });
  }
};
