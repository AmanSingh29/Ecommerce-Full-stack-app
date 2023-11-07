import { useState, useContext, useEffect, createContext } from "react";

const CartContext = createContext();

const CartProvider = (props) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartItem = localStorage.getItem("cart");
    if (cartItem) setCart(JSON.parse(cartItem));
  }, []);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {props.children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
