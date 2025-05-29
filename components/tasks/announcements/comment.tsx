// "use client";
// import Image from "next/image";
// import { empty } from "@/app/config";
// import { useEffect, useState } from "react";
// import {
//   ReplyIcon,
//   SendMessageIcon,
//   ThumbsDown,
//   ThumbsUp,
// } from "@/public/icons/icons";
// import BadgeIcon, { tierColorMap } from "@/components/BadgeIcon/badge-icon";
// import Input from "@/components/Form/Input/input";
// import { Loader2 } from "lucide-react";
// import { toggleCommentLike } from "@/app/(nav)/management/agent-community/my-articles/data";
// import { CommentTextArea } from "@/app/(nav)/management/agent-community/NewComment";

// // Base comment data structure
// export interface CommentData {
//   id: string | number;
//   name: string;
//   text: string;
//   likes: number;
//   dislikes: number;
//   replies?: CommentData[];
//   commentsCount: number;
//   profile_picture: string;
//   parentId?: string | number;
// }

// // Handler functions interface
// interface CommentHandlers {
//   handleLike: (id: string | number) => void;
//   handleDislike: (id: string | number) => void;
//   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
// }

// // Props for the Comment component
// type CommentProps = CommentData &
//   CommentHandlers & {
//     showInput?: boolean;
//     tier?: number;
//     user_liked?: boolean;
//     setShowInput?: (show: boolean) => void;
//   };

// const Comment: React.FC<CommentProps> = ({
//   id,
//   name,
//   tier,
//   text,
//   likes,
//   profile_picture,
//   dislikes,
//   replies,
//   handleSubmit,
//   showInput: propShowInput,
//   setShowInput: propSetShowInput,
//   handleLike,
//   handleDislike,
//   commentsCount,
//   parentId,
//   user_liked,
// }) => {
//   const [localShowInput, setLocalShowInput] = useState(false);
//   const [localCommenting, setLocalCommenting] = useState(false);
//   const [localCommentId, setLocalCommentId] = useState<number>(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [localLikes, setLocalLikes] = useState(likes);
//   const [localDislikes, setLocalDislikes] = useState(dislikes);
//   const [hasLiked, setHasLiked] = useState(false);
//   const [hasDisliked, setHasDisliked] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showReplies, setShowReplies] = useState(false);

//   const showInput = propShowInput ?? localShowInput;
//   const setShowInput = propSetShowInput ?? setLocalShowInput;

//   const badge_color = tier
//     ? tierColorMap[tier as keyof typeof tierColorMap]
//     : undefined;

//   const handleReplyClick = (id: string | number) => {
//     setShowInput(!showInput);
//     setLocalCommenting(true);
//     setLocalCommentId(Number(id));
//   };

//   const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const formData = new FormData(e.target as HTMLFormElement);
//       formData.append("parentId", parentId?.toString() || id.toString());

//       await handleSubmit?.(e);
//       setShowInput(false);
//     } catch (error) {
//       console.error("Failed to submit:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCommentLike = async () => {
//     if (isLoading) return;
//     setIsLoading(true);

//     try {
//       if (hasDisliked) {
//         // If previously disliked, remove the dislike first
//         setHasDisliked(false);
//         setLocalDislikes((prev) => prev - 1);
//         await new Promise<void>((resolve) => {
//           handleDislike(parentId || id);
//           resolve();
//         });
//       }

//       if (hasLiked) {
//         // If already liked, remove the like
//         setHasLiked(false);
//         setLocalLikes((prev) => prev - 1);
//         await new Promise<void>((resolve) => {
//           handleLike(parentId || id);
//           resolve();
//         }); // Sync removing like with the server
//       } else {
//         // Otherwise, add a like
//         setHasLiked(true);
//         setLocalLikes((prev) => prev + 1);
//         await new Promise<void>((resolve) => {
//           handleLike(parentId || id);
//           resolve();
//         }); // Sync adding like with the server
//       }
//     } catch (error) {
//       console.error("Error toggling like:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCommentDislike = async () => {
//     if (isLoading) return;
//     setIsLoading(true);

