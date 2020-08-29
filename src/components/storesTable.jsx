import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";

class StoresTable extends Component {
  columns = [
    {
      path: "store",
      label: "Affär",
      content: (s) => <Link to={`/stores/${s.id}`}>{s.store}</Link>,
    },
    { path: "province.name", label: "Län" },
    { path: "address", label: "Adress" },
    { path: "city", label: "Stad" },
    { path: "openingHours", label: "Öppettider" },
  ];

  render() {
    const { stores, sortColumn, onSort } = this.props;
    return (
      <Table
        columns={this.columns}
        data={stores}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default StoresTable;
