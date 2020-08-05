import React, { Component } from "react";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="index">
          Store inspicio
        </a>
        <span className="badge badge-pill badge-secondary"/>
      </nav>
    );
  }
}

export default Navbar;
