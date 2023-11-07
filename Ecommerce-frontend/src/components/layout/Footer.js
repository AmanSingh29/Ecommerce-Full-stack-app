import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <span>Links</span>
      <div className="foot-links">
        <hr />
        <Link to={"/products/women-fashion"}>WOMEN</Link> |{" "}
        <Link to={"/products/kids-fashion"}>KIDS</Link> |{" "}
        <Link to={"/products/men-fashion"}>MEN</Link> |{" "}
        <Link to={"/products/mobiles"}>MOBILES</Link> |{" "}
        <Link to={"/products/watches"}>WATCHES</Link>
        <hr />
      </div>
      <div className="copy">Copyright &copy; Aman Singh</div>
    </div>
  );
};

export default Footer;
