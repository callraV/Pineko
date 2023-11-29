'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface OpenState{
    open: [],
}

export const openSlice = createSlice({
    name: 'open_trades',
    initialState: {
        open_trades: [],
      },
    reducers:{
        setOpenTrades: (state, action) => {
          state.open_trades = action.payload;
    },
        resetOpenTrades: (state) => {
            state.open_trades = [];
          }
        }
    })

export const { setOpenTrades, resetOpenTrades} = openSlice.actions;
export default openSlice.reducer;