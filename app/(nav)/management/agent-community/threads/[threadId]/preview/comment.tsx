import Image from "next/image";
import { empty } from "@/app/config";
import { useState } from "react";
import {
  ReplyIcon,
  LikeIcon,
  DislikeIcon,
  SendMessageIcon,
} from "@/public/icons/icons";
import BadgeIcon, {
  BadgeIconColors,
  tierColorMap,
} from "@/components/BadgeIcon/badge-icon";
import Input from "@/components/Form/Input/input";
import user1 from "@/public/empty/user1.svg";
import user2 from "@/public/empty/user2.svg";
import user3 from "@/public/empty/user3.svg";
import api from "@/services/api";
import {
  sendMyPropertyRequestCommentReply,
  togglePropertyRequestLike,
  togglePropertyRequestLikeComments,
} from "../../../my-articles/data";
import { toast } from "sonner";
import { ChevronDownIcon, ChevronUpIcon, Loader2 } from "lucide-react";

export interface CommentProps {
  id: string | number;
  name: string;
  image?: string | null;
  tier_id?: number;
  text: string;
  likes: number;
  dislikes: number;
  replies?: CommentProps[];
  slug?: string;
  user_liked?: boolean;
  user_disliked?: boolean;
}

const Comment: React.FC<CommentProps> = ({
  id,
  name,
  text,
  likes,
  dislikes,
  replies,
  image,
  tier_id,
  slug,
  user_liked,
  user_disliked,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [reactionType, setReactionType] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);

  console.log(tier_id)

  const handleReplyClick = () => {
    setShowInput((prev) => !prev);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handlePostReplyComment = async () => {
    if (!slug) {
      return;
    }

    try {
      setIsSending(true);
      await sendMyPropertyRequestCommentReply(slug, content, id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleLike = async (type: string) => {
    try {
      setIsLike(true);
      const res = await togglePropertyRequestLikeComments(id as string, type);
      if (res) {
        setReactionType(type);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLike(false);
    }
  };

  const getBadgeColor = (tier?: number): BadgeIconColors | undefined => {
    if (!tier || tier === 0) return undefined;
    return tierColorMap[tier as keyof typeof tierColorMap] || "blue";
  };

  return (
    <div>
      <div className="flex items-center gap-1">
        <div className="flex-shrink-0 relative w-9 h-9 rounded-full bg-neutral-2 overflow-hidden">
          <Image
            src={image || empty}
            alt="user-real-info-from-props"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-1">
          <p className="text-text-primary dark:text-white text-sm font-medium flex items-center">
            <span className="text-ellipsis line-clamp-1 capitalize">
              {name}
            </span>
            { tier_id && tier_id > 1 && <BadgeIcon color={"gray"} /> }
          </p>
          <p className="text-text-secondary dark:text-darkText-2 text-sm font-medium">
            {text}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 justify-end mt-2">
        <button
          type="button"
          onClick={handleReplyClick}
          className="text-text-quaternary dark:text-darkText-1 flex items-center gap-1"
        >
          <ReplyIcon />
          <span className="text-[10px] font-normal">Reply</span>
        </button>
        <button onClick={() => handleToggleLike("1")} disabled={isLike}>
          <p className="flex items-center gap-1">
            <LikeIcon
              fill={`${user_liked ? "#E15B0F" : ""} `}
              stroke={`${user_liked ? "#E15B0F" : "#000"} `}
            />
            <span className="text-xs font-normal text-[#010A23]">{likes}</span>
          </p>
        </button>
        <button onClick={() => handleToggleLike("-1")} disabled={isLike}>
          <p className="flex items-center gap-1 text-text-disabled">
            <DislikeIcon
              fill={`${user_disliked ? "#E15B0F" : "none"} `}
              stroke={`${user_disliked ? "#E15B0F" : "#000"} `}
            />
            <span className="text-xs font-normal">{dislikes}</span>
          </p>
        </button>
      </div>
      {showInput && (
        <div className="mt-6 mb-4 flex items-center justify-between gap-3">
          <Input
            value={content}
            onChange={(value: string) => setContent(value)}
            id="message"
            placeholder="Type your message here"
            className="w-full"
            inputClassName="border-none bg-neutral-3"
          />
          <button
            onClick={handlePostReplyComment}
            type="button"
            className="bg-brand-9 p-2 rounded grid place-items-center"
            aria-label="send message"
            disabled={isSending}
          >
            <span className="text-white">
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendMessageIcon />
              )}
            </span>
          </button>
        </div>
      )}

      {replies && replies.length > 0 && (
        <>
          <div
            className="flex items-center justify-between ml-10 my-2"
            onClick={handleToggleCollapse}
          >
            <button className="text-neutral-4 text-[10px] font-medium">
              {isCollapsed
                ? `View replies - (${replies.length})`
                : "Hide replies"}
            </button>
            {/* <button
              onClick={handleToggleCollapse}
              className="text-text-quaternary dark:text-darkText-1 flex items-center gap-1"
              aria-label={isCollapsed ? "Expand replies" : "Collapse replies"}
            >
              {isCollapsed ? (
                <>
                  <ChevronDownIcon className="w-4 h-4" />
                  <span className="text-[10px] font-normal">Show</span>
                </>
              ) : (
                <>
                  <ChevronUpIcon className="w-4 h-4" />
                  <span className="text-[10px] font-normal">Hide</span>
                </>
              )}
            </button> */}
          </div>
          {!isCollapsed && (
            <div className="relative ml-10 pl-5 border-l border-neutral-300">
              {replies.map((r) => (
                <Comment key={r.id} {...r} slug={slug} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;
