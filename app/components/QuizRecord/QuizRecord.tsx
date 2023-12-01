"use client";

import React, { useEffect, useState } from "react";
import {
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import { TbLetterA, TbLetterB, TbLetterC } from "react-icons/tb";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Loading } from "../Loading/Loading";

export const QuizRecord = (props: any) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [answer, setAnswer] = useState("");
  const [record, setRecord] = useState([""]);
  const [submissionDate, setSubmissionDate] = useState("");

  const user_id = useSelector((state: RootState) => state.user.user.user_id);

  useEffect(() => {
    fetch(`/api/quiz?course=${props.courseId}`)
      .then((response) => response.json())
      .then((data) => {
        setQuestion(data[2]);
        setOptions([data[3], data[4], data[5]]);
        setCorrectAnswer(data[6]);
      });

    fetch(`/api/course/taken/record?user=${user_id}&course=${props.courseId}`)
      .then((response) => response.json())
      .then((data) => {
        setRecord(data);
        setAnswer(data[0][3]);
        setSubmissionDate(data[0][5].toString());
      });
  }, []);

  if (question.length === 0) {
    return (
      <>
        <ModalContent>
          <Loading />
        </ModalContent>
      </>
    );
  }

  return (
    <>
      <ModalContent>
        <ModalHeader>{props.courseTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="pb-5 text-xl whitespace-pre-wrap">{question}</div>
          <Stack mt={1} spacing={3}>
            <Checkbox
              size="lg"
              colorScheme={answer === correctAnswer ? "yellow" : "red"}
              icon={<TbLetterA />}
              isChecked={answer === "A" ? true : false}
            >
              {options[0]}
            </Checkbox>
            <Checkbox
              size="lg"
              colorScheme={answer === correctAnswer ? "yellow" : "red"}
              icon={<TbLetterB />}
              isChecked={answer === "B" ? true : false}
            >
              {options[1]}
            </Checkbox>
            <Checkbox
              size="lg"
              colorScheme={answer === correctAnswer ? "yellow" : "red"}
              icon={<TbLetterC />}
              isChecked={answer === "C" ? true : false}
            >
              {options[2]}
            </Checkbox>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <div className="flex flex-col py-2.5 gap-1 items-end">
            <div className="text-md font-semibold text-yellow-600">
              Correct answer: {correctAnswer}
            </div>
            <div className="text-xs text-slate-400 italic">
              Completed at {submissionDate}
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </>
  );
};
