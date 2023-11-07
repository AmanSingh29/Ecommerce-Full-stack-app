import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
const port = "http://localhost:5000";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();

  //function to get all categories
  const getAllCategories = () => {
    fetch(`${port}/category/get-category`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data);
      })
      .catch((error) => console.log(error));
  };

  const fetchAllProducts = () => {
    setLoading(true);
    fetch(`${port}/product/get-product`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data);
        setTotalPage(Math.ceil(data.data.length / 6));
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  //filter category function
  const handleFilter = (value, id) => {
    let allCat = [...checked];
    if (value) {
      allCat.push(id);
    } else {
      allCat = allCat.filter((c) => c !== id);
    }
    setChecked(allCat);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (!checked.length || !radio.length) fetchAllProducts();
  }, [checked.length, radio.length]);

  const filterProducts = () => {
    setLoading(true);
    fetch(`${port}/product/filter-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ checked, radio }),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data?.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (checked.length || radio.length) filterProducts();
  }, [checked, radio]);

  //pagination functions

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const preDisable = currentPage === 1;
  const NextDisabled = currentPage === totalPage;

  const productPerPage = 6;
  const startIndex = (currentPage - 1) * productPerPage;
  const endIndex = startIndex + productPerPage;
  const productDisplay = products.slice(startIndex, endIndex);

  return (
    <Layout>
      <>
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={0}
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            />
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={1}
              aria-label="Slide 2"
            />
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={2}
              aria-label="Slide 3"
            />
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src={require("../images/carasoul/e-1.jpg")}
                className="d-block w-100"
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src={require("../images/carasoul/e-2.jpg")}
                className="d-block w-100"
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src={require("../images/carasoul/e-3.jpg")}
                className="d-block w-100"
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </>
      <div className="container m-3 p-3 m-auto">
        <div className="row">
          <div className="col-md-2">
            <h4>Filter by category</h4>
            <div className="d-flex flex-column">
              {categories.map((c) => {
                return (
                  <div key={c._id}>
                    <Checkbox
                      className="fs-5 my-1"
                      onChange={(e) => {
                        handleFilter(e.target.checked, c._id);
                      }}
                    >
                      {c.name}
                    </Checkbox>
                  </div>
                );
              })}
            </div>
            <h4>Filter by Price</h4>
            <div className="d-flex flex-column">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((p) => {
                  return (
                    <div key={p._id}>
                      <Radio className="fs-6 my-1" value={p.array}>
                        {p.name}
                      </Radio>
                    </div>
                  );
                })}
              </Radio.Group>
            </div>
            <div>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-danger mt-3"
              >
                Clear Filter
              </button>
            </div>
          </div>
          <div className="col-md-10">
            <h2>Products</h2>
            <div className="home-products">
              {loading ? (
                <div className="spin">
                  <h3>Loading Products</h3>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                productDisplay?.map((p) => {
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
            <div className="page-cont">
              <button
                className="btn btn-primary"
                onClick={handlePreviousPage}
                disabled={preDisable}
              >
                <i className="fa-solid fa-angles-left"></i>
                Prev
              </button>
              <div>
                {Array.from({ length: totalPage }, (_, i) => {
                  return (
                    <>
                      <button
                        className="btn btn-outline-secondary mx-1"
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        disabled={i + 1 === currentPage}
                      >
                        {i + 1}
                      </button>
                    </>
                  );
                })}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleNextPage}
                disabled={NextDisabled}
              >
                Next
                <i className="fa-solid fa-angles-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
