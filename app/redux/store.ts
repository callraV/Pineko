"use client";

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import chartReducer from "./chart/chartSlice";
import priceReducer from "./price/priceSlice";
import openReducer from "./open/openSlice";
import courseReducer from "./course/courseSlice";

export const store = configureStore({
  reducer: {
    chart: chartReducer,
    price: priceReducer,
    user: userReducer,
    open_trades: openReducer,
    course: courseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
