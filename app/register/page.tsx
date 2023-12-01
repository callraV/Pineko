"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Checkbox, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { RegisterSchema } from "../utils/SchemasUtil";

const Register = () => {
  const toast = useToast();
  const { push } = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <div className="flex flex-col min-h-screen items-center justify-center px-6 py-20 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto w-14"
            src="asset/CoinLogo.png"
            alt="Your Company"
          />
          <h2 className="mt-5 text-center text-3xl font-bold text-gray-900">
            Register
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Formik
            initialValues={{ username: "", email: "", password: "" }}
            validationSchema={RegisterSchema}
            onSubmit={(value) => {
              fetch(`https://pineko-api.vercel.app/api/register`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: value.username,
                  email: value.email,
                  password: value.password,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data != "User registered") {
                    toast({
                      position: "top",
                      title: data,
                      status: "error",
                      duration: 2000,
                    });
                  } else {
                    toast({
                      position: "top",
                      title: "Registration complete. Login now",
                      status: "success",
                      duration: 2000,
                    });
                    push("/login");
                  }
                });
            }}
          >
            {(props) => {
              return (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Username
                    </label>
                    <Field
                      type="text"
                      name="username"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      component="div"
                      name="username"
                      className="text-red-500 text-sm italic"
                    />
                    <div className="mt-2"></div>
                  </div>

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
                      Register
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