//     try {
//       if (hasLiked) {
//         // If previously liked, remove the like first
//         setHasLiked(false);
//         setLocalLikes((prev) => prev - 1);
//         await handleLike(parentId || id); // Sync removing like with the server
//       }

//       if (hasDisliked) {
//         setHasDisliked(false);
//         setLocalDislikes((prev) => prev - 1);
//         await new Promise<void>((resolve) => {
//           handleDislike(parentId || id);
//           resolve();
//         });
//       } else {
//         // Otherwise, add a dislike
//         setHasDisliked(true);
//         setLocalDislikes((prev) => prev + 1);
//         await new Promise<void>((resolve) => {
//           handleDislike(parentId || id);
//           resolve();
//         });
//       }
//     } catch (error) {
//       console.error("Error toggling dislike:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div data-comment-id={id}>
//       <div className="flex flex-col">
//         <div className="flex gap-2 items-center">
//           <div className="flex-shrink-0 relative w-9 h-9 rounded-full bg-neutral-2 overflow-hidden">
//             <Image
//               src={profile_picture || empty}
//               alt="user-real-info-from-props"
//               fill
//               className="object-cover bg-brand-9"
//             />
//           </div>
//           <p className="text-text-primary dark:text-white text-sm font-medium flex items-center">
//             <span className="text-ellipsis line-clamp-1">{name}</span>
//             {badge_color && <BadgeIcon color={badge_color} />}
//           </p>
//         </div>
//         <div className="space-y-1 pl-[3em]">
//           <p className="text-text-secondary dark:text-darkText-2 text-sm font-medium">
//             {text.split("\r\n").map((line, index) => (
//               <span key={index}>
//                 {line}
//                 {index < text.split("\r\n").length - 1 && <br />}
//               </span>
//             ))}
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center gap-3 justify-end mt-2">
//         <button
//           type="button"
//           onClick={() => handleReplyClick(id)}
//           className="text-text-quaternary dark:text-darkText-1 flex items-center gap-1"
//         >
//           <ReplyIcon />
//           <span className="text-[10px] font-normal">Reply</span>
//         </button>
//         <button
//           className={`flex items-center gap-1 ${
//             isLoading || hasLiked ? "text-green-600" : "text-gray-500"
//           }`}
//           disabled={isLoading || hasLiked}
//           onClick={handleCommentLike}
//         >
//           <ThumbsUp />
//           <span className="text-xs font-normal">{localLikes}</span>
//         </button>
//         <button
//           className={`flex items-center gap-1 ${
//             isLoading || hasDisliked ? "text-red-500" : "text-gray-500"
//           }`}
//           onClick={handleCommentDislike}
//           disabled={isLoading || hasDisliked}
//         >
//           <ThumbsDown />
//           <span className="text-xs font-normal">{localDislikes}</span>
//         </button>
//       </div>
//       {(showInput || commentsCount === 0) && (
//         <form
//           onSubmit={handleFormSubmit}
//           className="mt-6 mb-2 flex items-center justify-between gap-3"
//         >
//           <input type="hidden" name="parentId" value={parentId || id} />
//           <CommentTextArea
//             placeholder="Type your reply here"
//             id={`${id}`}
//             name="reply"
//             disabled={isSubmitting}
//           />
//           <button
//             type="submit"
//             className="bg-brand-9 p-2 rounded grid place-items-center"
//             aria-label="send message"
//             disabled={isSubmitting}
//           >
//             <span className="text-white">
//               {isSubmitting ? (
//                 <Loader2 className="h-5 w-5 animate-spin" />
//               ) : (
//                 <SendMessageIcon />
//               )}
//             </span>
//           </button>
//         </form>
//       )}

