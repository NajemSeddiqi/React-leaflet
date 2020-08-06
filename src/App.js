import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/navBar";
import Footer from "./components/footer";
import MyMap from "./components/map";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <Navbar />
        <MyMap />
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
