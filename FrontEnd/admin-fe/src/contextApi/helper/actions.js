import { SET_SEARCH_INPUT, SET_SEARCH_QUERY } from "./constants";

export const setSearchIput = (payload) => ({
  type: SET_SEARCH_INPUT,
  payload,
});

export const setSearchQuey = (payload) => ({
  type: SET_SEARCH_QUERY,
  payload,
});