//       {replies && replies.length > 0 && (
//         <>
//           <button
//             onClick={() => setShowReplies(!showReplies)}
//             className="ml-10 mb-2 text-neutral-4 text-[10px] font-medium"
//           >
//             {showReplies
//               ? "Hide replies"
//               : `View replies - (${replies.length})`}
//           </button>
//           {showReplies && (
//             <div className="relative ml-10 pl-5 border-l border-neutral-300">
//               {replies.map((r) => (
//                 <Comment
//                   key={r.id}
//                   {...r}
//                   handleLike={handleLike}
//                   handleDislike={handleDislike}
//                   handleSubmit={handleSubmit}
//                   parentId={r.id}
//                 />
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Comment;

"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import {
  DislikeIcon,
  LikeIcon,
  ReplyIcon,
  SendMessageIcon,
  ThumbsDown,
  ThumbsUp,
} from "@/public/icons/icons";
import BadgeIcon, { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { empty } from "@/app/config";
import { CommentTextArea } from "@/app/(nav)/community/agent-forum/NewComment";
import { toggleCommentLike } from "@/app/(nav)/community/agent-forum/my-articles/data";

// Base comment data structure
export interface CommentData {
  id: string | number;
  name: string;
  text: string;
  likes: number;
  dislikes: number;
  replies?: CommentData[];
  commentsCount: number;
  profile_picture: string;
  parentId?: string | number;
}

// Handler functions interface
interface CommentHandlers {
  toggleLike?: (id: string | number, type: number) => void;
  handleLike?: (id: string | number, type: number) => void;
  handleDislike?: (id: string | number) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

// Props for the Comment component
type CommentProps = CommentData &
  CommentHandlers & {
    showInput?: boolean;
    tier?: number;
    user_liked?: boolean;
    user_disliked?: boolean;
    setShowInput?: (show: boolean) => void;
  };

const Comment: React.FC<CommentProps> = ({
  id,
  name,
  tier,
  text,
  likes,
  dislikes,
  profile_picture,
  replies,
  commentsCount,
  parentId,
  user_liked = false,
  user_disliked = false,
  handleSubmit,
  showInput: propShowInput,
  setShowInput: propSetShowInput,
  toggleLike,
  handleLike,
  handleDislike,
}) => {
  const [localShowInput, setLocalShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(
    user_liked ? "like" : null
  );
  const [showReplies, setShowReplies] = useState(false);

  // Use provided showInput/setShowInput or fall back to local state
  const showInput = propShowInput ?? localShowInput;
  const setShowInput = propSetShowInput ?? setLocalShowInput;

  const badgeColor =
    tier && tier > 1
      ? // ? tierColorMap[tier as keyof typeof tierColorMap]
        "gray"
      : undefined;

  // Handle reply button click
  const handleReplyClick = useCallback(() => {
    setShowInput(!showInput);
  }, [showInput, setShowInput]);

  // Handle form submission for replies
  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const formData = new FormData(e.target as HTMLFormElement);
        formData.append("parentId", parentId?.toString() || id.toString());
        await handleSubmit(e);
        setShowInput(false);
        window.dispatchEvent(new Event("refetchComments"));
      } catch (error) {
        console.error("Failed to submit comment:", error);
        toast.error("Failed to submit reply");
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleSubmit, id, parentId, setShowInput]
  );

  // Handle like with optimistic UI
  // const handleCommentLike = useCallback(async () => {
  //   if (isLoading || user_liked || userAction === "like") return;

  //   const previousAction = userAction;

  //   // Optimistic UI: Update action state and disable buttons
  //   setIsLoading(true);
  //   setUserAction("like");

  //   try {
  //     handleLike(parentId || id);
  //     window.dispatchEvent(new Event("refetchComments"));
  //   } catch (error) {
  //     // Rollback action state on error
  //     setUserAction(previousAction);
  //     console.error("Error toggling like:", error);
  //     toast.error("Failed to like comment");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [id, parentId, isLoading, userAction, user_liked, handleLike]);

  // // Handle dislike with optimistic UI
  // const handleCommentDislike = useCallback(async () => {
  //   if (isLoading || userAction === "dislike") return;

  //   const previousAction = userAction;

  //   // Optimistic UI: Update action state and disable buttons
  //   // setUserAction("dislike");

  //   try {
  //     setIsLoading(true);
  //     toggleLike(parentId || id, -1);
  //     window.dispatchEvent(new Event("refetchComments"));
  //   } catch (error) {
  //     // Rollback action state on error
  //     setUserAction(previousAction);
  //     console.error("Error toggling dislike:", error);
  //     toast.error("Failed to dislike comment");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [id, parentId, isLoading, userAction, handleDislike]);

  const handleToggleLike = async (type: number) => {
    try {
      setIsLoading(true);
      const res = await toggleCommentLike(String(parentId || id), type);
      if (res) {
        window.dispatchEvent(new Event("refetchComments"));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-comment-id={id} className="space-y-2">
      {/* User Info */}
      <div className="flex items-center gap-2">
        <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-neutral-2">
          <Image
            src={profile_picture || empty}
            alt={`${name}'s profile picture`}
            fill
            className="object-cover bg-brand-9"
          />
        </div>
        <p className="flex items-center text-sm font-medium text-text-primary dark:text-white">
          <span className="line-clamp-1 capitalize">{name}</span>
          {badgeColor && <BadgeIcon color={badgeColor} />}
        </p>
      </div>

      {/* Comment Text */}
      <div className="pl-[3em]">
        <p className="text-sm font-medium text-text-secondary dark:text-darkText-2">
          {text.split("\r\n").map((line, index) => (
            <span key={index}>
              {line}
              {index < text.split("\r\n").length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>

      {/* Actions (Reply, Like, Dislike) */}
      <div className="mt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleReplyClick}
          className="flex items-center gap-1 text-text-quaternary dark:text-darkText-1"
        >
          <ReplyIcon />
          <span className="text-[10px] font-normal">Reply</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1"
          disabled={isLoading}
          onClick={() => handleToggleLike(1)}
        >
          <LikeIcon
            fill={`${user_liked ? "#E15B0F" : ""} `}
            stroke={`${user_liked ? "#E15B0F" : "#000"} `}
          />
          <span className="text-xs font-normal">{likes}</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1"
          disabled={isLoading}
          onClick={() => handleToggleLike(-1)}
        >
          <DislikeIcon
            fill={`${user_disliked ? "#E15B0F" : "none"} `}
            stroke={`${user_disliked ? "#E15B0F" : "#000"} `}
          />
          <span className="text-xs font-normal">{dislikes}</span>
        </button>
      </div>

      {/* Reply Form */}
      {(showInput || commentsCount === 0) && (
        <form onSubmit={onSubmit} className="my-2 flex items-center gap-3">
          <input type="hidden" name="parentId" value={parentId || id} />
          <CommentTextArea
            placeholder="Type your reply here"
            id={`${id}`}
            name="reply"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="grid place-items-center rounded bg-brand-9 p-2"
            aria-label="Send reply"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <SendMessageIcon />
            )}
          </button>
        </form>
      )}

      {/* Replies */}
      {replies && replies.length > 0 && (
        <>
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="mb-2 ml-10 text-[10px] font-medium text-neutral-4"
          >
            {showReplies
              ? "Hide replies"
              : `View replies - (${replies.length})`}
          </button>
          {showReplies && (
            <div className="relative ml-10 border-l border-neutral-300 pl-5">
              {replies.map((reply) => (
                <Comment
                  key={reply.id}
                  {...reply}
                  // handleLike={handleLike}
                  // handleDislike={handleDislike}
                  handleSubmit={handleSubmit}
                  parentId={reply.id}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;
