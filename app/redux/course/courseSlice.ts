"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface courseState {
  categoryId: 0;
  category: "";
  desc: "";
  course: "";
  takenCourses: [];
}

export const courseSlice = createSlice({
  name: "course",
  initialState: {
    categoryId: 0,
    category: "",
    desc: "",
    course: "",
    takenCourses: [],
  },
  reducers: {
    setCategoryId: (state, action) => {
      state.categoryId = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setDesc: (state, action) => {
      state.desc = action.payload;
    },
    setCourse: (state, action) => {
      state.course = action.payload;
    },
    setTakenCourses: (state, action) => {
      state.takenCourses = action.payload;
    },
    resetCategoryId: (state) => {
      state.categoryId = 0;
    },
    resetCategory: (state) => {
      state.category = "";
    },
    resetDesc: (state) => {
      state.desc = "";
    },
    resetCourse: (state) => {
      state.course = "";
    },
    resetTakenCourses: (state) => {
      state.takenCourses = [];
    },
  },
});

export const {
  setCategoryId,
  resetCategoryId,
  setCourse,
  resetCourse,
  setDesc,
  resetDesc,
  setCategory,
  resetCategory,
  setTakenCourses,
  resetTakenCourses,
} = courseSlice.actions;
export default courseSlice.reducer;
