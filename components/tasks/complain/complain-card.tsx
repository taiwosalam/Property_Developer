"use client";
import { empty } from "@/app/config";
import Image, { StaticImageData } from "next/image";
import {
  BlueEyeShowIcon,
  LikeIcon,
  DislikeIcon,
  CameraIcon,
  VideoIcon,
} from "@/public/icons/icons";
import Button from "@/components/Form/Button/button";
import Cookies from "js-cookie";
import { useRole } from "@/hooks/roleContext";
import { postLikeOrDislike } from "@/components/PAGES/DIRECTOR/PropertyManager/variantA/tasks/announcements/data";
import { toast } from "sonner";
import { useState } from "react";

import ReactPlayer from "react-player";
import { usePermission } from "@/hooks/getPermission";

interface ComplainCardProps {
  title: string;
  description: string;
  poster?: string;
  id: string;
  date: string;
  video: string | null;
  imageUrls:
  | {
    id: number;
    url: string;
    is_default: number;
  }[]
  | string[];
  mediaCount: {
    image: number;
    video: number;
  };
  complainId: string;
  viewOnly?: boolean;
}

const ComplainCard: React.FC<ComplainCardProps> = ({
  title,
  description,
  id,
  date,
  imageUrls,
  mediaCount,
  complainId,
  viewOnly,
  video,
  poster,
}) => {
  const { role, setRole } = useRole();
  const canCreateAndManageAnnouncements = usePermission(
    role,
    "Can create examine"
  );

  const path =
    role === "director"
      ? ""
      : role === "account"
        ? "/accountant"
        : role === "manager"
          ? "/manager"
          : role === "staff"
            ? "/staff"
            : "";

  return (
    <div
      className="bg-white dark:bg-darkText-primary rounded-lg"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="relative rounded-t-lg w-full h-[170px] overflow-hidden">
        {video && imageUrls && imageUrls.length === 0 ? (
          <div className="imagWrapper overflow-hidden max-h-[195px]">
            <ReactPlayer
              url={video}
              width="100%"
              height="195px"
              controls
              className="object-cover"
            />
          </div>
        ) : (
          <Image
            src={
              imageUrls.length
                ? typeof imageUrls[0] === "string"
                  ? imageUrls[0]
                  : imageUrls[0]?.url
                : empty
            }
            alt="sample"
            fill
            sizes="auto"
            className="object-cover object-center"
          />
        )}

        <div className="flex items-stretch gap-[10px] absolute z-[2] right-2 bottom-2">
          {mediaCount.video !== 0 && (
            <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 grid place-items-center">
              <VideoIcon />
            </div>
          )}
          {mediaCount.image !== 0 && (
            <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1.5">
              <CameraIcon />

              <p className="text-black dark:text-darkText-1 font-medium text-[10px]">
                +{mediaCount.image}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 font-medium">
        <p className="mb-1 text-black dark:text-white text-base first-letter:uppercase">
          {title}
        </p>
        <div
          className="mb-2 text-xs text-text-tertiary dark:text-darkText-2 line-clamp-2 text-ellipsis first-letter:uppercase"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        <div className="mb-2 flex items-center justify-between text-sm">
          <p className="text-text-label dark:text-darkText-1">
            ID: {complainId}
          </p>
          <p className="text-neutral-4">{date}</p>
        </div>
        {/* <div className="mb-3 flex items-center gap-2"></div> */}
        {!viewOnly && (
          <Button
            href={`${path}/tasks/complain/${complainId}/preview`}
            size="xs_normal"
            className="w-fit ml-auto py-2 px-4"
          >
            More Details
          </Button>
        )}
      </div>
    </div>
  );
};

export default ComplainCard;
