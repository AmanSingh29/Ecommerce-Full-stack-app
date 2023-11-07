import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { useParams } from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
const port = "http://localhost:5000";

const ProductDeatils = () => {
  const [product, setProduct] = useState({});
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);

  const { slug } = useParams();

  useEffect(() => {
    if (slug) getProduct();
  }, [slug]);

  const getProduct = () => {
    setLoading(true);
    fetch(`${port}/product/get-product/${slug}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Layout>
      {loading ? (
        <div className="spin">
          <h3>Loading Product</h3>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="single-product">
          <div className="pro-img">
            <img
              alt="product"
              src={`${port}/product/product-photo/${product?._id}`}
            />
          </div>
          <div className="pro-det">
            <p>{product?.name}</p>
            <p>
              <b>Description</b>: {product?.description}
            </p>
            <p>
              <b>Category</b>: {product?.category?.name}
            </p>
            <p>
              <b>Price</b>: {product?.price}$
            </p>
            <p>
              <b>Shipping</b>: {product.shipping ? "Yes" : "No"}
            </p>
            {cart?.includes(product._id) ? (
              <button className="detail-btn" disabled>
                <i class="fa-solid fa-cart-plus me-2"></i>Added To Cart
              </button>
            ) : (
              <button
                className="detail-btn"
                onClick={() => {
                  setCart([...cart, product]);
                  localStorage.setItem(
                    "cart",
                    JSON.stringify([...cart, product])
                  );
                  toast.success("Item added to cart");
                }}
              >
                <i class="fa-solid fa-cart-plus me-2"></i>Add To Cart
              </button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProductDeatils;
