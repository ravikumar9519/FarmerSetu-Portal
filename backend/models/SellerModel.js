import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
  },
  { minimize: false }
);

// 🔐 Compound unique index on (email, speciality)
SellerSchema.index(
  { email: 1, speciality: 1 },
  { unique: true }
);

const SellerModel =
  mongoose.models.sellers || mongoose.model("sellers", SellerSchema);

export default SellerModel;
