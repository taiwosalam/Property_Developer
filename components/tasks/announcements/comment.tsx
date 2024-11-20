import Image from "next/image";
import { empty } from "@/app/config";
import { useState } from "react";
import {
  ReplyIcon,
  LikeIcon,
  DislikeIcon,
  SendMessageIcon,
  ThumbsDown,
  ThumbsUp,
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
  commenting?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  showInput?: boolean;
  setShowInput?: (show: boolean) => void;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface CommentHandlers {
  handleLike: (id: string | number) => void;
  handleDislike: (id: string | number) => void;
  replying?: boolean;
}

const Comment: React.FC<CommentProps & CommentHandlers> = ({
  id,
  name,
  text,
  likes,
  dislikes,
  replies,
  onSubmit,
  commenting,
  showInput: propShowInput,
  setShowInput: propSetShowInput,
  handleLike,
  handleDislike,
  
}) => {
  const [localShowInput, setLocalShowInput] = useState(false);
  const [localCommenting, setLocalCommenting] = useState(false);
  const [localCommentId, setLocalCommentId] = useState<number>(0);
  
  const showInput = propShowInput ?? localShowInput;
  const setShowInput = propSetShowInput ?? setLocalShowInput;

  const handleReplyClick = (id: string | number) => {
    setShowInput(!showInput);
    setLocalCommenting(true);
    setLocalCommentId(Number(id));
  };
  
  if (!name && !text) {
    return (
      <div>
        <p className="text-text-secondary dark:text-darkText-2 text-sm font-medium mb-4">
          Be the first to comment
        </p>
        <form onSubmit={onSubmit} className="flex items-center justify-between gap-3">
          <Input
            id="message"
            name="message"
            placeholder="Type your message here"
            className="w-full"
            inputClassName="border-none bg-neutral-3"
          />
          <button
            type="submit"
            className="bg-brand-9 p-2 rounded grid place-items-center"
            aria-label="send message"
          >
            {commenting ? <span className="text-white"> ... </span> 
              : <span className="text-white"><SendMessageIcon /></span>
            }
          </button>
        </form>
      </div>
    );
  }

  return (
    <div data-comment-id={id}>
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
          onClick={() => handleReplyClick(id)}
          className="text-text-quaternary dark:text-darkText-1 flex items-center gap-1"
        >
          <ReplyIcon />
          <span className="text-[10px] font-normal">Reply</span>
        </button>
        <button className="flex items-center gap-1" onClick={() => handleLike(id)}>
          <ThumbsUp />
          <span className="text-xs font-normal text-[#010A23]">{likes}</span>
        </button>
        <button className="flex items-center gap-1 text-text-disabled" onClick={() => handleDislike(id)}>
          <ThumbsDown />
          <span className="text-xs font-normal">{dislikes}</span>
        </button>
      </div>
      {showInput && (
        <div className="mt-6 mb-4 flex items-center justify-between gap-3">
          <Input
            id={localCommenting ? `${id}` : `comment-${id}`}
            name={localCommenting ? "reply" : "message"}
            placeholder={localCommenting ? "Type your reply here" : "Type your message here"}
            className="w-full"
            inputClassName="border-none bg-neutral-3"
          />
          <button
            type="submit"
            className="bg-brand-9 p-2 rounded grid place-items-center"
            aria-label="send message"
          >
            {localCommenting ? (
              <span className="text-white">
               <SendMessageIcon />
             </span>
            ) : (
              <span className="text-white">
                <SendMessageIcon />
              </span>
            )}
          </button>
        </div>
      )}

      {replies && replies.length > 0 && (
        <>
          <p className="ml-10 my-2 text-neutral-4 text-[10px] font-medium">
            Replies
          </p>
          <div className="relative ml-10 pl-5 border-l border-neutral-300">
            {replies.map((r) => (
              <Comment 
                key={r.id} 
                {...r} 
                handleLike={handleLike} 
                handleDislike={handleDislike} 
                replying={true} 
                id={id} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Comment;
