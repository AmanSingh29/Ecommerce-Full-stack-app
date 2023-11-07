import React from "react";
import Layout from "../components/layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const port = "http://localhost:5000";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();

  const navigate = useNavigate();

  //function to add total amount of cart products
  const totalAmount = () => {
    let total = 0;
    cart?.map((c) => (total = total + c.price));
    return total;
  };

  //function to delete product from cart
  const deleteCartItem = (pid) => {
    let myCart = [...cart];
    let index = myCart.findIndex((item) => item._id === pid);
    myCart.splice(index, 1);
    setCart(myCart);
    localStorage.setItem("cart", JSON.stringify(myCart));
    toast.success("Item removed successfully");
  };

  return (
    <Layout>
      <div className="cart-cont">
        <h2 className="text-center">Hello {auth?.user?.name}</h2>
        <h4 className="text-center">Total items in cart: {cart?.length}</h4>
        {cart?.length > 0 ? (
          cart?.map((c) => {
            return (
              <>
                <div className="cart-product" key={c._id}>
                  <div className="cart-img">
                    <img
                      alt="product"
                      src={`${port}/product/product-photo/${c._id}`}
                    />
                  </div>
                  <p>{c.name}</p>
                  <p>{c.price}$</p>
                  <i
                    onClick={() => deleteCartItem(c._id)}
                    className="fa-solid fa-trash-can delete-icon"
                  ></i>
                </div>
              </>
            );
          })
        ) : (
          <h1 className="text-center">No items in cart</h1>
        )}
        {cart?.length > 0 ? (
          <div className="checkout-box">
            {/* <p>{totalAmount()}</p> */}
            <h4 className="text-center">Checkout</h4>
            <hr />
            <p>
              <b>Total Items:</b> {cart?.length}
            </p>
            <p>
              <b>Total Amount:</b> {totalAmount()}$
            </p>
            <hr />
            <div className="checkout-btn">
              {auth?.user ? (
                <button
                  onClick={() => navigate("/check-details")}
                  type="button"
                  class="btn btn-success"
                >
                  Proceed To Checkout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login", { state: "/cart" })}
                  type="button"
                  class="btn btn-warning"
                >
                  Login To Checkout
                </button>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
