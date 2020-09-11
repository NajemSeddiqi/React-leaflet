import React, { Component } from "react";
import { getStores } from "../services/storeService";
import Builder from "../helpers/apiResponseObjectbuilder";
import ProgressBar from "react-bootstrap/ProgressBar";
import _ from "lodash";
import StoresTable from "./storesTable";
import Pagination from "./common/pagination";
import loadProgress from "./../helpers/progressBarLoader";

class StoreList extends Component {
  state = {
    stores: [],
    sortColumn: { path: "store", order: "asc" },
    pageSize: 13,
    currentPage: 1,
    progress: 0,
  };

  async componentDidMount() {
    loadProgress(this, 13);
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
    const {
      sortColumn,
      currentPage,
      pageSize,
      stores: items,
      progress,
    } = this.state;
    const { totalCount, sortedStores: stores } = this.getPagedData();

    const indexOfLastStore = currentPage * pageSize;
    const indexOfFirstStore = indexOfLastStore - pageSize;
    const currentStore = stores.slice(indexOfFirstStore, indexOfLastStore);

    let lbl = Math.floor(progress);
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
            <div style={{ margin: "120px" }}>
              <ProgressBar animated now={progress} label={`${lbl}%`} />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default StoreList;
