import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Import the storage engine

import authReducer from "./slice/authSlice";
import thunk from "redux-thunk";
import userReducer from "./slice/userSlice";
import tradeLogReducer from "./slice/tradeLogSlice";
import tradingAccountsReducer from "./slice/tradingAccountsSlice"
import dashboardReducer from "./slice/homeSlice";
import strategyReducer from "./slice/strategySlice";
import sessionReducer from "./slice/sessionSlice";
import columnReducer from "./slice/newColumnSlice";
import tradeAnalyticsSlice from "./slice/tradeAnalyticsSlice";
import toolSlice from "./slice/toolSlice";
import calculatorSlice from "./slice/calculatorSlice";
import mantraSlice from "./slice/mantraSlice";
import monthlySlice from "./slice/monthlySlice";

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  trades: tradeLogReducer,
  tradingAccounts: tradingAccountsReducer,
  strategy: strategyReducer,
  session: sessionReducer,
  dashboard: dashboardReducer,
  columnList: columnReducer,
  analytics: tradeAnalyticsSlice,
  tools:toolSlice,
  calculator:calculatorSlice,
  mantras:mantraSlice,
  monthly:monthlySlice
});

const persistConfig = {
  key: "root",
  storage, // Use the imported storage engine
  whitelist: ["auth"], // Specify the slices you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: [thunk],
});

const persistor = persistStore(store); // Create a persistor for the store

export { store, persistor };
