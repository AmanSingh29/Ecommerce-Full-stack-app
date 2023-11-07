import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
const port = "http://localhost:5000";

const ProductByCat = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const [cart, setCart] = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    if (slug) getProducts();
  }, [slug]);

  const getProducts = () => {
    setLoading(true);
    fetch(`${port}/product/get-products/${slug}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data);
        setCategory(data.cat);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Layout>
      <div className="product-cat">
        {loading ? (
          ""
        ) : (
          <>
            <h3 className="text-center mt-3">Category: {category?.name}</h3>
            <h4 className="text-center">Total results: {products?.length}</h4>
          </>
        )}

        <div className="home-products">
          {loading ? (
            <div className="spin">
              <h3>Loading Products</h3>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            products?.map((p) => {
              return (
                <div className="product-card" key={p._id}>
                  <img
                    alt=".."
                    src={`${port}/product/product-photo/${p._id}`}
                  />
                  <div className="home-product-det">
                    <span>{p.name}</span>
                    <span>{p.price}$</span>
                  </div>
                  <div className="card-btn">
                    <button onClick={() => navigate(`/product/${p.slug}`)}>
                      <i className="fa-solid fa-circle-info"></i>
                      More details
                    </button>
                    {cart?.includes(p) ? (
                      <button disabled>
                        <i className="fa-solid fa-cart-plus"></i>
                        Added to cart
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setCart([...cart, p]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, p])
                          );
                          toast.success("Item added to cart");
                        }}
                      >
                        <i className="fa-solid fa-cart-plus"></i>
                        Add to cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductByCat;
