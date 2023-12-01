"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Table, Thead, Tr, Th, Tbody, TableContainer } from "@chakra-ui/react";
import { Loading } from "../components/Loading/Loading";
import { ClosedTrade } from "../components/ClosedTrade/ClosedTrade";

const History = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 30;

  useEffect(() => {
    fetch(`/rewriteapi/trade/history?user=${user.user_id}`)
      .then((response) => response.json())
      .then((data) => {
        setHistory(data);
      });
  }, []);

  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;

  const paginate = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  if (history.length === 0) {
    return <Loading />;
  }

  return (
    <div className="mx-5 flex flex-col gap-10 pt-10 pb-24">
      <h2 className="font-bold text-3xl mx-auto">Trading History</h2>

      <div className="lg:mx-10">
        <TableContainer className="overflow-x-auto">
          <Table size={["sm", "md", "md"]}>
            <Thead className="px-2">
              <Tr>
                <Th>Pair</Th>
                <Th>Pos.</Th>
                <Th className="hidden md:table-cell">Open</Th>
                <Th className="hidden md:table-cell">Close</Th>
                <Th>P/L</Th>
              </Tr>
            </Thead>

            <Tbody>
              {history[0] === "No data to show" ? (
                <></>
              ) : (
                history
                  .slice(indexOfFirstTrade, indexOfLastTrade)
                  .map((trade, index) => (
                    <ClosedTrade key={index} index={index} trade={trade} />
                  ))
              )}
            </Tbody>
          </Table>
        </TableContainer>

        <div className="pt-5 flex gap-2 justify-center items-center">
          <a className="font-semibold">Page</a>
          {history[0] === "No data to show" ? (
            <div className="my-5">You have not closed any trades yet</div>
          ) : (
            Array.from({
              length: Math.ceil(history.length / tradesPerPage),
            }).map((_, number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className="px-3 py-1 mx-1 rounded-md bg-slate-200 hover:bg-slate-300"
              >
                {number + 1}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
