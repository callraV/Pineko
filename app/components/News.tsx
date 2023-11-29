"use client";

import React, { useEffect, useState } from "react";
import { Loading } from "./Loading";

export const News = (props: any) => {
  const [news, setNews] = useState([""]);
  const [totalScore, setTotalScore] = useState(0);

  const newsParam = (p: string) => {
    const param =
      p === "XBT/USD"
        ? "CRYPTO:BTC"
        : p === "EUR/USD"
        ? "FOREX:EUR"
        : p === "USD/CAD"
        ? "FOREX:CAD"
        : p === "GBP/USD"
        ? "FOREX:GBP"
        : p === "USD/CHF"
        ? "FOREX:CHF"
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

  const prosusAIFinbert = (headline: any) => {
    fetch(`https://api-inference.huggingface.co/models/ProsusAI/finbert`, {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
      },
      body: JSON.stringify({ inputs: { headline } }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };
  // "sentiment_score_definition":
  // x <= -0.35: Bearish
  // -0.35 < x <= -0.15: Somewhat-Bearish
  // -0.15 < x < 0.15: Neutral
  // 0.15 <= x < 0.35: Somewhat_Bullish
  // x >= 0.35: Bullish

  // "relevance_score_definition": "0 < x <= 1, with a higher score indicating higher relevance.",

  const getNews = () => {
    fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${newsParam(
        props.pair
      )}&sort=LATEST&apikey=3DZAZABBFIQGLWL2`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetching news now...");
        if (data.feed) {
          let score = 0;
          setNews(data.feed);
          console.log(data.feed);
          {
            data.feed.map(
              (post: any) => (score = score + post.overall_sentiment_score)
            );
          }
          setTotalScore(score);
        } else {
          setNews([""]);
        }
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
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-3 mb-8">
            <p className="text-md text-slate-600 mx-auto">
              Recommended Position
            </p>
            {x <= -0.35 ? (
              <div className="flex flex-col bg-red-200 text-red-700 font-semibold rounded-full text-xl mx-auto px-8 py-3">
                <a className="mx-auto">Sell</a>
                <span className="text-xs mx-auto">(low risk)</span>
              </div>
            ) : -0.35 < x && x < 0 ? (
              <div className="flex flex-col bg-orange-200 text-orange-700 font-semibold rounded-full text-xl mx-auto px-8 py-3">
                <a className="mx-auto">Sell</a>
                <span className="text-xs mx-auto">(medium risk)</span>
              </div>
            ) : x === 0 ? (
              <div className="flex flex-col bg-gray-200 text-gray-700 font-semibold rounded-full text-xl mx-auto px-8 py-3">
                <a className="mx-auto">None</a>
              </div>
            ) : 0 < x && x < 0.35 ? (
              <div className="flex flex-col bg-yellow-200 text-yellow-700 font-semibold rounded-full text-2xl mx-auto px-10 py-3">
                <a className="mx-auto">Buy</a>
                <span className="text-xs mx-auto">(medium risk)</span>
              </div>
            ) : x >= 0.35 ? (
              <div className="flex flex-col bg-green-200 text-green-700 font-semibold rounded-full text-xl mx-auto px-8 py-3">
                <a className="mx-auto">Buy</a>
                <span className="text-xs mx-auto">(low risk)</span>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-5 border-t border-gray-200 pb-20 pt-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {news.length === 1 ? (
              <div className="mx-auto lg:col-span-3">
                Too many requests in 24 hours. Try again later.{" "}
              </div>
            ) : (
              news.map((post: any, index: number) => (
                <article
                  key={index}
                  className="flex flex-col items-start justify-between border-2 border-gray-100 p-5 rounded-xl"
                >
                  <div className="flex items-center gap-x-4 text-xs">
                    <time className="text-gray-500">
                      {formatTimestamp(post.time_published)}
                    </time>
                    <a
                      className={`'relative rounded-full px-3 py-1.5 font-medium text-gray-600' ${
                        post.overall_sentiment_label === "Neutral"
                          ? "bg-gray-100"
                          : post.overall_sentiment_label === "Bullish"
                          ? "bg-green-100"
                          : post.overall_sentiment_label === "Bearish"
                          ? "bg-red-100"
                          : post.overall_sentiment_label === "Somewhat-Bearish"
                          ? "bg-orange-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      {post.overall_sentiment_label}
                    </a>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-indigo-200">
                      <a href={post.url}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </a>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                      {post.summary}
                    </p>
                  </div>
                  <div className="relative mt-5 flex items-center gap-x-4">
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-gray-900">
                        <a>
                          <span className="absolute inset-0" />
                          {post.authors}
                        </a>
                      </p>
                      <a href={post.url} className="text-gray-600">
                        {post.source_domain}
                      </a>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};