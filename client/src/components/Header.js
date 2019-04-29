import React from "react";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <nav>
      <div className="nav-wrapper red lighten-2 ">
        <span
          to="/"
          className="brand-logo right "
          style={{ paddingRight: "40px" }}
        >
          {/* OP wat */}
          {/* <img
            className="brand-logo"
            src="../opLogo.png"
            alt="OP SMS Logo"
            width="100px"
            height="100px"
          /> */}
        </span>
        <Navigation />
      </div>
    </nav>
  );
}
