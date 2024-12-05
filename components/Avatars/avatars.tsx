"use client";
import { useState, useEffect } from "react";

// Types
import type { AvatarsProps } from "./types";
import Skeleton from "@mui/material/Skeleton";
import { branchAvatarLinks, getAvatarLinks } from "./data";
import Picture from "../Picture/picture";
import useWindowWidth from "@/hooks/useWindowWidth";

const Avatars: React.FC<AvatarsProps> = ({
  onClick,
  maxNumber = 200,
  branch,
}) => {
  const { isMobile } = useWindowWidth();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<
    ({ id: string; image_url: string } | string)[]
  >([]);

  useEffect(() => {
    const fetchAvatarLinks = async () => {
      setLoading(true);
      if (branch) {
        setLinks(branchAvatarLinks);
      } else {
        const fetchedLinks = await getAvatarLinks();
        setLinks(fetchedLinks);
      }
      setLoading(false);
    };
    fetchAvatarLinks();
  }, []);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-10">
      {loading
        ? Array.from({ length: maxNumber }).map((_, idx) => (
            <Skeleton
              key={idx}
              variant="circular"
              width={isMobile ? 70 : 110}
              height={isMobile ? 70 : 110}
              animation="wave"
            />
          ))
        : links.slice(0, maxNumber).map((avatar, idx) => (
            <button
              type="button"
              key={typeof avatar === "string" ? idx : avatar.id}
              onClick={() => {
                onClick?.(
                  typeof avatar === "string" ? avatar : avatar.image_url
                );
              }}
              className="w-fit mx-auto"
            >
              <Picture
                rounded
                size={isMobile ? 70 : 110}
                alt="avatar"
                src={typeof avatar === "string" ? avatar : avatar.image_url}
              />
            </button>
          ))}
    </div>
  );
};

export default Avatars;
