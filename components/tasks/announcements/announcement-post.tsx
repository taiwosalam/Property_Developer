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
const AnnouncementPost = ({ data }: AnnouncementPostProps) => {
  // Limit to first 3 images
  const maxImagesToShow = 3;
  const excessImagesCount = (data?.viewers?.length ?? 0) - maxImagesToShow;
  const [comment, setComment] = useState<any>([]);
  const [isLike, setIsLike] = useState(false);

  const { announcementId } = useParams();
  const paramId = announcementId as string;

  const handleToggleLike = async (type: string) => {
    try {
      setIsLike(true);
      await toggleAnnouncementLike(paramId, type);
    } catch (error) {
      console.log(error);
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
              {data?.viewers.slice(0, maxImagesToShow).map((i, index) => (
                <Image
                  key={index}
                  src={i || empty}
                  alt="image"
                  width={24}
                  height={24}
                  className={clsx(
                    "w-6 h-6 border border-brand-9 rounded-full object-cover",
                    index !== 0 && "-ml-3"
                  )}
                  style={{ zIndex: index }} // Control stacking
                />
              ))}
              {data?.viewers.length > 0 && (
                <div className="bg-brand-9 h-6 pl-[14px] pr-[10px] -ml-3 rounded-[24px] text-[10px] text-text-invert font-semibold flex items-center justify-end">
                  +{Math.min(data.viewers.length, maxImagesToShow)}
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
