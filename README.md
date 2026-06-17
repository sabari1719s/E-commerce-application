# Full-Stack E-Commerce Web Application

A modern, high-fidelity e-commerce application featuring custom styling, user role management, catalog filtering, cart state management, checkout, and live order tracking.

## Tech Stack
- **Frontend**: React (Vite), React Router, Custom Glassmorphism CSS, Lucide Icons
- **Backend**: Node.js, Express, JSON Web Token (JWT), bcryptjs
- **Database**: MongoDB (Mongoose ODM)

## Features
- **Catalog Page**: Dynamic search, filtering by category, and sorting.
- **Product Details**: Inventory status, details, description, dynamic sizing/badge options, and cart quantity additions.
- **Shopping Cart**: Fully stateful, persistent, item edits.
- **Role-Based Login**:
  - **Admin**: Create, Edit, Delete products; View and update order shipment status.
  - **User**: View catalog, manage cart, place orders with simulated payment, track active order status.
- **Order Tracking**: Visual status progression (Pending -> Shipped -> Delivered).

## Getting Started

1. Set the repository workspace:
   `C:\Users\Sabari\.gemini\antigravity-ide\scratch\ecommerce-app`
2. Spin up MongoDB (started automatically in user-space):
   `npm run db` (if not already running)
3. Start backend & frontend concurrently:
   `npm run dev`
