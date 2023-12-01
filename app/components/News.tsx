"use client";

import React, { useEffect, useState } from "react";
import { Loading } from "./Loading";

export const News = (props: any) => {
  const [news, setNews] = useState([""]);
  const [totalScore, setTotalScore] = useState(0);

  const newsParam = (p: string) => {
    const param =
      p === "XBT/USD"
        ? "xbt/usd OR bitcoin"
        : p === "EUR/USD"
        ? "eur/usd OR eurusd"
        : p === "USD/CAD"
        ? "usd/cad ORD usdcad"
        : p === "GBP/USD"
        ? "gbp/usd OR gbpusd"
        : p === "USD/CHF"
        ? "usd/chf OR usdchf"
        : 0;

    return param;
  };

  function formatTimestamp(timestamp: string): string {
    const year = parseInt(timestamp.slice(0, 4));
    const month = parseInt(timestamp.slice(4, 6)) - 1; // Subtract 1 from month as it's zero-based
    const day = parseInt(timestamp.slice(6, 8));
    const hour = parseInt(timestamp.slice(9, 11));
    const minute = parseInt(timestamp.slice(11, 13));

    const date = new Date(year, month, day, hour, minute);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${String(date.getFullYear() % 100).padStart(2, "0")}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;

    return `${formattedDate} | ${formattedTime}`;
  }

  const getNews = () => {
    fetch(
      `https://newsapi.org/v2/everything?q=${newsParam(
        props.pair
      )}&language=en&apiKey=6338b5e7d5374d90947fb44ee0b10b07`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.articles) {
          //
          const originalData = data.articles.slice(50);
          console.log(originalData);

          // //--------------------
          // var analyzedData = [""];

          // originalData.map((article: any) => {
          //   const sentimentScore = prosusAIFinbert(article.description);
          //   console.log(sentimentScore);
          //   article.sentiment = sentimentScore
          //   analyzedData.push(article)
          // });
          // //---------------

          setNews(originalData);
          // console.log(analyzedData);
        } else {
          setNews([""]);
        }
      });
  };

  const prosusAIFinbert = (description: any) => {
    fetch(`https://api-inference.huggingface.co/models/ProsusAI/finbert`, {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
      },
      body: JSON.stringify({ inputs: { description } }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  };

  useEffect(() => {
    getNews();
  }, [props.pair]);

  const x = totalScore / news.length;

  if (props.pair === null) {
    return <Loading />; // Conditional rendering
  }

  return (
    <>
      <div>
        <div className="mx-auto">
          {news.length === 1 ? (
            <div className="flex justify-center py-10">
              Too many requests in 24 hours. Try again later.
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 mb-8">
                <p className="text-md text-slate-600 mx-auto">
                  Average Sentiment
                </p>

                {x <= -0.35 ? (
                  <div className="flex flex-col gap-0.5 bg-red-200 text-red-700 font-semibold rounded-full text-xl mx-auto px-8 py-3">
                    <a className="mx-auto">Bearish</a>
                    <span className="text-xs mx-auto">
                      Sell position recommended
                    </span>
                  </div>
                ) : -0.35 < x && x <= -0.15 ? (
                  <div className="flex flex-col gap-0.5 bg-orange-200 text-orange-700 font-semibold rounded-full text-xl mx-auto px-8 py-3">
                    <a className="mx-auto">Somewhat-Bearish</a>
                    <span className="text-xs mx-auto">
                      Sell position recommended
                    </span>
                  </div>
                ) : -0.15 < x && x < 0.15 ? (
                  <div className="flex flex-col gap-0.5 bg-gray-200 text-gray-700 font-semibold rounded-full text-xl mx-auto px-8 py-3">
                    <a className="mx-auto">Neutral</a>
                  </div>
                ) : 0.15 <= x && x < 0.35 ? (
                  <div className="flex flex-col gap-0.5 bg-yellow-200 text-yellow-700 font-semibold rounded-full text-2xl mx-auto px-10 py-3">
                    <a className="mx-auto">Somewhat bullish</a>
                    <span className="text-xs mx-auto">
                      Buy position recommended
                    </span>
                  </div>
                ) : x >= 0.35 ? (
                  <div className="flex flex-col gap-0.5 bg-green-200 text-green-700 font-semibold rounded-full text-xl mx-auto px-8 py-3">
                    <a className="mx-auto">Bullish</a>
                    <span className="text-xs mx-auto">
                      Buy position recommended
                    </span>
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-5 border-t border-gray-200 pb-20 pt-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {news.map((article: any, index: number) => (
                  <article
                    key={index}
                    className="flex flex-col items-start justify-between border-2 border-gray-100 p-5 rounded-xl hover:bg-indigo-100"
                  >
                    <div className="flex items-center gap-x-4 text-xs">
                      <time className="text-gray-500">
                        {article.publishedAt}
                      </time>
                      <a
                        className={`'relative rounded-full px-3 py-1.5 font-medium text-gray-600' `}
                      >
                        sentiment
                      </a>
                    </div>
                    <a
                      className="group relative"
                      target="_blank"
                      href={article.url}
                      rel="noopener noreferrer"
                    >
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 my-5">
                        {article.description}
                      </p>
                    </a>
                    <div className="relative flex items-center gap-x-4">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">
                          {article.author}
                        </p>
                        <a className="text-gray-600">{article.source.name}</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
