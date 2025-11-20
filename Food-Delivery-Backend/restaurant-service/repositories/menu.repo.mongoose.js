import { MenuItem } from "../db/mongoose-schema.js";

export async function upsertMenuItem(menuItemData) {
  // If itemId is provided, update
  if (menuItemData.itemId) {
    const existing = await MenuItem.findById(menuItemData.itemId);
    if (existing) {
      // Map fields
      if (menuItemData.restaurantId) existing.restaurantId = menuItemData.restaurantId;
      if (menuItemData.name) existing.name = menuItemData.name;
      if (menuItemData.description) existing.description = menuItemData.description;
      if (menuItemData.price) existing.price = menuItemData.price;
      if (menuItemData.category) existing.category = menuItemData.category;
      if (menuItemData.isAvailable !== undefined) existing.isAvailable = menuItemData.isAvailable;
      if (menuItemData.preparationTime) existing.preparationTime = menuItemData.preparationTime;
      if (menuItemData.imageUrl) existing.imageUrl = menuItemData.imageUrl;
      
      await existing.save();
      return existing.toObject();
    }
  }

  // Create new
  const newItem = new MenuItem({
    ...menuItemData,
    // Ensure restaurantId is set
    restaurantId: menuItemData.restaurantId
  });
  await newItem.save();
  return newItem.toObject();
}

export async function getMenuItems(restaurantId, filters = {}) {
  const query = { restaurantId };

  if (filters.category) {
    query.category = { $regex: new RegExp(filters.category, "i") };
  }
  if (filters.isAvailable !== undefined) {
    query.isAvailable = filters.isAvailable;
  }

  let dbQuery = MenuItem.find(query).sort({ category: 1, name: 1 });

  if (filters.limit) {
    dbQuery = dbQuery.limit(Number(filters.limit));
  }

  // Map result to match expected output format (snake_case to camelCase if needed, or just plain)
  // The original repo returned snake_case keys because of Drizzle mapping.
  // We should return camelCase as Mongoose does, but we might need to adapt the controller.
  // For now, we return standard Mongoose objects (camelCase).
  const items = await dbQuery;
  return items.map(item => item.toObject());
}

export async function getMenuItemById(itemId) {
  const item = await MenuItem.findById(itemId);
  return item ? item.toObject() : null;
}

export async function deleteMenuItemRow(restaurantId, itemId) {
  await MenuItem.findOneAndDelete({ _id: itemId, restaurantId });
}

export async function setMenuItemAvailability(restaurantId, itemId, isAvailable) {
  await MenuItem.findOneAndUpdate(
    { _id: itemId, restaurantId },
    { isAvailable }
  );
}

export async function getMenuItemsByIds(restaurantId, itemIds) {
  const items = await MenuItem.find({
    restaurantId,
    _id: { $in: itemIds }
  });
  return items.map(item => item.toObject());
}
