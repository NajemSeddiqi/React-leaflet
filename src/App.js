import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Redirect, Switch } from "react-router-dom";
import Navbar from "./components/navBar";
import Footer from "./components/footer";
import MyMap from "./components/myMap";
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
          <Route path="/stores/:id" render={(props) => <MyMap {...props} />} />
          <Route path="/map" component={MyMap} />
          <Route path="/stores" component={StoreList} />
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
