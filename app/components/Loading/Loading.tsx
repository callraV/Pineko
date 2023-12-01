"use client";

import React from "react";
import { CircularProgress } from "@chakra-ui/react";

export const Loading = () => {
  return (
    <div className="py-80 flex items-center justify-center">
      <CircularProgress isIndeterminate color="purple.300" />
    </div>
  );
};
