import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const cartItemSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to MenuItem in restaurant-service
    quantity: { type: Number, required: true, min: 1 },
  },
  {
    timestamps: true,
  },
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, unique:true, trim: true },
    role: {
      type: String,
      required: true,
      default: "customer",
      enum: ["customer", "admin", "driver", "restaurant"],
    },
    isActive: { type: Boolean, default: true },
    addresses: [addressSchema],
    cart: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);


// Export only the User model (Address and CartItem are embedded subdocuments)
export const User = mongoose.model("User", userSchema);
export { userSchema };
