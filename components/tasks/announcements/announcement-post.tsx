import CommentsSection from "./comments-section";
import { LikeIcon, DislikeIcon } from "@/public/icons/icons";
import Image from "next/image";
import clsx from "clsx";
import { CommentProps, IAnnounceUserSummary } from "@/app/(nav)/tasks/announcements/[announcementId]/preview/data";
import { Comment } from "@/app/(nav)/tasks/announcements/types";
import { CommentData } from "./comment";
import PropertyRequestComments from "@/components/Community/PropertyRequestComments";
import { useState } from "react";
import ThreadComments from "@/components/Community/ThreadComments";

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
    viewers: IAnnounceUserSummary[];
    comments: CommentProps[];
  };
}
const AnnouncementPost = ({ data }: AnnouncementPostProps) => {
  // Limit to first 3 images
  const maxImagesToShow = 3;
  const excessImagesCount = images.length - maxImagesToShow;
  const [comment, setComment] = useState<any>([]);

  return (
    <div>
      <div className="space-y-8">
        <div
          className="text-sm font-medium text-text-secondary dark:text-darkText-2"
          dangerouslySetInnerHTML={{ __html: data?.description || "" }}
        />

        <div className="text-text-quaternary flex items-center gap-4 w-fit ml-auto">
          <p className="flex items-center gap-1">
            <LikeIcon />
            <span className="text-xs font-normal">{data?.likes}</span>
          </p>
          <p className="flex items-center gap-1">
            <DislikeIcon />
            <span className="text-xs font-normal">{data?.dislikes}</span>
          </p>
          <div className="flex items-center">
            {images.slice(0, maxImagesToShow).map((i, index) => (
              <Image
                key={index}
                src={i}
                alt="image"
                width={24}
                height={24}
                className={clsx(
                  "w-6 h-6 border border-highlight rounded-full object-cover",
                  index !== 0 && "-ml-3"
                )}
                style={{ zIndex: index }} // Control stacking
              />
            ))}
            {excessImagesCount > 0 && (
              <div className="bg-highlight h-6 pl-[14px] pr-[10px] -ml-3 rounded-[24px] text-[10px] text-text-invert font-semibold flex items-center justify-end">
                +{excessImagesCount}
              </div>
            )}
          </div>
        </div>
      </div>
      <PropertyRequestComments
        id={"17"}
        slug={"my-slug"}
        comments={data?.comments || []}
        setComments={setComment}
      />
       <ThreadComments comments={data?.comments || []} />
      {/* <CommentsSection comments={data?.comments || []} /> */}
    </div>
  );
};

export default AnnouncementPost;
