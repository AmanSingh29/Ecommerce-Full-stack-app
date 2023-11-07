import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/routes/Private";
import AdminRoute from "./components/routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateCategory from "./pages/admin/CreateCategory";
import CreateProduct from "./pages/admin/CreateProduct";
import Users from "./pages/admin/Users";
import MyOrders from "./pages/user/MyOrders";
import Profile from "./pages/user/Profile";
import Products from "./pages/admin/Products";
import SingleProduct from "./pages/admin/SingleProduct";
import SearchPage from "./pages/SearchPage";
import ProductDeatils from "./pages/ProductDeatils";
import ProductByCat from "./pages/ProductByCat";
import CartPage from "./pages/CartPage";
import CheckDetails from "./pages/CheckDetails";
import Payment from "./pages/Payment";
import AllOrders from "./pages/admin/AllOrders";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/cart" element={<CartPage />} />
        <Route exact path="/payment" element={<Payment />} />
        <Route exact path="/check-details" element={<CheckDetails />} />
        <Route exact path="/product/:slug" element={<ProductDeatils />} />
        <Route exact path="/products/:slug" element={<ProductByCat />} />
        <Route exact path="/search" element={<SearchPage />} />
        <Route exact path="/dashboard" element={<PrivateRoute />}>
          <Route exact path="user" element={<Dashboard />} />
          <Route exact path="user/orders" element={<MyOrders />} />
          <Route exact path="user/profile" element={<Profile />} />
        </Route>
        <Route exact path="/dashboard" element={<AdminRoute />}>
          <Route exact path="admin" element={<AdminDashboard />} />
          <Route
            exact
            path="admin/create-category"
            element={<CreateCategory />}
          />
          <Route
            exact
            path="admin/create-product"
            element={<CreateProduct />}
          />
          <Route exact path="admin/orders" element={<AllOrders />} />
          <Route exact path="admin/products" element={<Products />} />
          <Route exact path="admin/product/:slug" element={<SingleProduct />} />
          <Route exact path="admin/users" element={<Users />} />
        </Route>
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/resetpass" element={<ResetPassword />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
