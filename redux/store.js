import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import optionReducer from "./reducers";

const rootReducer = combineReducers({ optionReducer });

export const Store = createStore(rootReducer, applyMiddleware(thunk));