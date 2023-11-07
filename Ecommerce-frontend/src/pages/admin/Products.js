import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/layout/AdminMenu";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
const port = "http://localhost:5000";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

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

  useEffect(() => {
    fetchAllProducts();
    // eslint-disable-next-line
  }, []);

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
      <div className="container m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All products</h1>
            <div className="product-cont">
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
                    <div key={p._id} className="card">
                      <img
                        src={`${port}/product/product-photo/${p._id}`}
                        className="card-img-top"
                        alt="..."
                      />
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">{p.description}</p>
                        <Link
                          to={`/dashboard/admin/product/${p.slug}`}
                          className="btn btn-primary"
                        >
                          Edit
                        </Link>
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

export default Products;
