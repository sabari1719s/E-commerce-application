import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed default data if database is empty
    await seedDatabase();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Check if users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding default users...');
      
      // Create admin and regular user
      // Pre-save middleware in User.js will hash the password
      await User.create([
        {
          name: 'Store Administrator',
          email: 'admin@store.com',
          password: 'admin123',
          role: 'admin',
        },
        {
          name: 'Jane Customer',
          email: 'user@store.com',
          password: 'user123',
          role: 'user',
        },
      ]);
      console.log('Users seeded successfully! (admin@store.com / admin123, user@store.com / user123)');
    }

    // Check if products exist
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding initial products...');
      await Product.create([
        {
          name: 'Cosmic Sound Pro Headphones',
          description: 'Experience audio nirvana with active noise cancellation, premium memory foam earcups, and 40-hour battery life.',
          price: 199.99,
          category: 'Electronics',
          stock: 12,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        },
        {
          name: 'Neo Glow Mechanical Keyboard',
          description: 'Tactile hot-swappable switches, dynamic customizable RGB backlighting, and a premium aluminum alloy deck.',
          price: 129.99,
          category: 'Electronics',
          stock: 8,
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
        },
        {
          name: 'Nebula Windbreaker Jacket',
          description: 'Weatherproof, lightweight ripstop material featuring high-contrast reflective detailing and standard custom sizing.',
          price: 89.99,
          category: 'Apparel',
          stock: 15,
          image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
        },
        {
          name: 'Aero-Comfort Ergonomic Chair',
          description: '3D adjustable armrests, adaptive lumbar support, and highly breathable mesh structure for long study or coding sessions.',
          price: 349.99,
          category: 'Home & Living',
          stock: 5,
          image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80',
        },
        {
          name: 'Stealth Sleek Water Bottle',
          description: 'Double-walled vacuum insulation keeping beverages cold for 24 hours or hot for 12 hours. Matte black finishing.',
          price: 39.99,
          category: 'Home & Living',
          stock: 25,
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
        },
        {
          name: 'Infinity Smartwatch Series X',
          description: 'Full-color OLED screen, heart-rate tracking, GPS route tracking, and custom notification widget sync.',
          price: 249.99,
          category: 'Electronics',
          stock: 10,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        },
        {
          name: 'Pixel Art RGB Lamp',
          description: 'A smart light lamp that syncs with your PC or smart home to project beautiful customizable retro animations.',
          price: 59.99,
          category: 'Home & Living',
          stock: 18,
          image: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=800&auto=format&fit=crop&q=80',
        },
      ]);
      console.log('Products seeded successfully!');
    }
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
  }
};

export default connectDB;
