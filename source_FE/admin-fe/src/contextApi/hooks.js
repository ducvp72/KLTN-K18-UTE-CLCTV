import { useContext } from "react";
import SearchCt from "./store/contextSearch";

export const useStore = () => {
  const [state, dispatch] = useContext(SearchCt);
  return [state, dispatch];
  //   return useContext(SearchCt); // maybe export it
};
