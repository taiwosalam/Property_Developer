"use client";
import { empty } from "@/app/config";
import Image from "next/image";
import {
  BlueEyeShowIcon,
  LikeIcon,
  DislikeIcon,
  CameraIcon,
  VideoIcon,
} from "@/public/icons/icons";
import Button from "@/components/Form/Button/button";

interface AnnouncementCardProps {
  title: string;
  description: string;
  id: string;
  date: string;
  views: number;
  newViews: number;
  likes?: number;
  dislikes: number;
  imageUrls: string[];
  mediaCount: number;
  announcementId: string;
  viewOnly?: boolean;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  title,
  description,
  id,
  date,
  views,
  newViews,
  likes,
  dislikes,
  imageUrls,
  mediaCount,
  announcementId,
  viewOnly,
}) => {
  return (
    <div
      className="bg-white dark:bg-darkText-primary rounded-lg"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="relative rounded-t-lg w-full h-[170px] overflow-hidden">
        {imageUrls &&
          imageUrls.map((url, index) => (
            <Image
              key={index}
              src={url || empty}
              alt="sample"
              fill
              sizes="auto"
              priority={index === 0}
              className="object-cover object-center"
            />
          ))}
        <div className="flex items-stretch gap-[10px] absolute z-[2] right-2 bottom-2">
          <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 grid place-items-center">
            <VideoIcon />
          </div>
          <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1.5">
            <CameraIcon />
            <p className="text-black dark:text-darkText-1 font-medium text-[10px]">
              +{mediaCount}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 font-medium">
        <p className="mb-1 text-black dark:text-white text-base">{title}</p>
        <p className="mb-2 text-xs text-text-tertiary dark:text-darkText-2 line-clamp-3 text-ellipsis">
          {description}
        </p>
        <div className="mb-2 flex items-center justify-between text-sm">
          <p className="text-text-label dark:text-darkText-1">ID: {id}</p>
          <p className="text-neutral-4">{date}</p>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <p className="flex items-center gap-1 text-brand-9">
            <BlueEyeShowIcon />
            <span className="text-sm text-[#0033C4]">
              {views} (+{newViews} today)
            </span>
          </p>
          <p className="flex items-center gap-1 text-text-disabled">
            <LikeIcon />
            <span className="text-xs font-normal">{likes}</span>
          </p>
          <p className="flex items-center gap-1 text-text-disabled">
            <DislikeIcon />
            <span className="text-xs font-normal">{dislikes}</span>
          </p>
        </div>
        {!viewOnly && (
          <Button
            href={`/tasks/announcements/${announcementId}/preview`}
            size="xs_normal"
            className="w-fit ml-auto py-2 px-4"
          >
            Preview
          </Button>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCard;
