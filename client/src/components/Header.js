import React from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <nav>
      <div className="nav-wrapper red lighten-2 ">
        <span
          to="/"
          className="brand-logo right"
          style={{ paddingRight: "40px" }}
        >
          OP SMS
        </span>
        <Navigation />
      </div>
    </nav>
  );
}
