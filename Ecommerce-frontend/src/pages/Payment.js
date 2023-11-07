import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import DropIn from "braintree-web-drop-in-react";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const port = "http://localhost:5000";

const Payment = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //get payment function
  const getToken = () => {
    setLoading(true);
    fetch(`${port}/product/braintree/token`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setClientToken(data?.clientToken);
        setLoading(false);
      });
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  const handlePayment = async () => {
    const { nonce } = await instance.requestPaymentMethod();
    try {
      setLoading(true);
      fetch(`${port}/product/braintree/payment`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: auth?.token,
        },
        body: JSON.stringify({ nonce, cart }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          localStorage.removeItem("cart");
          setCart([]);
          navigate("/dashboard/user/orders");
          toast.success("Order Successfully");
        });
    } catch (error) {
      console.log(error);
    }
  };
  //function to add total amount of cart products
  const totalAmount = () => {
    let total = 0;
    cart?.map((c) => (total = total + c.price));
    return total;
  };

  return (
    <Layout>
      <div className="final-pay">
        {cart?.map((c) => {
          return (
            <div
              className="d-flex w-100 justify-content-between align-items-center shadow p-3"
              style={{ height: "150px" }}
            >
              <img
                style={{ height: "100%" }}
                src={`${port}/product/product-photo/${c._id}`}
                alt="product"
              />
              <p>{c.name}</p>
              <p>{c.price}$</p>
            </div>
          );
        })}
      </div>
      <h1 className="text-center">Payment</h1>
      <div className="container m-auto">
        {!clientToken || !cart?.length ? (
          ""
        ) : (
          <div>
            <DropIn
              options={{
                authorization: clientToken,
                paypal: {
                  flow: "vault",
                },
              }}
              onInstance={(instance) => setInstance(instance)}
            />
            <button
              disabled={loading || !instance}
              className="btn btn-success w-100"
              onClick={() => handlePayment()}
            >
              {loading ? "Processing..." : `Pay ${totalAmount()}$ Now`}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Payment;
