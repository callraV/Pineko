"use client";

import React from "react";
import {
  Text,
  Heading,
  Avatar,
  Progress,
  Button,
  useDisclosure,
  Modal,
} from "@chakra-ui/react";
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { EditProfile } from "../components/EditProfile";
import { Loading } from "../components/Loading";
import { Badge } from "../components/Badge";

const Profile = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const {
    isOpen: isProfileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure();

  // Conditional rendering
  if (user.user_id === 0) {
    return <Loading />;
  }

  return (
    <div className="mx-5 flex flex-col gap-5 py-10 mb-16 lg:px-10 lg:mx-10">
      <div className="mx-auto w-11/12">
        <div className="flex gap-3">
          <Avatar size="lg" name={user.username} src={user.profile_pic_url} />
          <div className="flex flex-col gap-1.5">
            <Heading size="lg">{user.username}</Heading>
            <Text className="text-slate-400">lv. {user.level}</Text>
          </div>
        </div>

        <div className="mt-2 ml-16">
          <Button
            colorScheme="gray"
            size="sm"
            variant="outline"
            onClick={onProfileOpen}
            ml="2"
          >
            Edit profile
          </Button>
        </div>

        <div className="my-5">
          <div className="grid grid-cols-10">
            <Text className="text-xs text-slate-500 place-self-center lg:text-sm">
              {user.experience_points}
            </Text>
            <Progress
              hasStripe
              isAnimated
              value={user.experience_points - (user.level - 1) * 100}
              colorScheme="yellow"
              className="rounded-md my-1.5 col-span-8 lg:col-span-8"
            />
            <Text className="text-xs text-slate-500 place-self-center lg:text-sm">
              {user.level * 100}
            </Text>
          </div>
          <div className="flex justify-center">
            <Text className="text-sm text-slate-400 mx-auto">
              {(
                100 -
                (user.experience_points - (user.level - 1) * 100)
              ).toFixed(2)}{" "}
              more points to level {user.level + 1}!
            </Text>
          </div>
        </div>
      </div>

      <Modal isOpen={isProfileOpen} onClose={onProfileClose} size="sm">
        <EditProfile />
      </Modal>

      <Badge />
    </div>
  );
};

export default Profile;
