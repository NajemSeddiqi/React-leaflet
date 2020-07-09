import React, { Component } from "react";
import Navbar from "./components/navBar";
import Footer from "./components/footer";
import MyMap from "./components/map";
import "./App.css";

class App extends Component {
  
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <MyMap/>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
