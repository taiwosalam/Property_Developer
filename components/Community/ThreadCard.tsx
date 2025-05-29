"use client";

import Link from "next/link";
import { ThreadCardProps } from "@/app/(nav)/community/agent-forum/type";
import { ThreadBody, ThreadFooter, ThreadHeader } from "./ThreadComponents";

const ThreadCard = ({
  name,
  picture_url,
  role,
  user_pics,
  title,
  desc,
  time,
  comments,
  myArticle,
  id,
  likes,
  dislikes,
  slug,
  shareLink,
  video,
  published,
  setIsLikeDislikeLoading,
  user_liked,
  user_disliked,
  badge_color,
  isVerified,
}: ThreadCardProps) => {
  const link = `/community/agent-forum/${
    myArticle ? "my-articles" : "threads"
  }/${slug}/preview?id=${id}`;
  return (
    <div className="bg-white dark:bg-darkText-primary rounded-lg p-4 shadow-md flex flex-col h-full">
      <Link href={link} className="flex-1">
        <ThreadHeader
          user_pics={user_pics}
          name={name}
          role={role}
          time={time}
          published={published}
          myArticle={myArticle}
          badge_color={badge_color}
          isVerified={isVerified}
        />
        <ThreadBody
          title={title}
          picture_url={picture_url}
          desc={desc}
          video={video}
        />
      </Link>
      <ThreadFooter
        comments={comments}
        likes={likes}
        dislikes={dislikes}
        slug={slug}
        shareLink={link}
        setIsLikeDislikeLoading={setIsLikeDislikeLoading}
        user_liked={user_liked}
        user_disliked={user_disliked}
      />
    </div>
  );
};

export default ThreadCard;
