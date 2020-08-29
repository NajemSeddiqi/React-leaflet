import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          Store Inspicio
        </Link>
        <NavLink className="nav-item nav-link" to="/stores">
          Stores <span className="sr-only">(current)</span>
        </NavLink>
      </nav>
    );
  }
}

export default Navbar;
