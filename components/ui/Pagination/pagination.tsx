"use client";

import ReactPaginate from "react-paginate";
import "./Pagination.scss";

const Pagination = ({
  setPage,
  totalPages,
}: {
  setPage: (page: number) => void;
  totalPages: number;
}) => {
  const handlePageClick = (event: { selected: number }) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setPage(event.selected + 1);
  };

  return (
    <div className="pagination-wrapper">
      <ReactPaginate
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={totalPages}
        previousLabel="Previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item-carrot"
        previousLinkClassName="page-link-previous"
        nextClassName="page-item-carrot"
        nextLinkClassName="page-link-next"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active-pagination"
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default Pagination;
