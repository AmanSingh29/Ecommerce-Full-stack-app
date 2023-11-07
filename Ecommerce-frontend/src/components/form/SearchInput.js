import React from "react";
import { useSearch } from "../../context/Search";
import { useNavigate } from "react-router-dom";
const port = "http://localhost:5000";

const SearchInput = () => {
  const [values, setValues] = useSearch();

  const navigate = useNavigate();

  const handleFilter = async (e) => {
    e.preventDefault();
    fetch(`${port}/product/search-product/${values.keyword}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setValues({ ...values, results: data.data });
        navigate("/search");
      });
  };

  return (
    <div>
      <form className="d-flex" onSubmit={(e) => handleFilter(e)}>
        <input
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button className="btn btn-outline-dark" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
