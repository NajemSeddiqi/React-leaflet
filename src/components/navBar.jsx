import React, { Component } from "react";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Store inspicio
        </a>
        <span className="badge badge-pill badge-secondary"></span>
      </nav>
    );
  }
}

export default Navbar;
