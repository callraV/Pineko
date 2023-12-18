"use client";

import React, { useEffect, useState } from "react";
import { Loading } from "../Loading/Loading";
import { formatTimestamp } from "@/app/utils/FormatTimestampUtil";
import { Spinner } from "@chakra-ui/react";

export const News = (props: any) => {
  const [news, setNews]: any[] = useState([]);

  const newsParam = (p: string) => {
    const param =
      p === "XBT/USD"
        ? "xbt/usd OR bitcoin"
        : p === "EUR/USD"
        ? "eur/usd OR eurusd"
        : p === "USD/CAD"
        ? "usd/cad OR usdcad"
        : p === "GBP/USD"
        ? "gbp/usd OR gbpusd"
        : p === "USD/CHF"
        ? "usd/chf OR usdchf"
        : 0;

    return param;
  };

  const getNews = () => {
    fetch(
      `https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/everything?q=${newsParam(
        props.pair
      )}&language=en&apiKey=6338b5e7d5374d90947fb44ee0b10b07`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.articles) {
          const originalData = data.articles.slice(0, 30);
          var analyzedData: any[] = [];

          originalData.map((article: any) => {
            fetch(
              `https://api-inference.huggingface.co/models/ProsusAI/finbert`, // find sentiment using ProsusAI's finbert model
              {
                method: "POST",
                headers: {
                  Authorization: "Bearer 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",
                },
                body: JSON.stringify({ inputs: `${article.description}` }),
              }
            )
              .then((response) => response.json())
              .then((data) => {
                article.sentiment = getLikelySentiment(data[0]);
                analyzedData.push(article);
              });
          });
          setNews(analyzedData);
        }
      });
  };

  const getLikelySentiment = (array: any) => {
    if (array) {
      let label = "None";
      let highestScore = 0;

      array.forEach((labelScore: any) => {
        if (labelScore.score > highestScore) {
          highestScore = labelScore.score;
          label = labelScore.label;
        }
      });

      return label;
    }
  };

  const getModeSentiment = (array: any) => {
    var pos: string[] = []; // 1
    var net: string[] = []; // 2
    var neg: string[] = []; // 3
    array.forEach((article: any) => {
      if (article.sentiment === "positive") {
        pos.push(article.sentiment);
      } else if (article.sentiment === "negative") {
        neg.push(article.sentiment);
      } else if (article.sentiment === "neutral") {
        net.push(article.sentiments);
      }
    });

    const count: number[] = [pos.length, net.length, neg.length];
    if (count.indexOf(Math.max(...count)) === 0) {
      return "Positive";
    } else if (count.indexOf(Math.max(...count)) === 1) {
      return "Neutral";
    } else {
      return "Negative";
    }
  };

  useEffect(() => {
    getNews();
  }, [props.pair]);

  if (props.pair === null) {
    return <Loading />;
  }

  return (
    <>
      <div>
        <div className="mx-auto">
          {news.length === 0 ? (
            <div className="flex justify-center py-10">
              <Spinner />
              {/* Too many requests in 24 hours. Try again later. */}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 mb-8">
                <p className="text-md font-semibold text-slate-600 mx-auto">
                  Mode Sentiment
                </p>
                <div
                  className={`bg-gray-200 text-gray-700 font-semibold rounded-full text-xl mx-auto px-8 py-3 ${
                    getModeSentiment(news) === "Negative"
                      ? "bg-red-200 text-red-800"
                      : getModeSentiment(news) === "Positive"
                      ? "bg-green-200  text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <a className="mx-auto">{getModeSentiment(news)}</a>
                </div>
              </div>

              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-5 border-t border-gray-200 pb-20 pt-8 md:grid-cols-2 lg:mx-5 lg:max-w-none lg:grid-cols-3">
                {news.map((article: any, index: number) => (
                  <article
                    key={index}
                    className="flex flex-col items-start justify-between border-2 border-gray-100 p-5 rounded-xl hover:bg-indigo-100"
                  >
                    <div className="flex items-center gap-x-4 text-xs">
                      <time className="text-gray-500">
                        {formatTimestamp(article.publishedAt)}
                      </time>
                      <a
                        className={`relative rounded-full px-3 py-1.5 font-medium text-gray-600 ${
                          article.sentiment === "negative"
                            ? "bg-red-100  text-red-700"
                            : article.sentiment === "positive"
                            ? "bg-green-100  text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {article.sentiment
                          ? article.sentiment
                          : "rate limit reached"}
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
