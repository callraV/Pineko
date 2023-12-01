"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

export const Badge = () => {
  const user_id = useSelector((state: RootState) => state.user.user.user_id);

  const [badges, setBadges] = useState([""]);
  const [earnedBadges, setEarnedBadges] = useState([""]);

  useEffect(() => {
    fetch(`/rewriteapi/badges`)
      .then((response) => response.json())
      .then((data) => {
        setBadges(data);
      });

    fetch(`/rewriteapi/badges/earned?user=${user_id}`)
      .then((response) => response.json())
      .then((data) => {
        setEarnedBadges(data);
      });
  }, []);

  return (
    <Card className="mx-auto md:w-11/12" variant="outline">
      <CardHeader>
        <div className="flex flex-col items-center justify-center gap-1 mt-2">
          <h2 className="text-2xl font-bold">Badges</h2>
          <p className="text-slate-600 text-center">Collect them all!</p>
        </div>
      </CardHeader>

      <CardBody>
        <div className="grid grid-cols-3 items-center lg:mx-3 ">
          {badges[0] === "" ? (
            <div className="col-span-3 flex justify-center pt-16 pb-20">
              <Spinner />
            </div>
          ) : (
            badges.map((badge: any) => (
              <div
                className={`grid grid-rows-4 text-slate-500 ${
                  earnedBadges.includes(badge[0]) ? "opacity-100" : "opacity-25"
                }`}
              >
                <div className="row-span-2 flex items-center justify-center mb-3">
                  <Image
                    boxSize={["60px", "70px", "70px"]}
                    objectFit="cover"
                    src={badge[3]}
                  />
                </div>
                <div className="text-md text-center font-semibold lg:text-xl">
                  {badge[1]}
                </div>
                <p className="text-xs text-center lg:text-sm">{badge[2]}</p>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
};
