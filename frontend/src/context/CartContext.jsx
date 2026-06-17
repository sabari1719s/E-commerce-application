import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        console.error('Error parsing cart items:', err);
      }
    }
  }, []);

  // Save cart items to localStorage whenever cart changes
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const addToCart = (product, qty = 1) => {
    const existingItem = cartItems.find((item) => item.product === product._id);

    if (existingItem) {
      // Check if updating quantity doesn't exceed stock
      const newQty = existingItem.qty + qty;
      if (newQty > product.stock) {
        alert(`Cannot add more. Only ${product.stock} items available in stock.`);
        return;
      }
      
      const updatedItems = cartItems.map((item) =>
        item.product === product._id ? { ...item, qty: newQty } : item
      );
      saveCart(updatedItems);
    } else {
      const newItem = {
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: qty,
        stock: product.stock, // Carry stock number for inline validations
      };
      saveCart([...cartItems, newItem]);
    }
  };

  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter((item) => item.product !== productId);
    saveCart(updatedItems);
  };

  const updateQty = (productId, qty) => {
    const item = cartItems.find((i) => i.product === productId);
    if (!item) return;

    if (qty > item.stock) {
      alert(`Only ${item.stock} items left in stock.`);
      return;
    }
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.product === productId ? { ...item, qty: Number(qty) } : item
    );
    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
