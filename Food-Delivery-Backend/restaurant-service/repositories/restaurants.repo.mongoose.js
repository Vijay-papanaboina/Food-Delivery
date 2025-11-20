import { Restaurant } from "../db/mongoose-schema.js";

export async function upsertRestaurant(restaurantData) {
  // If ID is provided, try to find and update
  if (restaurantData.id) {
    const existing = await Restaurant.findById(restaurantData.id);
    if (existing) {
      Object.assign(existing, restaurantData);
      await existing.save();
      return existing.toObject();
    }
  }

  // Otherwise create new
  // Note: Mongoose generates _id automatically, so we don't need to pass it if it's new
  // But if we want to preserve the UUID from the input as _id (if it's a migration), we can try
  // However, Mongoose _id is ObjectId by default. 
  // The user wants to migrate to MongoDB, so we should let Mongo generate IDs.
  // BUT, if the input `restaurantData` comes from a seed script with specific IDs, we might need to handle that.
  // For now, we'll assume standard Mongoose behavior: new doc = new _id.
  
  const newRestaurant = new Restaurant(restaurantData);
  await newRestaurant.save();
  return newRestaurant.toObject();
}

// Helper to transform restaurant document
function transformRestaurant(r) {
  if (!r) return null;
  return {
    restaurant_id: r._id.toString(),
    id: r._id.toString(),
    owner_id: r.ownerId.toString(),
    name: r.name,
    cuisine: r.cuisine,
    address: r.address,
    phone: r.phone,
    rating: r.rating,
    delivery_time: r.deliveryTime,
    delivery_fee: r.deliveryFee,
    is_open: r.isOpen,
    opening_time: r.openingTime,
    closing_time: r.closingTime,
    is_active: r.isActive,
    image_url: r.imageUrl,
    created_at: r.createdAt,
  };
}

export async function getRestaurant(restaurantId) {
  const restaurant = await Restaurant.findById(restaurantId).lean();
  return transformRestaurant(restaurant);
}

export async function getRestaurantByOwner(ownerId) {
  const restaurant = await Restaurant.findOne({ ownerId }).lean();
  return transformRestaurant(restaurant);
}

export async function getRestaurants(filters = {}) {
  const query = {};

  if (filters.cuisine) {
    query.cuisine = { $regex: new RegExp(filters.cuisine, "i") };
  }
  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }
  if (filters.minRating) {
    query.rating = { $gte: Number(filters.minRating) };
  }

  let dbQuery = Restaurant.find(query).sort({ rating: -1 });

  if (filters.limit) {
    dbQuery = dbQuery.limit(Number(filters.limit));
  }

  const restaurants = await dbQuery.lean();

  // Transform to match original Drizzle output format (snake_case)
  return restaurants.map(r => ({
    restaurant_id: r._id.toString(),
    id: r._id.toString(), // Frontend might expect 'id' or 'restaurant_id'
    owner_id: r.ownerId.toString(),
    name: r.name,
    cuisine: r.cuisine,
    address: r.address,
    phone: r.phone,
    rating: r.rating,
    delivery_time: r.deliveryTime,
    delivery_fee: r.deliveryFee,
    is_open: r.isOpen,
    opening_time: r.openingTime,
    closing_time: r.closingTime,
    is_active: r.isActive,
    image_url: r.imageUrl,
    created_at: r.createdAt,
  }));
}

export async function toggleRestaurantStatus(restaurantId, isOpen) {
  await Restaurant.findByIdAndUpdate(restaurantId, { isOpen });
}

export async function getRestaurantStatus(restaurantId) {
  return await Restaurant.findById(restaurantId)
    .select("isOpen openingTime closingTime isActive")
    .lean();
}

export async function getRestaurantStats() {
  const totalRestaurants = await Restaurant.countDocuments();
  const activeRestaurants = await Restaurant.countDocuments({ isActive: true });
  
  const ratingResult = await Restaurant.aggregate([
    { $group: { _id: null, avgRating: { $avg: "$rating" } } }
  ]);
  const averageRating = ratingResult.length > 0 
    ? Number(ratingResult[0].avgRating.toFixed(2)) 
    : 0;

  const cuisineResult = await Restaurant.aggregate([
    { $group: { _id: "$cuisine", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const byCuisine = {};
  cuisineResult.forEach(item => {
    byCuisine[item._id] = item.count;
  });

  return {
    totalRestaurants,
    activeRestaurants,
    averageRating,
    byCuisine,
  };
}
