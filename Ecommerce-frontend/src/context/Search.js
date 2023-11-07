import { useState, useContext, createContext } from "react";

const SearchContext = createContext();

const SearchProvider = (props) => {
  const [values, setValues] = useState({
    keyword: "",
    results: [],
  });

  return (
    <SearchContext.Provider value={[values, setValues]}>
      {props.children}
    </SearchContext.Provider>
  );
};

const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };
