import { SET_SEARCH_INPUT, SET_SEARCH_QUERY } from "../helper/constants";

const initState = {
  key: "",
  keyInput: "",
  query: "User",
};

const SearchRd = (state, action) => {
  switch (action.type) {
    case SET_SEARCH_INPUT:
      return {
        ...state,
        key: action.payload,
      };
    case SET_SEARCH_QUERY:
      return {
        ...state,
        query: action.payload,
      };
    default:
      throw new Error("Invalid type action !");
  }
};
export { initState };
export default SearchRd;
