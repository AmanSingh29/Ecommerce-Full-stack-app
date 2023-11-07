import React from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const CheckDetails = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="check-details-cont my-3 p-2">
        <h3 className="text-center">Check Shipping Details</h3>
        <hr />
        <div className="check-user-details">
          <div>
            <p>
              <b className="me-2">Deliver To:</b>
              {auth?.user?.name}
            </p>
            <p>
              <b className="me-2">Email:</b>
              {auth?.user?.email}
            </p>
            <p>
              <b className="me-2">Monbile No:</b>
              {auth?.user?.phone}
            </p>
            <p>
              <b className="me-2">Address:</b>
              {auth?.user?.address}
            </p>
          </div>
          <div>
            <button
              onClick={() => navigate("/dashboard/user/profile")}
              type="button"
              class="btn btn-primary"
            >
              <i className="fa-regular fa-pen-to-square me-2"></i>
              Update Details
            </button>
          </div>
        </div>
        <hr />
        <div className="proceed-btn-cont">
          <button
            onClick={() => navigate("/cart")}
            type="button"
            class="btn btn-secondary"
          >
            <i className="fa-solid fa-angles-left me-2"></i>
            Back To Cart
          </button>
          <button
            onClick={() => navigate("/payment")}
            type="button"
            class="btn btn-success"
          >
            Go To Payment
            <i className="fa-solid fa-angles-right ms-2"></i>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CheckDetails;
