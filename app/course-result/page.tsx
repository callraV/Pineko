"use client";

import React, { useEffect, useState } from "react";
import type { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { Modal, useDisclosure, Image } from "@chakra-ui/react";
import { BsChevronCompactRight } from "react-icons/bs";
import { useRouter, useSearchParams } from "next/navigation";
import Confetti from "react-confetti";
import useSound from "use-sound";
import winSound from "../../public/sounds/dumdaradum.mp3";
import loseSound from "../../public/sounds/fail.mp3";
import { LevelUp } from "../components/LevelUp/LevelUp";
import { setUser } from "../redux/user/userSlice";

const CourseResult = () => {
  const dispatch = useDispatch();
  const courseCategory = useSelector(
    (state: RootState) => state.course.category
  );
  const course = useSelector((state: RootState) => state.course.course);
  const user = useSelector((state: RootState) => state.user.user);
  const searchParams = useSearchParams();
  const [correct, setCorrect] = useState(searchParams.get("correct"));
  const [playWinSound] = useSound(winSound);
  const [playLoseSound] = useSound(loseSound);
  const { push } = useRouter();
  const {
    isOpen: isLevelUpOpen,
    onOpen: onLevelUpOpen,
    onClose: onLevelUpClose,
  } = useDisclosure();

  useEffect(() => {
    if (correct === "true") {
      playWinSound();
    } else {
      playLoseSound();
    }
  }, [correct, playWinSound, playLoseSound]);

  useEffect(() => {
    if (user.user_id != 0 && user.experience_points >= user.level * 100) {
      fetch(`https://pineko-api.vercel.app/api/levelup?user=${user.user_id}`)
        .then((response) => response.json())
        .then((data) => {
          dispatch(setUser(data));
        });
      onLevelUpOpen();
    }
  }, [user]);

  return (
    <>
      <div className="mx-5 flex flex-col gap-1 py-10 lg:px-10 lg:mx-10">
        <div className="flex items-center mx-auto text-slate-400 text-xs z-50 md:text-sm md:gap-3 lg:gap-5 ">
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
              <Confetti width={screen.width} height={screen.height} />

              <Image
                src="asset/SuccesfulQuiz.png"
                width={["180px", "250px", "250px"]}
                mx="auto"
              />

              <div className="flex flex-col gap-5 justify-center">
                <h2 className="text-5xl self-center font-bold text-yellow-500">
                  Correct!
                </h2>

                <p className="text-slate-600 w-8/12 text-center mx-auto">
                  Congratulations! You gained 10 points!
                </p>
              </div>
            </>
          ) : (
            <>
              <Image
                src="asset/UnsuccesfulQuiz.png"
                width={["180px", "250px", "250px"]}
                mx="auto"
              />

              <div className="flex flex-col gap-5 justify-center">
                <h2 className="text-5xl self-center font-bold text-gray-500">
                  Wrong!
                </h2>

                <p className="text-slate-600 w-8/12 text-center mx-auto">
                  Opps... Let's revise more!
                </p>
              </div>
            </>
          )}

          <div className="flex flex-col mt-3 gap-3 lg:gap-2">
            <button
              onClick={() => push("/course-categories")}
              className="flex w-9/12 md:w-3/12 mx-auto justify-center rounded-lg bg-indigo-600 py-2 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Continue courses
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isLevelUpOpen}
        onClose={onLevelUpClose}
        size={["xs", "md"]}
      >
        <LevelUp />
      </Modal>
    </>
  );
};

export default CourseResult;
