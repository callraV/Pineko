"use client";

import React, { useEffect, useState } from "react";
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { Image } from "@chakra-ui/react";
import { BsChevronCompactRight } from "react-icons/bs";
import { useRouter, useSearchParams } from "next/navigation";
import Confetti from "react-confetti";
import useSound from "use-sound";
import winSound from "../../public/sounds/dumdaradum.mp3"; // Ensure the correct path
import loseSound from "../../public/sounds/fail.mp3"; // Ensure the correct path

const CourseResult = () => {
  const courseCategory = useSelector(
    (state: RootState) => state.course.category
  );
  const course = useSelector((state: RootState) => state.course.course);
  const searchParams = useSearchParams();
  const [correct, setCorrect] = useState(searchParams.get("correct"));
  const [playWinSound] = useSound(winSound);
  const [playLoseSound] = useSound(loseSound);
  const { push } = useRouter();

  useEffect(() => {
    if (correct === "true") {
      playWinSound();
    } else {
      playLoseSound();
    }
  }, [correct, playWinSound, playLoseSound]);

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

      <div className="flex flex-col mx-10 my-5 justify-center gap-5 lg:px-10">
        <h2 className="text-4xl self-center font-bold tracking-tight text-gray-900">
          {courseCategory}
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        {correct === "true" ? (
          <>
            <Confetti />

            <Image src="asset/WinNeko.jpg" width="300px" mx="auto" />

            <div className="flex flex-col gap-5 justify-center">
              <h2 className="text-5xl self-center font-bold text-yellow-500">
                Congratulations!
              </h2>

              <p className="text-slate-600 w-8/12 text-center mx-auto">
                You are correct! You gained 10 points!
              </p>
            </div>
          </>
        ) : (
          <>
            <Image src="asset/LostNeko.jpg" width="300px" mx="auto" />

            <div className="flex flex-col gap-5 justify-center">
              <h2 className="text-5xl self-center font-bold text-gray-500">
                Uh oh...
              </h2>

              <p className="text-slate-600 w-8/12 text-center mx-auto">
                Wrong answer. Let's revise more!
              </p>
            </div>
          </>
        )}

        <div className="flex flex-col mt-3 gap-3 lg:gap-2">
          <button
            onClick={() => push("/course-categories")}
            className="flex w-5/12 mx-auto justify-center rounded-lg bg-indigo-600 py-2 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Continue courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseResult;
