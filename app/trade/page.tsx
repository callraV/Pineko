"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Stack,
  useToast,
  Radio,
  RadioGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { resetChart, setChart } from "../redux/chart/chartSlice";
import type { RootState } from "../redux/store";
import useSound from "use-sound";
import buySellSound from "../../public/sounds/buy_sell.mp3";
import { Loading } from "../components/Loading/Loading";
import { isMarketOpen } from "../utils/MarketHoursUtil";
import { News } from "../components/News/News";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("../components/Chart/Chart"), {
  ssr: false,
}); // prevent SSR

const Trade = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const regex = /[^a-zA-Z]+/g;

  const [playBuySellSound] = useSound(buySellSound);

  const user = useSelector((state: RootState) => state.user.user);
  const chartData = useSelector((state: RootState) => state.chart.chart);

  const [pair, setPair] = useState("XBT/USD");
  const [interval, setInterval] = useState("1");

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

  const buyPriceXBTUSD = useSelector(
    (state: RootState) => state.price.XBTUSD.buyPrice
  );
  const buyPriceEURUSD = useSelector(
    (state: RootState) => state.price.EURUSD.buyPrice
  );
  const buyPriceUSDCAD = useSelector(
    (state: RootState) => state.price.USDCAD.buyPrice
  );
  const buyPriceGBPUSD = useSelector(
    (state: RootState) => state.price.GBPUSD.buyPrice
  );
  const buyPriceUSDCHF = useSelector(
    (state: RootState) => state.price.USDCHF.buyPrice
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

  const buyPrice = (pair: any) => {
    const price =
      pair === "XBT/USD"
        ? buyPriceXBTUSD
        : pair === "EUR/USD"
        ? buyPriceEURUSD
        : pair === "USD/CAD"
        ? buyPriceUSDCAD
        : pair === "GBP/USD"
        ? buyPriceGBPUSD
        : pair === "USD/CHF"
        ? buyPriceUSDCHF
        : 0;

    return price;
  };

  useEffect(() => {
    const socket = new WebSocket("wss://ws.kraken.com");

    socket.onopen = function () {
      this.onclose = () => console.log("SOCKET CLOSED");
      this.onmessage = (e) => handleWebSocketData(e);
      this.send(
        JSON.stringify({
          event: "subscribe",
          pair: [pair],
          subscription: {
            interval: parseInt(interval),
            name: "ohlc",
          },
        })
      );
    };

    function handleWebSocketData(event: any) {
      const parsedData = JSON.parse(event.data);

      if (parsedData[1]) {
        dispatch(setChart(parsedData));
      }
    }

    return () => {
      socket.close(); // closes websocket connection on unmount
      dispatch(resetChart());
    };
  }, [pair, interval]);

  const handleTrade = (trade: any) => {
    fetch(`https://pineko-api.vercel.app/api/trade/open`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trade),
    })
      .then((response) => response.json())
      .then((data) => {
        toast({
          position: "top-right",
          title: "Order received",
          description: data.message,
          status: "warning",
          variant: "top-accent",
          duration: 2000,
        });
      });
  };

  const handleBuySell = (isBuy: number) => {
    const buySell = {
      user_id: user.user_id,
      currency_pair: pair,
      price: buyPrice(pair),
      is_buy: isBuy,
      quantity: pair === "XBT/USD" ? 1 : 100000,
    };

    handleTrade(buySell);
    playBuySellSound();
  };

  if (chartData.pair === null) {
    return <Loading />;
  }

  return (
    <div className="pt-14">
      <div className="mx-10 lg:px-20">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <div className="flex flex-col gap-1">
                <h1 className="font-semibold text-3xl lg:text-4xl">
                  {sellPrice(pair) === 0 ? (
                    <Spinner size="sm" />
                  ) : (
                    sellPrice(pair)
                  )}
                </h1>

                {isMarketOpen(pair) ? (
                  <div className="text-indigo-600 font-semibold">
                    Market open
                  </div>
                ) : (
                  <div className="text-orange-600 font-semibold">
                    Market closed
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="font-semibold text-2xl lg:text-3xl flex justify-end">
                {pair.replace(regex, "")}
              </h1>

              <Select
                size="sm"
                variant="unstyled"
                onChange={(event) => {
                  setPair(event.target.value);
                }}
                value={pair}
                iconSize="sm"
              >
                <option value="XBT/USD">Bitcoin/USD</option>
                <option value="EUR/USD">EUR/USD</option>
                <option value="USD/CAD">USD/CAD</option>
                <option value="GBP/USD">GBP/USD</option>
                <option value="USD/CHF">USD/CHF</option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Tabs isFitted colorScheme="gray">
        <TabList>
          <Tab>Trade</Tab>
          <Tab>News</Tab>
        </TabList>

        <TabPanels className="pt-2">
          <TabPanel>
            <div className="flex flex-col mb-20 lg:mx-20">
              {isMarketOpen(pair) ? (
                <>
                  <div className="grid grid-rows-2 md:gap-1 md:grid-cols-3">
                    <div className="mx-auto font-semibold text-slate-600 md:mx-0">
                      <RadioGroup
                        onChange={setInterval}
                        value={interval}
                        colorScheme="purple"
                      >
                        <Stack direction="row">
                          <Radio value="1">1M</Radio>
                          <Radio value="5">5M</Radio>
                          <Radio value="15">15M</Radio>
                          <Radio value="30">30M</Radio>
                          <Radio value="60">60M</Radio>
                        </Stack>
                      </RadioGroup>
                    </div>

                    <div className="invisible md:visible grid grid-flow-col justify-stretch gap-2 md:pl-20 md:col-span-2">
                      <Button
                        colorScheme="red"
                        size="sm"
                        variant="outline"
                        rounded="full"
                        onClick={() => handleBuySell(0)}
                      >
                        Sell: {sellPrice(pair)}
                      </Button>
                      <Button
                        colorScheme="green"
                        size="sm"
                        variant="outline"
                        rounded="full"
                        onClick={() => handleBuySell(1)}
                      >
                        Buy: {buyPrice(pair)}
                      </Button>
                    </div>
                  </div>

                  <Chart
                    pair={pair.replace(regex, "")}
                    interval={interval}
                    sellPrice={sellPrice(pair)}
                  />

                  <div className="visible md:invisible grid grid-flow-row justify-stretch gap-2">
                    <Button
                      colorScheme="red"
                      size="sm"
                      variant="outline"
                      rounded="full"
                      p="5"
                      onClick={() => handleBuySell(0)}
                    >
                      Sell: {sellPrice(pair)}
                    </Button>
                    <Button
                      colorScheme="green"
                      size="sm"
                      variant="outline"
                      rounded="full"
                      p="5"
                      onClick={() => handleBuySell(1)}
                    >
                      Buy: {buyPrice(pair)}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="mx-auto my-20">
                  The forex market is closed now. Try trading in Bitcoin
                  instead!
                </div>
              )}
            </div>
          </TabPanel>

          <TabPanel>
            <News pair={pair} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Trade;
