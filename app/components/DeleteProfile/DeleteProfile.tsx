"use client";

import React, { useState } from "react";
import {
  useToast,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Checkbox,
} from "@chakra-ui/react";
import type { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { resetUser } from "../../redux/user/userSlice";
import { DeleteProfileSchema } from "../../utils/SchemasUtil";

export const DeleteProfile = () => {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector((state: RootState) => state.user.user);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <ModalOverlay />

      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete profile</ModalHeader>

        <ModalBody>
          <Formik
            initialValues={{ password: "" }}
            validationSchema={DeleteProfileSchema}
            onSubmit={(value: any) => {
              fetch(`/getapi/profile/delete`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  user_id: user.user_id,
                  email: user.email,
                  password: value.password,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data != "User deleted successfully") {
                    toast({
                      position: "top-right",
                      title: data,
                      status: "error",
                      duration: 2000,
                    });
                  } else {
                    toast({
                      position: "top-right",
                      title: data,
                      status: "success",
                      duration: 2000,
                    });
                    dispatch(resetUser());
                    push("/");
                  }
                });
            }}
          >
            {(props) => {
              return (
                <Form>
                  <div className="flex flex-col gap-3">
                    <div>
                      Enter your current password to delete your profile. Please
                      be warned that{" "}
                      <span className="font-semibold text-red-500">
                        this action is permanent.
                      </span>
                    </div>
                    <div className="">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Password
                        </label>
                        <div>
                          <Checkbox
                            size="sm"
                            colorScheme="purple"
                            className="text-indigo-600 font-semibold"
                            onChange={(e) => setIsChecked(e.target.checked)}
                          >
                            Show
                          </Checkbox>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Field
                          type={isChecked ? "text" : "password"}
                          name="password"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <ErrorMessage
                        component="div"
                        name="password"
                        className="text-red-500 text-sm italic"
                      />
                    </div>
                  </div>

                  <div className="my-5 flex justify-end gap-2">
                    <button
                      type="submit"
                      className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 hover:text-red-100"
                    >
                      Delete account
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </ModalBody>
      </ModalContent>
    </>
  );
};
