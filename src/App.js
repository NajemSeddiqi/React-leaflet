import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/navBar";
import Footer from "./components/footer";
import MyMap from "./components/myMap";
import StoreList from "./components/storeList";
import SuggestForm from "./components/suggestForm";

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
          <Route path="/stores" component={StoreList} />
          <Route path="/suggest" component={SuggestForm} />
          <Route path="/" component={MyMap} />
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
