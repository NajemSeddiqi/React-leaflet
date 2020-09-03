import React, { Component } from "react";
import { getStores } from "../services/storeService";
import Builder from "../helpers/apiResponseObjectbuilder";
import Spinner from "react-bootstrap/Spinner";
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
    const storeList = Builder.buildStoreObj(data);
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
    const { totalCount, sortedStores: stores } = this.getPagedData();

    const indexOfLastStore = currentPage * pageSize;
    const indexOfFirstStore = indexOfLastStore - pageSize;
    const currentStore = stores.slice(indexOfFirstStore, indexOfLastStore);
    return (
      <React.Fragment>
        <div style={{ height: "80vh" }}>
          {items.length !== 0 ? (
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
          ) : (
            <Spinner
              style={{ padding: "20px", margin: "10px" }}
              animation="border"
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default StoreList;
