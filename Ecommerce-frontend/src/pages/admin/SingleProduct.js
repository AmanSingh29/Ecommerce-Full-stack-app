import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
import AdminMenu from "../../components/layout/AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import { Select } from "antd";
const { Option } = Select;
const port = "http://localhost:5000";

const SingleProduct = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [photo, setPhoto] = useState("");
  const [shipping, setShipping] = useState("");
  const [id, setId] = useState("");
  const [auth] = useAuth();

  //get a single product details
  const fetchSingleProduct = () => {
    fetch(`${port}/product/get-product/${slug}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.data.name);
        setDescription(data.data.description);
        setPrice(data.data.price);
        setQuantity(data.data.quantity);
        setId(data.data._id);
        setCategory(data.data.category._id);
        setShipping(data.data.shipping);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    fetchSingleProduct();
    // eslint-disable-next-line
  }, []);

  //function to get all categories
  const getAllCategories = () => {
    fetch(`${port}/category/get-category`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data?.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  //function to create product
  const handleUpdateProduct = () => {
    const productData = new FormData();
    productData.append("name", name);
    productData.append("description", description);
    productData.append("price", price);
    productData.append("category", category);
    productData.append("quantity", quantity);
    photo && productData.append("photo", photo);
    productData.append("shipping", shipping);
    fetch(`${port}/product/update-product/${id}`, {
      method: "PUT",
      headers: {
        Authorization: auth?.token,
      },
      body: productData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          navigate("/dashboard/admin/products");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteProduct = () => {
    fetch(`${port}/product/delete-product/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: auth?.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          navigate("/dashboard/admin/products");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Layout>
      <div className="container m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <div className="m-1 w-75">
              <Select
                value={category}
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select"
                onChange={(value) => {
                  setCategory(value);
                }}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="my-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  ></input>
                </label>
              </div>
              <div>
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={`${port}/product/product-photo/${id}`}
                      alt="product"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <h5 className="text-center mt-3">Product Details</h5>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Enter Product Name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="Enter Product Description.."
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Enter Product Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Product Quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => setShipping(value)}
                  value={shipping ? "Yes" : "No"}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => handleUpdateProduct()}
                >
                  Update Product
                </button>
              </div>
              <div className="mb-3">
                <button
                  className="btn btn-danger w-100"
                  onClick={() => handleDeleteProduct()}
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleProduct;
