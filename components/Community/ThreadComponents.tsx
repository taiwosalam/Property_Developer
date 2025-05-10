import { toggleLike } from "@/app/(nav)/management/agent-community/my-articles/data";
import { empty } from "@/app/config";
import {
  CommentIcon,
  ShareIcon,
  ThumbsDown,
  ThumbsUp,
} from "@/public/icons/icons";
import Image from "next/image";
import { useState } from "react";
import ReactPlayer from "react-player";
import { toast } from "sonner";

// ============= THREAD HEADER ======================
export const ThreadHeader = ({
  user_pics,
  name,
  role,
  time,
  published,
  myArticle,
}: {
  user_pics: string;
  name: string;
  role: string;
  time: string;
  published?: boolean;
  myArticle?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="imgWrapper flex gap-2 rounded-full">
        <Image
          src={user_pics || empty}
          alt={name}
          priority
          width={500}
          height={500}
          className="w-10 h-10 object-cover rounded-full bg-brand-9"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1 max-w-[100%]">
              <p className="dark:text-white truncate">{name || "--- ---"}</p>
              {/* <BadgeIcon color="gray" /> */}
            </div>
          </div>
          <p className="text-brand-9 text-sm"> {role || "--- ---"} </p>
        </div>
      </div>
      <div className="time w-[30%] flex gap-1 items-center justify-end flex-col">
        <p className="text-xs text-[#6083ED]"> {time || "--- ---"} </p>
        {myArticle && (
          <div
            className={`flex items-center gap-1 rounded-md text-center w-fit px-3 ${
              published ? "bg-status-success-primary" : "bg-orange-normal"
            }`}
          >
            <span className="text-xs text-white text-center">
              {published ? "Active" : "Inactive"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// =============== THREAD BODY ======================
export const ThreadBody = ({
  title,
  picture_url,
  desc,
  video,
}: {
  title: string;
  picture_url: string;
  desc: string;
  video: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-black text-5 dark:text-white leading-5 truncate font-bold mt-4">
        {title}
      </h2>
      <div
        className="text-sm line-clamp-3 max-h-[3lh]"
        dangerouslySetInnerHTML={{ __html: desc || "--- ---" }}
      />
      {video ? (
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
        <div className="imagWrapper overflow-hidden max-h-[195px]">
          <Image
            src={picture_url || empty}
            alt="Thread"
            priority
            width={300}
            height={300}
            className="w-full h-[195px] object-cover"
          />
        </div>
      )}
    </div>
  );
};

// =============== THREAD FOOTER ===========================

export const ThreadFooter = ({
  comments,
  likes,
  dislikes,
  slug,
  shareLink,
  setIsLikeDislikeLoading,
}: {
  comments: string;
  likes: string;
  dislikes: string;
  slug: string;
  shareLink: string;
  setIsLikeDislikeLoading?: (value: boolean) => void;
}) => {
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading || userAction === "like") return;
    setIsLoading(true);
    setIsLikeDislikeLoading?.(true);

    try {
      await toggleLike(slug, 1);
      setUserAction("like");
      window.dispatchEvent(new Event("refetchThreads"));
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
      setIsLikeDislikeLoading?.(false);
    }
  };

  const handleDislike = async () => {
    if (isLoading || userAction === "dislike") return;
    setIsLoading(true);
    setIsLikeDislikeLoading?.(true);

    try {
      await toggleLike(slug, -1);
      setUserAction("dislike");
      window.dispatchEvent(new Event("refetchThreads"));
    } catch (error) {
      console.error("Error toggling dislike:", error);
    } finally {
      setIsLoading(false);
      setIsLikeDislikeLoading?.(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share Thread",
          url: shareLink,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareLink);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-between mt-2">
      <div className="like-dislike flex gap-2">
        <button
          className={`flex items-center gap-1 ${
            userAction === "like" ? "text-blue-500" : ""
          }`}
          onClick={handleLike}
          disabled={isLoading}
        >
          <ThumbsUp />
          <p>{likes}</p>
        </button>
        <button
          className={`flex items-center gap-1 ${
            userAction === "dislike" ? "text-red-500" : ""
          }`}
          onClick={handleDislike}
          disabled={isLoading}
        >
          <ThumbsDown />
          <p>{dislikes}</p>
        </button>
      </div>

      <button className="flex items-center gap-2">
        <CommentIcon />
        <span className="text-sm dark:text:darkText-1">
          {comments} Comments
        </span>
      </button>

      <button className="flex items-center gap-1" onClick={handleShare}>
        <ShareIcon />
        <span>share</span>
      </button>
    </div>
  );
};
