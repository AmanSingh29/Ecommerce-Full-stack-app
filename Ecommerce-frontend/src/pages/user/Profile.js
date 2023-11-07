import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
const port = "http://localhost:5000";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const { name, phone, address } = auth?.user;
    setAddress(address);
    setName(name);
    setPhone(phone);
  }, [auth?.user]);

  const updateProfile = () => {
    fetch(`${port}/auth/update-user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth?.token,
      },
      body: JSON.stringify({
        name,
        phone,
        address,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setAuth({ ...auth, user: data.result });
        let ls = JSON.parse(localStorage.getItem("auth"));
        ls.user = data.result;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success(data.success);
      });
  };

  return (
    <Layout>
      <div className="container m-auto p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div
              className="modal fade"
              id="profileUpdate"
              tabIndex={-1}
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Update Profile
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    />
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Name
                        </label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputPassword1"
                          className="form-label"
                        >
                          phone
                        </label>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          type="text"
                          className="form-control"
                          id="exampleInputPassword1"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputPassword1"
                          className="form-label"
                        >
                          Address
                        </label>
                        <input
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          type="text"
                          className="form-control"
                          id="exampleInputPassword1"
                        />
                      </div>
                    </form>
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
                      onClick={() => updateProfile()}
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-primary"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-details">
              <h2>My profile</h2>
              <p>
                <b>Name</b>: {auth?.user?.name}
              </p>
              <p>
                <b>Email</b>: {auth?.user?.email}
              </p>
              <p>
                <b>Phone</b>: {auth?.user?.phone}
              </p>
              <p>
                <b>Address</b>: {auth?.user?.address}
              </p>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#profileUpdate"
              >
                <i className="fa-regular fa-pen-to-square me-2"></i>
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
