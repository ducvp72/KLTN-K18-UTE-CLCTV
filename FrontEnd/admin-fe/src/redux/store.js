import { createStore, applyMiddleware, compose } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import filterReducer from "./reducers/filter";
import toggleReducer from "./reducers/toggle";
import authReducer from "./reducers/auth";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["toggle"],
};

// const toogglePersistConfig = {
//   key: "toggle",
//   storage: storage,
//   whitelist: ["toggle"],
// };

const rootReducer = combineReducers({
  userData: authReducer,
  filterData: filterReducer,
  toggle: toggleReducer,
  // toggle: persistReducer(toogglePersistConfig, toggleReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
  // devTools: process.env.NODE_ENV !== "production",
  // middleware: [thunk],
);

export default store;
