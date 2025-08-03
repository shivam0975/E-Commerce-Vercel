import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage when component mounts
  useEffect(() => {
    const cart = localStorage.getItem('cartItems');
    if (cart) setCartItems(JSON.parse(cart));
  }, []);

  // Save cart items to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add a product to the cart or update quantity if already exists
  const addToCart = (product, qty) => {
    setCartItems((prev) => {
      const exist = prev.find((x) => x._id === product._id);
      if (exist) {
        return prev.map((x) =>
          x._id === product._id ? { ...x, qty: x.qty + qty } : x
        );
      } else {
        return [...prev, { ...product, qty }];
      }
    });
  };

  // Remove a product from the cart by id
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((x) => x._id !== id));
  };

  // Update the quantity of a product in the cart
  const updateQty = (id, qty) => {
    setCartItems((prev) =>
      prev.map((x) => (x._id === id ? { ...x, qty } : x))
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total number of items in cart
  const cartCount = cartItems.reduce((acc, cur) => acc + cur.qty, 0);

  // Calculate total price for all items in cart
  const cartTotal = cartItems.reduce((acc, cur) => acc + cur.price * cur.qty, 0);

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
}

export function useCart() {
  return useContext(CartContext);
}
