import React, { Component } from "react";
import { getStores } from "../services/storeService";
import { buildStoreObject } from "../helpers/storeBuilder";
import _ from "lodash";
import StoresTable from "./storesTable";
import Pagination from "./common/pagination";

class StoreList extends Component {
  state = {
    stores: [],
    sortColumn: { path: "store", order: "asc" },
    pageSize: 13,
    currentPage: 1,
  };

  async componentDidMount() {
    const { data } = await getStores();
    const storeList = buildStoreObject(data);
    this.setState({ stores: storeList });
  }

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handlePageChange = (p) => {
    this.setState({ currentPage: p });
  };

  getPagedData = () => {
    const { sortColumn, stores } = this.state;
    const sorted = _.orderBy(stores, [sortColumn.path], [sortColumn.order]);
    return { totalCount: sorted.length, sortedStores: sorted };
  };

  render() {
    const { sortColumn, currentPage, pageSize, stores: items } = this.state;
    if (items.length === 0) return <p>Det finns inga affärer i databasen.</p>;

    const { totalCount, sortedStores: stores } = this.getPagedData();

    const indexOfLastStore = currentPage * pageSize;
    const indexOfFirstStore = indexOfLastStore - pageSize;
    const currentStore = stores.slice(indexOfFirstStore, indexOfLastStore);
    return (
      <div className="row">
        <div className="col">
          <StoresTable
            stores={currentStore}
            sortColumn={sortColumn}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  }
}

export default StoreList;
