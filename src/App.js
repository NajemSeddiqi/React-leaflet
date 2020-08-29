import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Redirect, Switch } from "react-router-dom";
import Navbar from "./components/navBar";
import Footer from "./components/footer";
import MyMap from "./components/map";
import StoreList from "./components/storeList";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <Navbar />
        <Switch>
          <Route path="/stores" render={(props) => <StoreList />} />
          <MyMap />
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
