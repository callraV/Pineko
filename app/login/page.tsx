"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Checkbox, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { setUser } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { LoginSchema } from "../utils/SchemasUtil";

const Login = () => {
  const toast = useToast();
  const { push } = useRouter();
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(value) => {
              console.log(value);
              fetch(`/api/login`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json", // Specify JSON content type
                },
                body: JSON.stringify({
                  email: value.email,
                  password: value.password,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (
                    data == "User not found" ||
                    data == "Incorrect password"
                  ) {
                    toast({
                      position: "top",
                      title: data,
                      status: "error",
                      duration: 2000,
                    });
                  } else {
                    toast({
                      position: "top",
                      title: "Login succesful",
                      status: "success",
                      duration: 2000,
                    });
                    dispatch(setUser(data));
                    push("/dashboard");
                  }
                });
            }}
          >
            {(props) => {
              return (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <Field
                      type="text"
                      name="email"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      component="div"
                      name="email"
                      className="text-red-500 text-sm italic"
                    />
                    <div className="mt-2"></div>
                  </div>

                  <div>
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
                      <ErrorMessage
                        component="div"
                        name="password"
                        className="text-red-500 text-sm italic"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Login
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account yet?{" "}
            <a
              href="/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
