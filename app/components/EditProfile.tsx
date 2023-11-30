"use client";

import React, { useState } from "react";
import {
  useToast,
  Image,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  useDisclosure,
  Modal,
} from "@chakra-ui/react";
import type { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { setUser } from "../redux/user/userSlice";
import { EditProfileSchema } from "../utils/SchemasUtil";
import { DeleteProfile } from "./DeleteProfile";

export const EditProfile = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector((state: RootState) => state.user.user);
  const [file, setFile] = useState<File | string>(user.profile_pic_url);
  const [isChecked, setIsChecked] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onFileChange = (event: any) => {
    setFile(event.target.files[0]);
    let preview = document.getElementById(
      "imagePrev"
    ) as HTMLImageElement | null;
    if (preview) {
      preview.src = URL.createObjectURL(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://pineko-api.vercel.app/api/profile/edit/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit your profile</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={EditProfileSchema}
            onSubmit={(value: any) => {
              if (file instanceof File) {
                value["profile_pic_url"] = "profile/" + file.name;
              } else {
                value["profile_pic_url"] = user.profile_pic_url;
              }

              fetch(`https://pineko-api.vercel.app/api/profile/edit`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json", // Specify JSON content type
                },
                body: JSON.stringify({
                  user_id: user.user_id,
                  username: value.username,
                  password: value.password,
                  profile_pic_url: value.profile_pic_url,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data === "Duplicated username") {
                    toast({
                      position: "top-right",
                      title:
                        "Username has been taken. Please input another name",
                      status: "error",
                      duration: 2000,
                    });
                  } else {
                    toast({
                      position: "top-right",
                      title: "Profile updated",
                      status: "success",
                      duration: 2000,
                    });
                    dispatch(setUser(data));
                  }
                });

              handleUpload();
            }}
          >
            {(props) => {
              return (
                <Form>
                  <div className="">
                    <div className="mb-1 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-6">
                      <div className="md:col-span-3">
                        <label
                          htmlFor="username"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          New username
                        </label>
                        <div className="mt-2">
                          <Field
                            type="text"
                            name="username"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <ErrorMessage
                          component="div"
                          name="username"
                          className="text-red-500 text-sm italic"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            New password
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

                      <div className="md:col-span-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Email
                        </label>
                        <div className="mt-2 text-slate-400">{user.email}</div>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="cover-photo"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Profile picture
                        </label>
                        <div className="flex flex-col gap-2 p-5">
                          <div className="px-20 relative">
                            <Image
                              src={user.profile_pic_url}
                              id="imagePrev"
                              w="260px"
                              h="135px"
                              objectFit="cover"
                              className="rounded-full border border-solid border-gray-300"
                            />
                            <input
                              type="file"
                              id="file"
                              name="file"
                              className="mt-5 absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                              onChange={(event) => {
                                onFileChange(event);
                              }}
                            />
                          </div>
                          <Text className="self-center text-slate-400">
                            Click to Edit
                          </Text>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 flex flex-col items-center justify-center gap-2">
                      <button
                        type="submit"
                        className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={onOpen}
                        className="w-full rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-900 hover:bg-red-500 hover:text-red-100"
                      >
                        Delete account
                      </button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </ModalBody>
      </ModalContent>

      <Modal isOpen={isOpen} onClose={onClose}>
        <DeleteProfile />
      </Modal>
    </>
  );
};
