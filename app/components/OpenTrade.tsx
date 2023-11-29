"use client";

import React from "react";
import {
  Tbody,
  Td,
  Button,
  TableCaption,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";

import { setOpenTrades } from "../redux/open/openSlice";
import { setUser } from "../redux/user/userSlice";

import useSound from "use-sound";
import winSound from "../../public/sounds/cha_ching.mp3";
import loseSound from "../../public/sounds/negative_beeps.mp3";

import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export const OpenTrade = ({ tradeData }: any) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const [playWinSound] = useSound(winSound);
  const [playLoseSound] = useSound(loseSound);

  const sellPriceXBTUSD = useSelector(
    (state: RootState) => state.price.XBTUSD.sellPrice
  );
  const sellPriceEURUSD = useSelector(
    (state: RootState) => state.price.EURUSD.sellPrice
  );
  const sellPriceUSDCAD = useSelector(
    (state: RootState) => state.price.USDCAD.sellPrice
  );
  const sellPriceGBPUSD = useSelector(
    (state: RootState) => state.price.GBPUSD.sellPrice
  );
  const sellPriceUSDCHF = useSelector(
    (state: RootState) => state.price.USDCHF.sellPrice
  );

  const sellPrice = (pair: any) => {
    const price =
      pair === "XBT/USD"
        ? sellPriceXBTUSD
        : pair === "EUR/USD"
        ? sellPriceEURUSD
        : pair === "USD/CAD"
        ? sellPriceUSDCAD
        : pair === "GBP/USD"
        ? sellPriceGBPUSD
        : pair === "USD/CHF"
        ? sellPriceUSDCHF
        : 0;

    return price;
  };

  const handleClose = (trade: any) => {
    fetch(`/api/trade/close`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON content type
      },
      body: JSON.stringify({
        user_id: trade[1],
        ot_id: trade[0],
        close_price: sellPrice(trade[2]),
        profit_loss: calculatePL(trade[2], trade[4], trade[3], trade[5]),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast({
          title: "Order closed",
          description: calculatePL(trade[2], trade[4], trade[3], trade[5]),
          status: `${
            calculatePL(trade[2], trade[4], trade[3], trade[5]) > 0
              ? "success"
              : "error"
          }`,
          duration: 1000,
          isClosable: true,
          variant: "top-accent",
          position: "top",
        });

        if (calculatePL(trade[2], trade[4], trade[3], trade[5]) > 0) {
          playWinSound();
        } else {
          playLoseSound();
        }

        dispatch(setOpenTrades(data[0]));
        dispatch(setUser(data[1]));
      });
  };

  const calculatePL = (
    pair: string,
    buy: number,
    open_price: number,
    quantity: number
  ) => {
    let pl = 0;

    pl =
      buy === 1
        ? (sellPrice(pair) - open_price) * quantity
        : (open_price - sellPrice(pair)) * quantity;

    return parseFloat((Math.round(pl * 100) / 100).toFixed(2));
  };

  return (
    <>
      {tradeData.length > 0 ? (
        tradeData.map((trade: any, index: number) => (
          <Tbody>
            <tr key={index}>
              <Td>
                <Tooltip
                  label={trade[6]}
                  aria-label="A tooltip"
                  placement="bottom-end"
                >
                  {trade[2]}
                </Tooltip>
              </Td>
              <Td>{trade[4] === 1 ? "Buy" : "Sell"}</Td>
              <Td className="hidden md:table-cell">{trade[3]}</Td>
              {sellPrice(trade[2]) === 0 ? (
                <>
                  <Td className="hidden md:table-cell">
                    <Spinner size="sm" />
                  </Td>
                  <Td>
                    <Spinner size="sm" />
                  </Td>
                </>
              ) : (
                <>
                  <Td className="hidden md:table-cell">
                    {sellPrice(trade[2])}
                  </Td>
                  <Td
                    className={
                      calculatePL(trade[2], trade[4], trade[3], trade[5]) > 0
                        ? "text-green-600 font-bold"
                        : calculatePL(trade[2], trade[4], trade[3], trade[5]) <
                          0
                        ? "text-red-500 font-bold"
                        : "text-orange-500 font-bold"
                    }
                  >
                    {calculatePL(trade[2], trade[4], trade[3], trade[5])}
                    <span>
                      {calculatePL(trade[2], trade[4], trade[3], trade[5]) > 0
                        ? " ➚"
                        : calculatePL(trade[2], trade[4], trade[3], trade[5]) <
                          0
                        ? " ➘"
                        : ""}
                    </span>
                  </Td>
                </>
              )}

              <Td>
                <Button
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleClose(trade);
                  }}
                  isDisabled={sellPrice(trade[2]) === 0 ? true : false}
                >
                  Close
                </Button>
              </Td>
            </tr>
          </Tbody>
        ))
      ) : (
        <TableCaption>
          You don't have any open trades at the moment.
        </TableCaption>
      )}
    </>
  );
};
