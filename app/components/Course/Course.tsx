"use client";

import React from "react";
import { Card, CardBody, Box, Heading } from "@chakra-ui/react";
import { BsCheckCircleFill, BsCircle } from "react-icons/bs";
import { setCourse } from "../../redux/course/courseSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export const Course = (props: any) => {
  const { push } = useRouter();
  const dispatch = useDispatch();

  const checkTakenCourse = (id: any) => {
    if (props.takenCourses[0] === "No data to show") {
      return <BsCircle className="text-2xl text-slate-300" />;
    } else {
      let takenCourseId: any = [];

      props.takenCourses.map((course: any) => {
        takenCourseId.push(course[2]);
      });

      if (takenCourseId.includes(id)) {
        return <BsCheckCircleFill className="text-2xl text-yellow-500" />;
      } else {
        return <BsCircle className="text-2xl text-slate-300" />;
      }
    }
  };

  return (
    <>
      <Card className="hover:bg-purple-100">
        <CardBody
          onClick={() => {
            push("/course-content");
            dispatch(setCourse(props.course));
          }}
        >
          <Box className="flex justify-between">
            <Heading size="md">{props.course[1]}</Heading>
            {checkTakenCourse(props.course[0])}
          </Box>
        </CardBody>
      </Card>
    </>
  );
};
