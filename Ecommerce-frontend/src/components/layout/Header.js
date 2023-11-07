import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import { useCategory } from "../../hooks/useCategory";
import SearchInput from "../form/SearchInput";
import { useCart } from "../../context/cart";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const category = useCategory();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <Link style={{ fontWeight: "600" }} className="navbar-brand" to={"/"}>
            <i className="fa-solid fa-bag-shopping"></i> Ecommerce
          </Link>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <SearchInput />
            <li className="nav-item">
              <NavLink className="nav-link " aria-current="page" to={"/"}>
                Home
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                {category?.map((c) => {
                  return (
                    <li key={c._id}>
                      <Link
                        className="dropdown-item"
                        to={`/products/${c.slug}`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            {!auth.user ? (
              <>
                {" "}
                <li className="nav-item">
                  <NavLink className="nav-link" to={"/login"}>
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to={"/register"}>
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    // eslint-disable-next-line
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {auth?.user?.name}
                  </Link>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li className="nav-item">
                      <NavLink
                        onClick={() => handleLogout()}
                        className="dropdown-item"
                        to={"/login"}
                      >
                        Logout
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to={`/dashboard/${
                          auth?.user?.role === 1 ? "admin" : "user"
                        }`}
                      >
                        Dashboard
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to={"/cart"}>
                <i className="fa-solid fa-cart-shopping fs-5"></i>
                <div className="cart-length"> {cart?.length}</div>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
