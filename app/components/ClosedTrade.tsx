"use client";

import React from "react";
import { Tr, Td, Tooltip } from "@chakra-ui/react";

export const ClosedTrade = (props: any) => {
  return (
    <Tr
      key={props.index}
      className={props.trade[5] > 0 ? "bg-green-100" : "bg-red-100"}
    >
      <Td>
        <Tooltip
          label={props.trade[4]}
          aria-label="A tooltip"
          placement="bottom-end"
        >
          {props.trade[0]}
        </Tooltip>
      </Td>
      <Td>{props.trade[1] === 1 ? "Buy" : "Sell"}</Td>
      <Td className="hidden md:table-cell">{props.trade[2]}</Td>
      <Td className="hidden md:table-cell">{props.trade[3]}</Td>
      <Td
        className={
          props.trade[5] > 0
            ? "text-green-600 font-bold"
            : "text-red-500 font-bold"
        }
      >
        {props.trade[5]}
      </Td>
    </Tr>
  );
};
