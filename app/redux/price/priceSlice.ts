"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface PriceState {
  XBTUSD: any;
  EURUSD: any;
  USDCAD: any;
  GBPUSD: any;
  USDCHF: any;
}

export const priceSlice = createSlice({
  name: "price",
  initialState: {
    XBTUSD: {
      buyPrice: 0.0, // bid
      sellPrice: 0.0, // ask
    },
    EURUSD: {
      buyPrice: 0.0, // bid
      sellPrice: 0.0, // ask
    },
    USDCAD: {
      buyPrice: 0.0, // bid
      sellPrice: 0.0, // ask
    },
    GBPUSD: {
      buyPrice: 0.0, // bid
      sellPrice: 0.0, // ask
    },
    USDCHF: {
      buyPrice: 0.0, // bid
      sellPrice: 0.0, // ask
    },
  },
  reducers: {
    setXBTUSD: (state, action) => {
      state.XBTUSD = {
        buyPrice: parseFloat(action.payload[0]), // bid
        sellPrice: parseFloat(action.payload[1]), // ask
      };
    },
    setEURUSD: (state, action) => {
      state.EURUSD = {
        buyPrice: parseFloat(action.payload[0]), // bid
        sellPrice: parseFloat(action.payload[1]), // ask
      };
    },
    setUSDCAD: (state, action) => {
      state.USDCAD = {
        buyPrice: parseFloat(action.payload[0]), // bid
        sellPrice: parseFloat(action.payload[1]), // ask
      };
    },
    setGBPUSD: (state, action) => {
      state.GBPUSD = {
        buyPrice: parseFloat(action.payload[0]), // bid
        sellPrice: parseFloat(action.payload[1]), // ask
      };
    },
    setUSDCHF: (state, action) => {
      state.USDCHF = {
        buyPrice: parseFloat(action.payload[0]), // bid
        sellPrice: parseFloat(action.payload[1]), // ask
      };
    },
    resetPrice: (state) => {
      state.XBTUSD = {
        buyPrice: 0.0, // bid
        sellPrice: 0.0, // ask
      };
      state.EURUSD = {
        buyPrice: 0.0, // bid
        sellPrice: 0.0, // ask
      };
      state.USDCAD = {
        buyPrice: 0.0, // bid
        sellPrice: 0.0, // ask
      };
      state.GBPUSD = {
        buyPrice: 0.0, // bid
        sellPrice: 0.0, // ask
      };
      state.USDCHF = {
        buyPrice: 0.0, // bid
        sellPrice: 0.0, // ask
      };
    },
  },
});

export const {
  setXBTUSD,
  setEURUSD,
  setUSDCAD,
  setGBPUSD,
  setUSDCHF,
  resetPrice,
} = priceSlice.actions;
export default priceSlice.reducer;
