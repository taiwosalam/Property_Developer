"use client";

import { useEffect, useState } from "react";

// Types
import type { AvatarsProps } from "./types";

// Imports
import { empty } from "@/app/config";
import { getAvatarsList } from "./data";
import Picture from "../Picture/picture";

const 
Avatars: React.FC<AvatarsProps> = ({
  type,
  onClick,
  size = 40,
  maxSize = 5,
}) => {
  const [avatars, setAvatars] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = await getAvatarsList(type, "");

      setAvatars(data);
    };

    fetchAvatars();
  }, [type]);

  return (
    <div className="flex gap-2 flex-wrap">
      {avatars
        ? avatars.slice(0, maxSize).map((avatar, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => {
                onClick && onClick(avatar);
              }}
            >
              <Picture
                rounded
                size={size}
                alt="avatar"
                src={avatar}
                resolutionMultiplier={3}
              />
            </button>
          ))
        : Array(maxSize)
            .fill(null)
            .map((_, idx) => (
              <Picture
                rounded
                key={idx}
                alt="empty"
                src={empty}
                size={size}
                className="skeleton-elem"
              />
            ))}
    </div>
  );
};

export default Avatars;
