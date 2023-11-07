import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import CategoryForm from "../../components/form/categoryForm";
const port = "http://localhost:5000";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState(null);
  const [upatedName, setUpatedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();

  //function to get all categories
  const getAllCategories = () => {
    setLoading(true);
    fetch(`${port}/category/get-category`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  //handle category form
  const handleCategoryForm = (e) => {
    e.preventDefault();
    fetch(`${port}/category/create-category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth?.token,
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          getAllCategories();
          setName("");
        }
      })
      .catch((error) => console.log(error));
  };

  //function to delete a category
  const dealeteCat = (catId) => {
    fetch(`${port}/category/delete-category/${catId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth?.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Category Deleted Successfully");
          getAllCategories();
        }
      });
  };

  //function to update category
  const handleUpdate = () => {
    fetch(`${port}/category/update-category/${selected}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth?.token,
      },
      body: JSON.stringify({
        name: upatedName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          getAllCategories();
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
            <h1>Manage Category</h1>
            {loading ? (
              <div className="spin">
                <h3>Loading Categories</h3>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <CategoryForm
                  value={name}
                  handleCategoryForm={handleCategoryForm}
                  setName={setName}
                />
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories?.map((c, i) => {
                        return (
                          <tr key={c._id}>
                            <th scope="row">{i + 1}</th>
                            <td>{c.name}</td>
                            <td>
                              <button
                                onClick={() => {
                                  setUpatedName(c.name);
                                  setSelected(c._id);
                                }}
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#editCat"
                              >
                                Edit
                              </button>
                              <i
                                onClick={() => dealeteCat(c._id)}
                                className="fa-solid fa-trash-can delete-icon"
                              ></i>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* modal */}
      <div
        className="modal fade"
        id="editCat"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Update Category
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <input
                  type="text"
                  value={upatedName}
                  onChange={(e) => setUpatedName(e.target.value)}
                  className="form-control"
                  aria-describedby="emailHelp"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                data-bs-dismiss="modal"
                className="btn btn-primary"
                onClick={() => handleUpdate()}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
