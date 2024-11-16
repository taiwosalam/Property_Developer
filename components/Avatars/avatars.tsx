// "use client";

// import { useEffect, useState } from "react";

// Types
import type { AvatarsProps } from "./types";

// Imports
// import { empty } from "@/app/config";
import {  avatarLinks } from "./data";
import Picture from "../Picture/picture";
import useWindowWidth from "@/hooks/useWindowWidth";

const Avatars: React.FC<AvatarsProps> = ({ onClick, maxNumber = 200 }) => {
  const { isMobile } = useWindowWidth();
  // const [avatars, setAvatars] = useState<string[] | null>(null);

  // useEffect(() => {
  //   const fetchAvatars = async () => {
  //     const data = await getAvatarsList();
  //     setAvatars(data);
  //   };
  //   fetchAvatars();
  // }, []);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-10">
      {/* {avatars
        ? avatars.slice(0, maxNumber).map((avatar, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => {
                onClick?.(avatar);
              }}
              className="w-fit mx-auto"
            >
              <Picture
                rounded
                size={isMobile ? 70 : 110}
                alt="avatar"
                src={avatar}
              />
            </button>
          ))
        : Array(maxNumber)
            .fill(null)
            .map((_, idx) => (
              <Picture
                rounded
                key={idx}
                alt="empty"
                src={empty}
                size={isMobile ? 70 : 110}
                className="skeleton-elem mx-auto"
              />
            ))} */}
      {avatarLinks.map((avatar, idx) => (
        <button
          type="button"
              key={idx}
              onClick={() => {
                onClick?.(avatar);
              }}
              className="w-fit mx-auto"
            >
              <Picture
                rounded
                size={isMobile ? 70 : 110}
                alt="avatar"
                src={avatar}
              />
        </button>
      ))}
    </div>
  );
};

export default Avatars;
