export function transformKitchenOrder(order) {
  return {
    id: order._id?.toString(),

    // frontend expects: order_id
    order_id: order.orderId?.toString(),

    restaurant_id: order.restaurantId?.toString(),
    user_id: order.userId?.toString(),

    // keep arrays and objects unchanged
    items: order.items || [],

    delivery_address: order.deliveryAddress,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,

    total: order.total,
    status: order.status,

    // timestamps transformed to snake_case
    received_at: order.receivedAt,
    started_at: order.startedAt,
    estimated_ready_time: order.estimatedReadyTime,
    ready_at: order.readyAt,
    preparation_time: order.preparationTime,

    created_at: order.createdAt,
    updated_at: order.updatedAt,
  };
}

export function transformRestaurant(restaurant) {
  if (!restaurant) return null;
  const r = restaurant.toObject ? restaurant.toObject() : restaurant;
  return {
    ...r,
    id: r._id?.toString(),
    ownerId: r.ownerId?.toString(),
  };
}

export function transformMenuItem(item) {
  if (!item) return null;
  const i = item.toObject ? item.toObject() : item;
  return {
    ...i,
    itemId: i._id?.toString(), // Frontend expects itemId
    restaurantId: i.restaurantId?.toString(),
  };
}