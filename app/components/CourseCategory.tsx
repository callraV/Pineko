"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Card, CardBody, Box, Heading } from "@chakra-ui/react";
import {
  setCategoryId,
  setCategory,
  setDesc,
} from "../redux/course/courseSlice";

export const CourseCategory = (props: any) => {
  const { push } = useRouter();
  const dispatch = useDispatch();
  return (
    <>
      <Card className="hover:bg-purple-100">
        <CardBody
          onClick={() => {
            push("/course-courses");
            dispatch(setCategoryId(props.categoryId));
            dispatch(setCategory(props.name));
            dispatch(setDesc(props.desc));
          }}
        >
          <Box className="flex flex-col gap-2">
            <Heading size="md">{props.name}</Heading>
          </Box>
        </CardBody>
      </Card>
    </>
  );
};
