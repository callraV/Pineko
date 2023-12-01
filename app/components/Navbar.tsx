"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useToast, Avatar, Progress, Text } from "@chakra-ui/react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import type { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { resetUser } from "../redux/user/userSlice";
import { resetChart } from "../redux/chart/chartSlice";
import { resetPrice } from "../redux/price/priceSlice";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { push } = useRouter();
  const toast = useToast();
  const user = useSelector((state: RootState) => state.user.user);
  const pathname = usePathname();

  // Conditional rendering
  if (pathname !== "/" && pathname !== "/login" && pathname !== "/register") {
    if (user === null) {
      return <></>;
    }
  }

  return (
    <div>
      <nav className="flex items-center justify-between lg:px-8">
        <div>
          <button
            type="button"
            className={`m-5 inline-flex items-center justify-center rounded-md text-gray-700 lg:my-5 lg:mx-0 ${
              mobileMenuOpen === false ? "" : "hidden"
            }`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <Transition show={mobileMenuOpen} as={React.Fragment}>
        <Dialog
          as="div"
          static
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50"
        >
          <div className="fixed inset-0 z-40 bg-black opacity-50" />
          <Transition.Child
            as={React.Fragment}
            enter="transform transition duration-300 ease-in-out"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition duration-300 ease-in-out"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto text-white bg-slate-900 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between px-6">
                <a className="mt-2 flex gap-2">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt=""
                  />
                  <span className="text-2xl font-semibold">Pineko</span>
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-8 flow-root">
                <div className="flex flex-col gap-5 text-md">
                  {user.user_id ? (
                    <>
                      <div className="flex items-center gap-x-3 px-6 py-3">
                        <Avatar
                          name={user.username}
                          src={user.profile_pic_url}
                        />
                        <div className="w-8/12">
                          <div className="flex">
                            <button
                              className="py-2.5 text-lg font-semibold hover:text-indigo-300"
                              onClick={() => {
                                push("/profile");
                                setMobileMenuOpen(false);
                              }}
                            >
                              {user.username}
                            </button>
                            <Text className="text-sm text-slate-300 mt-4 mx-2">
                              lv {user.level}
                            </Text>
                          </div>
                          <Progress
                            hasStripe
                            isAnimated
                            size="sm"
                            value={
                              user.experience_points - (user.level - 1) * 100
                            }
                            colorScheme="yellow"
                            className="rounded-md my-1"
                          />
                        </div>
                      </div>
                      <hr />

                      <a
                        className="px-6 text-rose-600 hover:text-rose-400"
                        onClick={() => {
                          toast({
                            position: "top",
                            title: "Logging out",
                            status: "warning",
                            duration: 2000,
                          });
                          dispatch(resetUser());
                          dispatch(resetChart());
                          dispatch(resetPrice());
                          push("/");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Logout
                      </a>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-x-3 px-6">
                        <a
                          href="/register"
                          className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Register
                        </a>
                        <a
                          href="/login"
                          className="rounded-md bg-gray-100 px-6 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Login
                        </a>
                      </div>
                      <hr />
                      <div className="px-6">
                        <a href="/"> Home</a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
};
