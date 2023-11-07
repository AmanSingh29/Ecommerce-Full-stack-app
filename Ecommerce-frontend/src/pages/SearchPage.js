import React from "react";
import Layout from "../components/layout/Layout";
import { useSearch } from "../context/Search";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const port = "http://localhost:5000";

const SearchPage = () => {
  const [values] = useSearch();
  const [cart, setCart] = useCart();

  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container">
        <div className="text-center">
          <h2>Results</h2>
          <h5>
            {values?.results?.length < 1
              ? "No Product Found"
              : `${values?.results?.length} Product Found`}
          </h5>
          <div className="home-products">
            {values?.results?.map((p) => {
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
                      <i class="fa-solid fa-circle-info"></i>
                      More details
                    </button>
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
                      <i class="fa-solid fa-cart-plus"></i>
                      Add to cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
