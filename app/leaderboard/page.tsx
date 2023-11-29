"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@chakra-ui/react";
import { PiCrownSimpleFill } from "react-icons/pi";
import { GiCurlyWing } from "react-icons/gi";
import { Loading } from "../components/Loading";

const Leaderboard = () => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetch(`/api/users`)
      .then((response) => response.json())
      .then((data) => {
        setRanking(data);
      });
  }, []);

  // Conditional rendering
  if (ranking.length === 0) {
    return <Loading />;
  }

  return (
    <div className="mx-10 flex flex-col gap-5 pt-10 pb-32 ">
      <div className="mx-auto max-w-2xl lg:max-w-4xl flex flex-col gap-5 pb-5">
        <h2 className="text-3xl font-bold">Leaderboard</h2>

        <div>
          <PiCrownSimpleFill className="mx-auto text-yellow-500" size={30} />
          <div className="flex">
            <GiCurlyWing className="text-yellow-500" size={50} />
            <img
              className="mx-auto h-20 w-20 rounded-full"
              src={ranking[0][4]}
            />
            <GiCurlyWing
              className="text-yellow-500"
              size={50}
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center justify-center">
          <p className="font-semibold text-xl">{ranking[0][1]}</p>
          <div className="text-lg font-bold mb-1 px-4 py-1.5 rounded-full bg-yellow-400 text-yellow-800">
            1
          </div>
          <div className="flex gap-1">
            <Badge>Lv {ranking[0][7]}</Badge>
            <p className="text-sm text-slate-400">{ranking[0][6]} exp.</p>
          </div>
        </div>
      </div>

      <ul role="list" className="divide-y divide-gray-100 lg:mx-10 lg:px-10">
        {ranking.slice(1).map((person, index) => (
          <li key={person[2]} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={person[4]}
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {person[1]}
                </p>
                <div className="flex gap-1">
                  <Badge>Lv {person[7]}</Badge>
                  <p className="text-sm text-slate-400">{person[6]} exp.</p>
                </div>
              </div>
            </div>
            <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
              <div
                className={`text-md font-bold mb-1 px-3.5 py-1.5 rounded-full ${
                  index === 0
                    ? "bg-slate-300 text-slate-800"
                    : index === 1
                    ? "bg-amber-600 text-amber-950"
                    : "bg-indigo-400"
                } text-white`}
              >
                {index + 2}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
