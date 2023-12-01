"use client";

import React, { useState, useEffect } from "react";
import { Avatar } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const UserAvatar = (props: any) => {
  const [imageSrc, setImageSrc] = useState("profile/Default_Profile.jpg");
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    fetch(`https://pineko-api.vercel.app/api/profile/image?user=${props.user}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setImageSrc(data);
        }
      });
  }, [user]);

  return (
    <div>
      {imageSrc && (
        <Avatar
          size={props.size}
          src={`data:image/jpeg;base64,${imageSrc}`}
          name={props.username}
        />
      )}
    </div>
  );
};
