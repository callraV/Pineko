"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  username: String;
  email: String;
  profile_pic_url: String;
  balance: number;
  experience_points: number;
  level: number;
  account_creation_date: String;
  is_suspended: boolean;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      user_id: 0,
      username: "",
      email: "",
      profile_pic_url: "",
      balance: 0,
      experience_points: 0,
      level: 0,
      account_creation_date: "",
      is_suspended: "",
    },
    // isLoaded: false,
  },
  reducers: {
    setUser: (state, action: any) => {
      state.user = {
        user_id: action.payload[0],
        username: action.payload[1],
        email: action.payload[2],
        profile_pic_url: action.payload[4],
        balance: action.payload[5],
        experience_points: action.payload[6],
        level: action.payload[7],
        account_creation_date: action.payload[8],
        is_suspended: action.payload[9],
      };
    },
    resetUser: (state) => {
      state.user = {
        user_id: 0,
        username: "",
        email: "",
        profile_pic_url: "",
        balance: 0,
        experience_points: 0,
        level: 0,
        account_creation_date: "",
        is_suspended: "",
      };
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
