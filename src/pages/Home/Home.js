import React, { useState, useEffect } from "react";
import Cards from "../../components/Cards/Cards";
import classes from "./Home.module.css";
import { useDispatch, useSelector } from "react-redux";
import { search } from "../../state/actions/user";
import ReactPaginate from "react-paginate";
function Home() {
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.userReducer);
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("TIC TIC TIC", name);
      dispatch(search(name, page));
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [name, page]);
  const handlePageClick = (data) => {
    setPage(data.selected + 1);
  };
  return (
    <div className={classes.Home}>
      <div>
        {page === 1 && (
          <input
            className={classes.Search}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search for users"
          />
        )}

        <Cards />
      </div>
      {userReducer.pages > 1 && (
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={userReducer.pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={4}
          onPageChange={handlePageClick}
          containerClassName={classes.pagination}
          activeClassName={classes.active}
          disabledClassName={classes.disabled}
        />
      )}
    </div>
  );
}

export default Home;
