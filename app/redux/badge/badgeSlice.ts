'use client';

import { createSlice } from "@reduxjs/toolkit";

export interface BadgeState{
    badges: []
}

export const badgeSlice = createSlice({
    name: 'badge_list',
    initialState: {
        badge_list: [],
      },
    reducers:{
        setBadge: (state, action) => {
          state.badge_list = action.payload
        },
        resetBadge: (state ) => {
            state.badge_list = []
        },

        }
    })


export const { setBadge, resetBadge } = badgeSlice.actions;
export default badgeSlice.reducer;