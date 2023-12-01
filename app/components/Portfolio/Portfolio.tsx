"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@chakra-ui/react";
import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { Balance } from "../Balance/Balance";
import { useRouter } from "next/navigation";

export const Portfolio = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [history, setHistory] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const { push } = useRouter();

  const accumulatedProfit = (data: any) => {
    if (data[0] === "No data to show") {
      return "0";
    } else {
      let totalProfit = 0;
      data.map((ct: any) => {
        totalProfit = totalProfit + ct[5];
      });

      setTotalProfit(parseFloat(totalProfit.toFixed(2)));
    }
  };

  useEffect(() => {
    fetch(`/rewriteapi/trade/history?user=${user.user_id}`)
      .then((response) => response.json())
      .then((data) => {
        setHistory(data);
        accumulatedProfit(data);
      });
  }, [user]);

  return (
    <>
      <div className="shadow-md mx-auto pb-5 md:py-3 max-w-2xl rounded-lg ring-1 ring-gray-200 mt-16 lg:flex lg:max-w-none">
        <div className="w-full flex flex-col gap-4">
          <h3 className="mx-6 pt-4 text-xl font-bold lg:mx-8 md:pt-3">
            Portfolio
          </h3>

          <Balance />

          <div className="mx-4 flex gap-3 lg:mx-8">
            <Card variant="filled" className="flex-grow">
              <CardBody>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-slate-500">Total trades:</p>
                  <p className="text-xl font-bold">
                    {history[0] === "No data to show" ? 0 : history.length}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card variant="filled" className="flex-grow">
              <CardBody>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-slate-500">
                    Average profit per trade:
                  </p>
                  <p className="text-xl font-bold">
                    ${(totalProfit / history.length).toFixed(2)}
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="p-4 lg:pl-0 lg:pr-8 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div className="rounded-lg bg-slate-100 py-8 text-center lg:flex lg:flex-col lg:justify-center lg:py-16">
            <div className="mx-auto max-w-xs px-8">
              <p className="text-md font-semibold text-slate-500">
                Accumulated Profit
              </p>
              <p className="mt-6 flex items-baseline justify-center gap-x-2">
                <span className="text-4xl font-bold">${totalProfit}</span>
              </p>

              <button
                onClick={() => push("/trade")}
                className="mt-8 mb-2 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Trade
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
