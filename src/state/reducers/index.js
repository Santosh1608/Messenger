import { createStore, compose, combineReducers, applyMiddleware } from "redux";
import authReducer from "./auth";
import userReducer from "./user";
import socketReducer from "./socket";
import notificationReducer from "./notification";
import chatReducer from "./chat";
import thunk from "redux-thunk";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer = combineReducers({
  authReducer,
  userReducer,
  socketReducer,
  notificationReducer,
  chatReducer,
});
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
export default store;
