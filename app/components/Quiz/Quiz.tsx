"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import { TbLetterA, TbLetterB, TbLetterC } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setUser } from "../../redux/user/userSlice";

export const Quiz = (props: any) => {
  const { onOpen, isOpen, onClose } = useDisclosure();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [answer, setAnswer] = useState("A");
  const user_id = useSelector((state: RootState) => state.user.user.user_id);

  const { push } = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    fetch(`https://pineko-api.vercel.app/api/quiz/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        course_id: props.courseId,
        user_answer: answer,
        result: `${answer === correctAnswer ? "W" : "L"}`,
        datetime_taken: new Date(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setUser(data));
      });
  };

  useEffect(() => {
    fetch(`https://pineko-api.vercel.app/api/quiz?course=${props.courseId}`)
      .then((response) => response.json())
      .then((data) => {
        setQuestion(data[2]);
        setOptions([data[3], data[4], data[5]]);
        setCorrectAnswer(data[6]);
      });
  }, []);

  if (question.length === 0) {
    return <></>;
  }

  return (
    <>
      <ModalContent className="text-center">
        <ModalHeader>Attempt question now?</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="flex flex-col gap-5">
          <div className="text-lg">
            To complete this course, you must first answer a question related to
            the course's topic. Once you click "Attempt now"{" "}
            <span className="font-semibold text-indigo-600">
              you may not go back until you have answered the question.
            </span>
          </div>

          <div className="text-sm">
            Remember! You will not gain experience points if your answer is
            incorrect.
          </div>
        </ModalBody>

        <ModalFooter className="flex flex-col gap-2">
          <button
            onClick={onOpen}
            className="w-10/12 mx-auto mb-3 justify-center rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Attempt now
          </button>
        </ModalFooter>
      </ModalContent>

      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay bg="white" />
        <ModalContent>
          <ModalHeader>{props.courseTitle}</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <div className="pb-5 text-xl whitespace-pre-wrap">{question}</div>
            <Stack mt={1} spacing={3}>
              <Checkbox
                size="lg"
                colorScheme="purple"
                icon={<TbLetterA />}
                onChange={() => setAnswer("A")}
                isChecked={answer === "A" ? true : false}
              >
                {options[0]}
              </Checkbox>
              <Checkbox
                size="lg"
                colorScheme="purple"
                icon={<TbLetterB />}
                onChange={() => setAnswer("B")}
                isChecked={answer === "B" ? true : false}
              >
                {options[1]}
              </Checkbox>
              <Checkbox
                size="lg"
                colorScheme="purple"
                icon={<TbLetterC />}
                onChange={() => setAnswer("C")}
                isChecked={answer === "C" ? true : false}
              >
                {options[2]}
              </Checkbox>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <button
              onClick={() => {
                handleSubmit();
                push(
                  `${
                    answer === correctAnswer
                      ? "/course-result?correct=true"
                      : "/course-result"
                  }`
                );
              }}
              className="w-10/12 mx-auto mt-3 mb-2 justify-center rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
