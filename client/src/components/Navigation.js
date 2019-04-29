import React from "react";
import { Link, withRouter } from "react-router-dom";
const noNavPaths = require("../noNavPaths");

export default withRouter(function Navigation({ location }) {
  const pathname = location.pathname;
  const showNav = !noNavPaths.includes(pathname);

  return showNav ? (
    <ul class="navigation right container">
      <li>
        <Link to="/">Dashboard</Link>
      </li>
      <li>
        <Link to="/stocks">Stocks</Link>
      </li>
      <li>
        <Link to="/orders">Orders</Link>
      </li>
    </ul>
  ) : (
    ""
  );
});
