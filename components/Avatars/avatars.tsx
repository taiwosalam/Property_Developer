"use client";

import React, { useEffect, useState } from "react";

// Types
import type { AvatarsProps } from "./types";

// Imports
import { empty } from "@/app/config";
import { getAvatarsList } from "./data";
import Picture from "../Picture/picture";
import { useAuthStore } from "@/store/authstrore";

const Avatars: React.FC<AvatarsProps> = ({ type, onClick }) => {
  const size = 40;
  const max_size = 5;

  const accessToken = useAuthStore((state) => state.access_token);

  const [avatars, setAvatars] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = await getAvatarsList(type, accessToken);

      setAvatars(data);
    };

    fetchAvatars();
  }, [type, accessToken]);

  return (
    <div className="flex gap-2">
      {avatars
        ? avatars.slice(0, max_size).map((avatar, idx) => (
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
        : Array(5)
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
