"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CourseCategory } from "../components/CourseCategory/CourseCategory";
import {
  resetCategoryId,
  resetCategory,
  resetDesc,
} from "../redux/course/courseSlice";
import { Loading } from "../components/Loading/Loading";

const CourseCategories = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(resetCategory());
    dispatch(resetCategoryId());
    dispatch(resetDesc());

    fetch(`https://pineko-api.vercel.app/api/category`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

  if (categories.length === 0) {
    return <Loading />;
  }

  return (
    <div className="mx-5 flex flex-col gap-5 py-10 lg:px-10 lg:mx-10">
      <div className="flex flex-col items-center justify-center gap-5">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Courses
        </h2>
        <div className="md:w-10/12 lg:w-7/12">
          <p className="text-slate-600 text-center">
            New to trading forex? Take Pineko's free online courses! Our courses
            are especially currated for novice traders. You'll even gain some
            experience points once you've succesfully complete a course.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:gap-5">
        {categories.map((category: any, index: number) => (
          <CourseCategory
            key={index}
            categoryId={category[0]}
            name={category[1]}
            desc={category[2]}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseCategories;
