"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, useToast } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import {
  AiFillPieChart,
  AiOutlineLineChart,
  AiOutlineHistory,
  AiFillBook,
  AiFillCrown,
} from "react-icons/ai";
import { RootState } from "../redux/store";
import { resetUser } from "../redux/user/userSlice";
import {
  setEURUSD,
  setGBPUSD,
  setUSDCHF,
  setUSDCAD,
  setXBTUSD,
} from "../redux/price/priceSlice";

export const BottomNavbar = () => {
  const user = useSelector((state: RootState) => state.user.user.user_id);
  const pathname = usePathname();
  const { push } = useRouter();
  const toast = useToast();
  const courseRegex = /^\/course/;
  const dispatch = useDispatch();
  const pairs = ["XBT/USD", "EUR/USD", "USD/CAD", "GBP/USD", "USD/CHF"];
  const websockets: WebSocket[] = []; // Array to store WebSocket instances

  useEffect(() => {
    if (user > 0) {
      pairs.forEach((pair: string) => {
        const socket = new WebSocket("wss://ws.kraken.com");
        websockets.push(socket); // store WebSocket instance in the array

        socket.onopen = function () {
          this.onmessage = (e) => handleWebSocketData(e);
          this.send(
            JSON.stringify({
              event: "subscribe",
              pair: [pair],
              subscription: {
                name: "spread",
              },
            })
          );
        };

        function handleWebSocketData(event: any) {
          const parsedData = JSON.parse(event.data);

          if (parsedData[1]) {
            const prices = [
              parseFloat(parsedData[1][0]),
              parseFloat(parsedData[1][1]),
            ];

            if (pair === "XBT/USD") {
              dispatch(setXBTUSD(prices));
            } else if (pair === "USD/CAD") {
              dispatch(setUSDCAD(prices));
            } else if (pair === "EUR/USD") {
              dispatch(setEURUSD(prices));
            } else if (pair === "GBP/USD") {
              dispatch(setGBPUSD(prices));
            } else if (pair === "USD/CHF") {
              dispatch(setUSDCHF(prices));
            }
          }
        }
      });
    }

    return () => {
      websockets.forEach((socket) => socket.close()); // Close all WebSocket connections on unmount
    };
  }, [user]);

  useEffect(() => {
    if (
      user === 0 &&
      pathname !== "/" &&
      pathname !== "/login" &&
      pathname !== "/register"
    ) {
      toast({
        position: "top",
        title: "Session expired",
        status: "warning",
        duration: 1000,
      });
      resetUser();
      push("/");
    }
  }, []);

  if (user === 0) {
    return <></>; // Conditional rendering
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t-2 flex gap-5 justify-around p-5 bg-white text-slate-400 lg:p-3">
      <Box
        className={`grid grid-row-2 items-center text-xs text-slate-400' ${
          pathname == "/dashboard" ? "text-indigo-500" : "hover:text-indigo-100"
        }`}
        onClick={() => push("/dashboard")}
      >
        <AiFillPieChart size={25} className="mx-auto" />
        Dashboard
      </Box>

      <Box
        className={`grid grid-row-2 items-center text-xs text-slate-400' ${
          pathname == "/trade" ? "text-indigo-500" : "hover:text-indigo-100"
        }`}
        onClick={() => push("/trade")}
      >
        <AiOutlineLineChart size={25} className="mx-auto" />
        Trade
      </Box>

      <Box
        className={`grid grid-row-2 items-center text-xs text-slate-400'} ${
          pathname == "/history" ? "text-indigo-500" : "hover:text-indigo-100"
        }`}
        onClick={() => push("/history")}
      >
        <AiOutlineHistory size={25} className="mx-auto" />
        History
      </Box>

      <Box
        className={`grid grid-row-2 items-center text-xs text-slate-400'} ${
          courseRegex.test(pathname)
            ? "text-indigo-500"
            : "hover:text-indigo-100"
        }`}
        onClick={() => push("/course-categories")}
      >
        <AiFillBook size={25} className="mx-auto" />
        Courses
      </Box>

      <Box
        className={`grid grid-row-2 justify-center text-xs text-slate-400'} ${
          pathname == "/leaderboard"
            ? "text-indigo-500"
            : "hover:text-indigo-100"
        }`}
        onClick={() => push("/leaderboard")}
      >
        <AiFillCrown size={25} className="mx-auto" />
        Leaderboard
      </Box>
    </div>
  );
};
