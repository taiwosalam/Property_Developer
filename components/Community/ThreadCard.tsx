import Image from "next/image";
import Link from "next/link";
import BadgeIcon, {
  badgeIconColors,
  BadgeIconColors,
} from "../BadgeIcon/badge-icon";
import { ThreadCardProps } from "@/app/(nav)/tasks/agent-community/type";
import {
  CommentIcon,
  ShareIcon,
  ThumbsDown,
  ThumbsUp,
} from "@/public/icons/icons";
import { toggleLike } from "@/app/(nav)/tasks/agent-community/my-articles/data";
import { empty } from "@/app/config";
import { useState } from "react";
import { toast } from "sonner";

const link = "/tasks/agent-community/";

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
}: ThreadCardProps) => {
  return (
    <div className="bg-white dark:bg-darkText-primary rounded-lg p-4 shadow-md">
      <Link
        href={`${link}${myArticle ? "my-articles" : "threads"}/${slug}/preview`}
      >
        <ThreadHeader
          user_pics={user_pics}
          name={name}
          role={role}
          time={time}
        />
        <ThreadBody title={title} picture_url={picture_url} desc={desc} />
      </Link>
      <ThreadFooter comments={comments} likes={likes} dislikes={dislikes} slug={slug} shareLink={shareLink} />
    </div>
  );
};

export default ThreadCard;

const ThreadHeader = ({
  user_pics,
  name,
  role,
  time,
}: {
  user_pics: string;
  name: string;
  role: string;
  time: string;
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="imgWrapper flex gap-2 rounded-full">
        <Image
          src={user_pics || empty}
          alt={name}
          priority
          width={20}
          height={20}
          className="w-10 h-10 object-cover"
        />
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <p className="dark:text-white flex items-center gap-1">
              {name || 'username'}
              <BadgeIcon color="gray" />
            </p>
          </div>
          <p className="text-brand-9 text-sm"> {role || 'role'} </p>
        </div>
      </div>
      <div className="time">
        <p className="text-sm text-[#6083ED]"> {time} </p>
      </div>
    </div>
  );
};

const ThreadBody = ({
  title,
  picture_url,
  desc,
}: {
  title: string;
  picture_url: string;
  desc: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-black text-5 dark:text-white leading-5 truncate font-bold mt-4">
        {title}
      </h2>
      <div 
        className="text-sm line-clamp-3"
        dangerouslySetInnerHTML={{ __html: desc }}
      />
      <div className="imagWrapper">
        <Image
          src={picture_url || empty}
          alt="Thread"
          priority
          width={200}
          height={200}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

const ThreadFooter = ({ comments, likes, dislikes, slug, shareLink }: { comments: string, likes: string, dislikes: string, slug: string, shareLink: string }) => {
  const [likeCount, setLikeCount] = useState(likes ? parseInt(likes) : 0);
  const [dislikeCount, setDislikeCount] = useState(dislikes ? parseInt(dislikes) : 0);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading || userAction === 'like') return;
    setIsLoading(true);
    
    try {
      await toggleLike(slug, 1);
      if (userAction === 'dislike') {
        setDislikeCount(prev => prev - 1);
      }
      setLikeCount(prev => prev + 1);
      setUserAction('like');
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async () => {
    if (isLoading || userAction === 'dislike') return;
    setIsLoading(true);

    try { 
      await toggleLike(slug, -1);
      if (userAction === 'like') {
        setLikeCount(prev => prev - 1);
      }
      setDislikeCount(prev => prev + 1);
      setUserAction('dislike');
    } catch (error) {
      console.error('Error toggling dislike:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Share Thread',
          url: shareLink
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareLink);
        // You might want to add a toast notification here
        toast.success('Link copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="flex items-center justify-between mt-2">
      <div className="like-dislike flex gap-2">
        <button 
          className={`flex items-center gap-1 ${userAction === 'like' ? 'text-blue-500' : ''}`} 
          onClick={handleLike}
          disabled={isLoading}
        >
          <ThumbsUp />
          <p>{likeCount}</p>
        </button>
        <button 
          className={`flex items-center gap-1 ${userAction === 'dislike' ? 'text-red-500' : ''}`} 
          onClick={handleDislike}
          disabled={isLoading}
        >
          <ThumbsDown />
          <p>{dislikeCount}</p>
        </button>
      </div>

      <button className="flex items-center gap-2">
        <CommentIcon />
        <span className="text-sm dark:text:darkText-1">{comments}</span>
      </button>

      <button className="flex items-center gap-1" onClick={handleShare}>
        <ShareIcon />
        <span>share</span>
      </button>
    </div>
  );
};

export const ThreadSkeleton = () => {
  return (
    <div className="bg-white dark:bg-darkText-primary rounded-lg p-4 shadow-md animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="flex flex-col gap-2">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* Body Skeleton */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
      </div>

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-4">
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
};