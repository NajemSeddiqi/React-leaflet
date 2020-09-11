import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { add } from "./../services/suggestionService";
import { toast } from "react-toastify";

class SuggestForm extends Form {
  state = {
    data: { store: "", address: "" },
    errors: {},
  };

  schema = {
    store: Joi.string().required().min(8).label("store"),
    address: Joi.string().required().min(10).label("address"),
  };

  doSubmit = async () => {
    await add(this.state.data);
    toast("Tack för ditt förslag :)");
    setTimeout(() => window.location.reload(), 1800);
  };

  render() {
    return (
      <React.Fragment>
        <div className="container mr-3">
          <div style={{ height: "80vh" }}>
            <h1 style={{ padding: "10px" }}>Föreslå nedan</h1>
            <form onSubmit={this.handleSubmit}>
              {this.renderInput("store", "Affärsnamn")}
              {this.renderInput("address", "Adress")}
              {this.renderButton("Föreslå")}
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SuggestForm;
