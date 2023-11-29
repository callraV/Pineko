"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface ChartState {
  channelID: number;
  data: number[];
  channelName: String;
  pair: String;
}

export const chartSlice = createSlice({
  name: "chart",
  initialState: {
    chart: {
      channelID: 0,
      data: "",
      channelName: "",
      pair: "",
    },
  },
  reducers: {
    setChart: (state, action) => {
      state.chart = {
        channelID: action.payload[0],
        data: action.payload[1],
        channelName: action.payload[2],
        pair: action.payload[3],
      };
    },
    resetChart: (state) => {
      state.chart = {
        channelID: 0,
        data: "",
        channelName: "",
        pair: "",
      };
    },
  },
});

export const { setChart, resetChart } = chartSlice.actions;
export default chartSlice.reducer;
