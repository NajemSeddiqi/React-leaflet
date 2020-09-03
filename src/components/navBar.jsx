import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          Store Tracker
        </Link>
        <NavLink className="nav-item nav-link" to="/stores">
          Affärer
        </NavLink>
        <NavLink className="nav-item nav-link" to="/suggest">
          Föreslå en affär
        </NavLink>
      </nav>
    );
  }
}

export default Navbar;
