"use client";

import React, { useEffect, useState } from "react";
import type { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Box, Heading, Progress } from "@chakra-ui/react";
import {
  resetCourse,
  setTakenCourses,
  resetTakenCourses,
} from "../redux/course/courseSlice";
import { BsChevronCompactRight } from "react-icons/bs";
import { Loading } from "../components/Loading/Loading";
import { Course } from "../components/Course/Course";

const CourseCourses = () => {
  const { push } = useRouter();
  const dispatch = useDispatch();

  const user_id = useSelector((state: RootState) => state.user.user.user_id);
  const categoryId = useSelector((state: RootState) => state.course.categoryId);
  const courseCategory = useSelector(
    (state: RootState) => state.course.category
  );
  const courseDescription = useSelector(
    (state: RootState) => state.course.desc
  );
  const takenCourses = useSelector(
    (state: RootState) => state.course.takenCourses
  );

  const [courses, setCourses] = useState([""]);

  useEffect(() => {
    dispatch(resetCourse());
    dispatch(resetTakenCourses());
    fetch(`/api/course?category=${categoryId}`)
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
      });

    fetch(`/api/course/taken?user=${user_id}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setTakenCourses(data));
      });
  }, []);

  if (
    courses.length === 0 ||
    (courses.length > 0 && takenCourses.length === 0)
  ) {
    return <Loading />;
  }

  return (
    <div className="mx-5 flex flex-col gap-1 py-10 pb-28 lg:pb-24 lg:px-10 lg:mx-10">
      <div className="flex items-center mx-auto text-slate-400 text-xs z-50 md:text-sm md:gap-3 lg:gap-5 ">
        <button
          onClick={() => push("course-categories")}
          className="hover:font-semibold"
        >
          Courses
        </button>
        <BsChevronCompactRight />
        <button className="font-semibold">{courseCategory}</button>
      </div>

      <div className="flex flex-col mx-10 my-5 justify-center gap-5 lg:px-10">
        <h2 className="text-3xl self-center font-bold tracking-tight text-gray-900 sm:text-4xl">
          {courseCategory}
        </h2>
        <div className="md:w-10/12 lg:w-7/12 self-center flex flex-col gap-4">
          <p className="text-slate-600 text-center">{courseDescription}</p>
          <Progress
            hasStripe
            isAnimated
            size="sm"
            value={
              courses[0] === "No data to show" ||
              takenCourses[0] === "No data to show"
                ? 0
                : 100 * (takenCourses.length / courses.length)
            }
            colorScheme={
              100 * (takenCourses.length / courses.length) === 100
                ? "yellow"
                : "purple"
            }
            className="rounded-md my-1"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:gap-5">
        {courses[0] === "No data to show" ? (
          <Box className="flex justify-center my-14">
            <Heading size="md">Coming soon!</Heading>
          </Box>
        ) : (
          <>
            {courses.map((course: any, index: number) => (
              <Course key={index} course={course} takenCourses={takenCourses} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseCourses;
