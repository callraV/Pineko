"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { Modal, useDisclosure, Text } from "@chakra-ui/react";
import { Table, Thead, Tr, Th, TableContainer } from "@chakra-ui/react";
import { setOpenTrades } from "../redux/open/openSlice";
import { setUser } from "../redux/user/userSlice";
import { Loading } from "../components/Loading/Loading";
import { OpenTrade } from "../components/OpenTrade/OpenTrade";
import { LevelUp } from "../components/LevelUp/LevelUp";
import {
  resetCategory,
  resetCategoryId,
  resetDesc,
} from "../redux/course/courseSlice";
import { CourseCategory } from "../components/CourseCategory/CourseCategory";
import { Portfolio } from "../components/Portfolio/Portfolio";

const Dashboard = () => {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const open_trades = useSelector(
    (state: RootState) => state.open_trades.open_trades
  );
  const {
    isOpen: isLevelUpOpen,
    onOpen: onLevelUpOpen,
    onClose: onLevelUpClose,
  } = useDisclosure();
  const [categories, setCategories] = useState([""]);

  useEffect(() => {
    fetch(`/rewriteapi/trade?user=${user.user_id}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setOpenTrades(data[0]));
      });

    dispatch(resetCategory());
    dispatch(resetCategoryId());
    dispatch(resetDesc());

    fetch(`/rewriteapi/category`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

  useEffect(() => {
    if (user.user_id != 0 && user.experience_points >= user.level * 100) {
      fetch(`/rewriteapi/levelup?user=${user.user_id}`)
        .then((response) => response.json())
        .then((data) => {
          dispatch(setUser(data));
        });
      onLevelUpOpen();
    }
  }, [user]);

  if (user.user_id === 0) {
    return <Loading />;
  }

  return (
    <div className="px-5 pb-28 flex flex-col gap-5 lg:px-20">
      <Modal
        isOpen={isLevelUpOpen}
        onClose={onLevelUpClose}
        size={["xs", "md"]}
      >
        <LevelUp />
      </Modal>

      <div className="md:px-6 ">
        <div className="mx-auto max-w-7xl lg:px-5">
          <Portfolio />
        </div>
      </div>

      <div className="md:mx-5 lg:mx-10">
        <Text className="text-xl font-bold mb-4 mx-5">Open Trades</Text>

        <TableContainer className="overflow-x-auto">
          <Table size={["sm", "md", "md"]}>
            <Thead className="px-2">
              <Tr>
                <Th>Pair</Th>
                <Th>Pos.</Th>
                <Th className="hidden md:table-cell">Open</Th>
                <Th className="hidden md:table-cell">Current</Th>
                <Th>P/L</Th>
                <Th></Th>
              </Tr>
            </Thead>

            <OpenTrade tradeData={open_trades} />
          </Table>
        </TableContainer>
      </div>

      <div className="md:mx-5 lg:mx-10">
        <Text className="text-xl mx-5 mb-4 font-bold text-purple-700">
          Courses
        </Text>
        <div className="flex flex-col gap-4 lg:gap-5">
          {categories.slice(0, 1).map((category: any, index: number) => (
            <CourseCategory
              key={index}
              categoryId={category[0]}
              name={category[1]}
              desc={category[2]}
            />
          ))}
          <a
            onClick={() => push("/course-categories")}
            className="self-end text-sm text-indigo-500 hover:text-indigo-300"
          >
            Browse more courses
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
