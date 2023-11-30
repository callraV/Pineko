"use client";

import React, { useState, useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Spinner } from "@chakra-ui/react";
import _debounce from "lodash/debounce";

const Chart = (props: any) => {
  const [maxYValue, setMaxYValue] = useState(0);
  const chart = useSelector((state: RootState) => state.chart.chart.data);

  const newData = useMemo(() => {
    return {
      x: new Date(),
      y: [chart[2], chart[3], chart[4], chart[5]],
    };
  }, [chart]);

  const [series, setSeries] = useState([
    {
      name: "candle",
      data: [
        {
          x: new Date(),
          y: [0],
        },
      ],
    },
  ]);

  // debounce the API call to avoid frequent requests and minimize lags
  const debouncedFetchData = _debounce(() => {
    fetch(
      `https://api.kraken.com/0/public/OHLC?pair=${props.pair}&interval=${props.interval}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((d) => {
        var result = d.result;
        var history = result[Object.keys(result)[0]].slice(-100);

        var arr: { x: Date; y: any[] }[] = [];

        history.forEach((h: any) => {
          const time = h[0];
          const open = h[1];
          const high = h[2];
          const low = h[3];
          const close = h[4];

          const historyData = {
            x: new Date(time * 1000),
            y: [open, high, low, close],
          };

          arr.push(historyData);
        });

        arr.push(newData);

        if (arr.length > 100) {
          arr.shift();
        }

        setSeries([
          {
            name: "candle",
            data: arr,
          },
        ]);

        if (arr.length > 0) {
          const maxY = Math.max(...arr.map((data) => Math.max(...data.y)));
          setMaxYValue(maxY);
        }
      });
  }, 500); // adjust the debounce delay as needed

  useEffect(() => {
    debouncedFetchData();
  }, [props.pair, props.interval, debouncedFetchData]);

  const options = useMemo(() => {
    return {
      chart: {
        animations: {
          enabled: true,
          easing: "easeinout" as "easeinout", // type assertion
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
        height: 350,
        type: "candlestick" as "candlestick", // type assertion
      },
      annotations: {
        yaxis: [
          {
            y: props.sellPrice,
            borderColor: "#805ad5",
            label: {
              borderColor: "#805ad5",
              style: {
                fontSize: "12px",
                color: "#fff",
                background: "#805ad5",
              },
              offsetY: 10,
              offsetX: 50,
              text: props.sellPrice,
            },
          },
        ],
      },
      tooltip: {
        enabled: true,
      },
      xaxis: {
        type: "category" as "category", // type assertion
        labels: {
          formatter: function (val: any) {
            return dayjs(val).format("MMM DD HH:mm");
          },
        },
      },
      yaxis: {
        opposite: true,
        tooltip: {
          enabled: true,
        },
        max: maxYValue,
      },
    };
  }, [maxYValue, props.sellPrice]);

  return (
    <div id="chart">
      {chart ? (
        <ReactApexChart
          options={options}
          series={series}
          type="candlestick"
          height={350}
        />
      ) : (
        <>
          <div className="flex justify-center py-28">
            <Spinner />
          </div>
        </>
      )}
    </div>
  );
};

export default Chart;
