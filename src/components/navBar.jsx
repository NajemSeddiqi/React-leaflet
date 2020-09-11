import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mr-auto">
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link className="navbar-brand" to="/">
              Store Tracker
            </Link>
            <NavLink className="nav-item nav-link" to="/stores">
              Affärer
            </NavLink>
            <NavLink className="nav-item nav-link" to="/suggest">
              Föreslå en affär
            </NavLink>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
