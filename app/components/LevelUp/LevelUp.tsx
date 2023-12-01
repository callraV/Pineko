"use client";

import React, { useEffect } from "react";
import Confetti from "react-confetti";
import useSound from "use-sound";
import levelUpSound from "../../../public/sounds/dumdaradum.mp3";
import { useRouter } from "next/navigation";
import {
  Image,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";

export const LevelUp = () => {
  const [playSound] = useSound(levelUpSound);
  const { push } = useRouter();

  useEffect(() => {
    playSound();
  }, []);

  return (
    <>
      <Confetti width={screen.width} height={screen.height} />
      <ModalOverlay />

      <ModalContent>
        <ModalCloseButton />

        <ModalBody>
          <div className="flex flex-col gap-5 text-5xl font-bold mt-10">
            <Image src="asset/LevelUp.png" borderRadius="lg" className="mx-5" />
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-center">
          <button
            onClick={() => push("/profile")}
            className="mb-3 flex mx-auto justify-center rounded-lg bg-yellow-400 py-3 px-5 text-md font-semibold text-yellow-700 shadow-sm hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Check your points
          </button>
        </ModalFooter>
      </ModalContent>
    </>
  );
};
