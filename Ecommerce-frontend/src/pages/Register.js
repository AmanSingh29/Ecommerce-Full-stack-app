import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { toast } from "react-toastify";
const port = "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [answer, setAnswer] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    fetch(`${port}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        password,
        answer,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("User Successfully Registered");
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
        <form onSubmit={(e) => handleRegister(e)}>
          <h3>Welcome To Ecommerce</h3>
          <h4>Register Here..</h4>
          <div className="mb-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
            />
          </div>
          <div className="mb-2">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              placeholder="Phone Number"
            />
          </div>
          <div className="mb-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="mb-2">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="mb-2">
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              type="text"
              placeholder="Secret question: What is your best friend's name?"
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
