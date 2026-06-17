import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      default: 0.0,
      min: [0, 'Price must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please add product stock count'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600',
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
