import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { toast } from "react-toastify";
const port = "http://localhost:5000";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [password, setPassword] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    // console.log(email, answer, password);
    fetch(`${port}/auth/resetpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        answer,
        newPass: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          navigate("/login");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Layout>
      <div className="login-form shadow">
        <div className="form-img">
          <img alt="" src={require("../images/login-img/login.webp")} />
        </div>
        <form onSubmit={(e) => handleReset(e)}>
          <h3>Welcome To Ecommerce</h3>
          <h4>Reset Password</h4>
          <div className="mb-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="mb-3">
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              type="text"
              placeholder="Secret answer: What is your best friend's name?"
            />
          </div>
          <div className="mb-3">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="New Password"
            />
          </div>
          <button type="submit">Reset</button>
        </form>
      </div>
    </Layout>
  );
};

export default ResetPassword;
