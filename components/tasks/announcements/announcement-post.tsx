import CommentsSection from "./comments-section";
import { LikeIcon, DislikeIcon } from "@/public/icons/icons";
import Image from "next/image";
import clsx from "clsx";
import {
  CommentProps,
  IAnnounceUserSummary,
  toggleAnnouncementLike,
} from "@/app/(nav)/tasks/announcements/[announcementId]/preview/data";
import { Comment } from "@/app/(nav)/tasks/announcements/types";
import { CommentData } from "./comment";
import PropertyRequestComments from "@/components/Community/PropertyRequestComments";
import { useState } from "react";
import ThreadComments from "@/components/Community/ThreadComments";
import { empty } from "@/app/config";
import data from "@/app/(nav)/reports/landlord/page";
import { useParams } from "next/navigation";
import AnnouncementComment from "./accouncement-comments";
import AnnouncementThread from "./announcement-thread";

const images = [
  "/empty/SampleProperty.jpeg",
  "/empty/SampleProperty2.jpeg",
  "/empty/SampleProperty3.jpeg",
  "/empty/SampleProperty4.png",
  "/empty/SampleProperty5.jpg",
  "/empty/SampleProperty6.jpg",
];

interface AnnouncementPostProps {
  data?: {
    description: string;
    likes: number;
    dislikes: number;
    viewers: (string | null)[];
    comments: CommentProps[];
    my_like: boolean;
    my_dislike: boolean;
  };
}

const maxImagesToShow = 3;

const AnnouncementPost = ({ data }: AnnouncementPostProps) => {
  const [comment, setComment] = useState<any>([]);
  const [isLike, setIsLike] = useState(false);

  const { announcementId } = useParams();
  const paramId = announcementId as string;

  // Get unique, non-null user images from comments
  const uniqueUserImages = Array.from(
    new Map(
      (data?.comments || [])
        .filter((comment) => comment.image != null) // Exclude null or undefined images
        .map((comment) => [comment.image, comment.image as string]) // Map to [image, image] pairs
    ).values()
  ).slice(0, maxImagesToShow);

  const uniqueCommenterCount = new Set(
    (data?.comments || [])
      .filter((comment) => comment.image != null)
      .map((comment) => comment.image)
  ).size;

  const excessImagesCount = Math.max(uniqueCommenterCount - maxImagesToShow, 0);

  const handleToggleLike = async (type: string) => {
    try {
      setIsLike(true);
      await toggleAnnouncementLike(paramId, type);
    } catch (error) {
    } finally {
      setIsLike(false);
    }
  };

  return (
    <div>
      <div className="space-y-8">
        <div
          className="text-sm font-medium text-text-secondary dark:text-darkText-2"
          dangerouslySetInnerHTML={{ __html: data?.description || "" }}
        />

        <div className="text-text-quaternary flex items-center gap-4 w-fit ml-auto">
          <button
            disabled={isLike}
            className="flex items-center gap-1"
            onClick={() => handleToggleLike("1")}
          >
            <LikeIcon
              fill={`${data?.my_like ? "#E15B0F" : ""} `}
              stroke={`${data?.my_like ? "#E15B0F" : "#000"} `}
            />
            <p>{data?.likes}</p>
          </button>
          <button
            disabled={isLike}
            className="flex items-center gap-1"
            onClick={() => handleToggleLike("-1")}
          >
            <DislikeIcon
              fill={`${data?.my_dislike ? "#E15B0F" : "none"} `}
              stroke={`${data?.my_dislike ? "#E15B0F" : "#000"} `}
            />
            <p>{data?.dislikes}</p>
          </button>
          {data && data.viewers.length > 0 && (
            <div className="flex items-center">
              {uniqueUserImages.map((image, index) => (
                <Image
                  key={index}
                  src={image || empty}
                  alt="user avatar"
                  width={24}
                  height={24}
                  className={clsx(
                    "w-6 h-6 border border-brand-9 rounded-full object-cover",
                    index !== 0 && "-ml-3"
                  )}
                  style={{ zIndex: index }} // control stacking
                />
              ))}
              {excessImagesCount > 0 && (
                <div className="bg-brand-9 h-6 pl-[14px] pr-[10px] -ml-3 rounded-[24px] text-[10px] text-text-invert font-semibold flex items-center justify-end">
                  +{excessImagesCount}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <AnnouncementComment
        id={announcementId as string}
        slug={`/announcements/${announcementId}/comment`}
        comments={data?.comments || []}
        setComments={setComment}
      />
      <AnnouncementThread comments={data?.comments || []} />
      {/* <CommentsSection comments={data?.comments || []} /> */}
    </div>
  );
};

export default AnnouncementPost;
