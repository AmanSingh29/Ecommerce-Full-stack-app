import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth";
const port = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();

  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`${port}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          localStorage.setItem("auth", JSON.stringify(data));
          toast.success("Login Successfully");
          setAuth({
            ...auth,
            user: data.user,
            token: data.token,
          });
          navigate(location.state || "/");
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
        <form onSubmit={(e) => handleLogin(e)}>
          <h3>Welcome To Ecommerce</h3>
          <h4>Login Here..</h4>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>
          <button type="submit">Login</button>
          <Link
            to={"/resetpass"}
            style={{ textDecoration: "none" }}
            className="my-2 fw-bold"
          >
            Forget Password?
          </Link>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
