import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true},
    description: { type: String, required: true},
    price: { type: Number, required: true },
    image: { type: String, required: true },
    countInStock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);