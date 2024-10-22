import Image from "next/image";
import { empty } from "@/app/config";
import { useState } from "react";
import {
  ReplyIcon,
  LikeIcon,
  DislikeIcon,
  SendMessageIcon,
} from "@/public/icons/icons";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Input from "@/components/Form/Input/input";

export interface CommentProps {
  id: string | number;
  name: string;
  text: string;
  likes: number;
  dislikes: number;
  replies?: CommentProps[];
}

const Comment: React.FC<CommentProps> = ({
  name,
  text,
  likes,
  dislikes,
  replies,
}) => {
  const [showInput, setShowInput] = useState(false);

  const handleReplyClick = () => {
    setShowInput((prev) => !prev);
  };
  return (
    <div>
      <div className="flex items-center gap-1">
        <div className="flex-shrink-0 relative w-9 h-9 rounded-full bg-neutral-2 overflow-hidden">
          <Image
            src={empty}
            alt="user-real-info-from-props"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-1">
          <p className="text-text-primary dark:text-white text-sm font-medium flex items-center">
            <span className="text-ellipsis line-clamp-1">{name}</span>
            <BadgeIcon color="yellow" />
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
        <p className="flex items-center gap-1">
          <LikeIcon fill="#E15B0F" stroke="#E15B0F" />
          <span className="text-xs font-normal text-[#010A23]">{likes}</span>
        </p>
        <p className="flex items-center gap-1 text-text-disabled">
          <DislikeIcon />
          <span className="text-xs font-normal">{dislikes}</span>
        </p>
      </div>
      {showInput && (
        <div className="mt-6 mb-4 flex items-center justify-between gap-3">
          <Input
            id="message"
            placeholder="Type your message here"
            className="w-full"
            inputClassName="border-none bg-neutral-3"
          />
          <div className="bg-brand-9 p-2 rounded grid place-items-center">
            <span className="text-white">
              <SendMessageIcon />
            </span>
          </div>
        </div>
      )}

      {replies && (
        <>
          <p className="ml-10 my-2 text-neutral-4 text-[10px] font-medium">
            Replies
          </p>
          <div className="relative ml-10 pl-5 border-l border-neutral-300">
            {replies.map((r) => (
              <Comment key={r.id} {...r} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Comment;
