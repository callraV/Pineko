"use client";

import React from "react";
import { Card, CardBody, Text } from "@chakra-ui/react";
import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

export const Balance = () => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <>
      <Card variant="filled" className="mx-auto w-11/12">
        <CardBody>
          <p className="text-lg font-bold text-slate-500">Balance</p>
          <Text className="text-4xl font-bold mt-3 mb-5">${user.balance}</Text>
        </CardBody>
      </Card>
    </>
  );
};
