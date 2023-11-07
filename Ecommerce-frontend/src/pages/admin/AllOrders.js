import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import { toast } from "react-toastify";
const port = "http://localhost:5000";
const { Option } = Select;

const AllOrders = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "shipped",
    "Delivered",
    "Canceled",
  ]);
  const [changeStatus, setChangeStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChangeStatus = (value, id) => {
    fetch(`${port}/order/update-status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth?.token,
      },
      body: JSON.stringify({ status: value }),
    })
      .then((res) => res.json())
      .then((data) => {
        fetchAllOrders();
        toast.success(data.success);
      })
      .catch((error) => console.log(error));
  };

  const fetchAllOrders = () => {
    setLoading(true);
    fetch(`${port}/order/all-orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth?.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (auth) fetchAllOrders();
  }, [auth]);

  return (
    <Layout>
      <div className="container m-auto p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">AllOrders</h1>
            {loading ? (
              <div className="spin">
                <h3>Loading Products</h3>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              orders?.map((c, i) => {
                return (
                  <div key={c._id} className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Buyer</th>
                          <th scope="col">Status</th>
                          <th scope="col">Payment</th>
                          <th scope="col">Date</th>
                          <th scope="col">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr key={c._id}>
                          <th scope="row">{i + 1}</th>
                          <td>{c?.buyer?.name}</td>
                          <td>
                            <Select
                              onChange={(value) =>
                                handleChangeStatus(value, c._id)
                              }
                              defaultValue={c?.status}
                            >
                              {status.map((s, i) => {
                                return (
                                  <Option key={i} value={s}>
                                    {s}
                                  </Option>
                                );
                              })}
                            </Select>
                          </td>
                          <td>{c?.payment?.success ? "Success" : "Pending"}</td>
                          <td>{moment(c?.createdAt).fromNow()}</td>
                          <td>{c?.products?.length}</td>
                        </tr>
                      </tbody>
                    </table>
                    {c?.products?.map((p) => {
                      return (
                        <>
                          <div className="orders-product" key={p._id}>
                            <div className="cart-img">
                              <img
                                alt="product"
                                src={`${port}/product/product-photo/${p._id}`}
                              />
                            </div>
                            <p>{p.name}</p>
                            <p>{p.price}$</p>
                            <i
                              onClick={() => navigate(`/product/${p.slug}`)}
                              className="fa-solid fa-circle-info"
                              style={{
                                color: "#3776e1",
                                fontSize: "30px",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                        </>
                      );
                    })}
                    <hr />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllOrders;
