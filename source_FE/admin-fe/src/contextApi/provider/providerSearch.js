import { useReducer } from "react";
import SearchCt from "../store/contextSearch";
import SearchRd, { initState } from "../reducer/SearchRd";
import logger from "../helper/logger";
const SearchPd = ({ children }) => {
  const [state, dispatch] = useReducer(logger(SearchRd), initState);
  return (
    <SearchCt.Provider value={[state, dispatch]}>{children}</SearchCt.Provider>
  );
};

export default SearchPd;
