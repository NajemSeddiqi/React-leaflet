/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import propTypes from "prop-types";

const Pagination = ({ itemsCount, pageSize, onPageChange, currentPage }) => {
  const pagesCount = [];

  for (let i = 1; i < Math.ceil(itemsCount / pageSize) + 1; i++) {
    pagesCount.push(i);
  }

  if (pagesCount.length === 0) return null;

  return (
    <nav>
      <ul className="pagination">
        {pagesCount.map((p) => (
          <li
            key={p}
            className={p === currentPage ? "page-item active" : "page-item"}
          >
            <a onClick={() => onPageChange(p)} className="page-link">
              {p}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  itemsCount: propTypes.number.isRequired,
  pageSize: propTypes.number.isRequired,
  onPageChange: propTypes.func.isRequired,
  //currentPage: propTypes.number.isRequired,
};

export default Pagination;
