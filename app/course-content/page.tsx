"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { Modal, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { BsChevronCompactRight } from "react-icons/bs";
import { Quiz } from "../components/Quiz";
import { QuizRecord } from "../components/QuizRecord";
import { Loading } from "../components/Loading";
import { BsCheckCircleFill } from "react-icons/bs";

const CourseContent = () => {
  const { push } = useRouter();
  const courseCategory = useSelector(
    (state: RootState) => state.course.category
  );
  const course = useSelector((state: RootState) => state.course.course);
  const takenCourses = useSelector(
    (state: RootState) => state.course.takenCourses
  );
  const [courseText, setCourseText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const course_id = course[0];
  const tc_id = takenCourses.map((tc: any) => {
    return tc[2];
  });

  useEffect(() => {
    fetch(`/api/course/text?course=${course[0]}`)
      .then((response) => response.json())
      .then((data) => {
        setCourseText(data);
      });
  }, []);

  // Conditional rendering
  if (courseText === "") {
    return <Loading />;
  }

  return (
    <div className="mx-5 flex flex-col gap-1 py-10 lg:px-10 lg:mx-10">
      <div className="flex items-center gap-5 mx-auto text-slate-400 z-50">
        <button
          onClick={() => push("course-categories")}
          className="hover:font-semibold"
        >
          Courses
        </button>
        <BsChevronCompactRight />
        <button
          onClick={() => push("course-courses")}
          className="hover:font-semibold"
        >
          {courseCategory}
        </button>
        <BsChevronCompactRight />
        <button className="font-semibold">{course[1]}</button>
      </div>

      <div className="px-3 mt-5 lg:px-20 flex gap-3">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          {course[1]}
        </h2>
        <div className="mt-3">
          {tc_id.includes(course_id) ? (
            <BsCheckCircleFill className="text-2xl text-yellow-500" />
          ) : (
            <></>
          )}
        </div>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: courseText }}
        className="px-3 lg:px-20 text-lg whitespace-pre-wrap"
      />

      <div className="pt-7 pb-10 flex flex-col">
        {tc_id.includes(course_id) ? (
          <button
            onClick={onOpen}
            className="flex w-5/12 mx-auto justify-center rounded-lg bg-yellow-400 py-2.5 text-md font-semibold text-yellow-700 shadow-sm hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Completed
          </button>
        ) : (
          <button
            onClick={onOpen}
            className="flex w-5/12 mx-auto justify-center rounded-lg bg-indigo-600 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Mark as completed
          </button>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        {tc_id.includes(course_id) ? (
          <QuizRecord courseId={course[0]} courseTitle={course[1]} />
        ) : (
          <Quiz courseId={course[0]} courseTitle={course[1]} />
        )}
      </Modal>
    </div>
  );
};

export default CourseContent;
