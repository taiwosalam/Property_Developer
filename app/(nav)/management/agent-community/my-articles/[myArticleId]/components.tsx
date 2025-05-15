"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { CommentData } from "@/components/tasks/announcements/comment";
import DOMPurify from "dompurify";
import { useThreadContext } from "@/utils/my-article-context";
import { SummarySkeleton } from "@/components/Loader/SummarySkeleton";
import { toggleLike } from "../data";
import { LikeDislikeButtons, ThreadArticleSkeleton } from "../../components";

// export const ThreadArticle = (): JSX.Element => {
//   const { post, slug, comments } = useThreadContext();
//   const [likeCount, setLikeCount] = useState(
//     post?.likes_up ? parseInt(post?.likes_up) : 0
//   );
//   const [dislikeCount, setDislikeCount] = useState(
//     post?.likes_down ? parseInt(post?.likes_down) : 0
//   );
//   const [userAction, setUserAction] = useState<"like" | "dislike" | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLike = async () => {
//     if (isLoading || userAction === "like") return;
//     setIsLoading(true);

//     try {
//       await toggleLike(slug, 1);
//       if (userAction === "dislike") {
//         setDislikeCount((prev) => prev - 1);
//       }
//       setLikeCount((prev) => prev + 1);
//       setUserAction("like");
//     } catch (error) {
//       toast.error("Error toggling like");
//       console.error("Error toggling like:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDislike = async () => {
//     if (isLoading || userAction === "dislike") return;
//     setIsLoading(true);

//     try {
//       await toggleLike(slug, -1);
//       if (userAction === "like") {
//         setLikeCount((prev) => prev - 1);
//       }
//       setDislikeCount((prev) => prev + 1);
//       setUserAction("dislike");
//     } catch (error) {
//       toast.error("Error toggling dislike");
//       console.error("Error toggling dislike:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!post) return <ThreadArticleSkeleton />;
//   const sanitizedHTML = DOMPurify.sanitize(post?.content || "");

//   return (
//     <div className="mt-4">
//       <div
//         className="text-sm text-darkText-secondary mt-2"
//         dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
//       />
//       <div className="flex justify-between mt-6">
//         <div className="flex items-center gap-2">
//           <span className="text-text-secondary font-semibold text-md">
//             Comments
//           </span>
//         </div>

//         <div className="flex gap-2">
//           <LikeDislikeButtons
//             commentCount={post?.comments_count}
//             slug={slug}
//             likeCount={likeCount}
//             dislikeCount={dislikeCount}
//             handleLike={handleLike}
//             handleDislike={handleDislike}
//             userAction={userAction}
//             isLoading={isLoading}
//             user_liked={post?.user_liked}
//           />
//           <div className="flex items-center">
//             <div className="images flex z-30">
//               {comments.slice(0, 3).map((comment, index) => (
//                 <Image
//                   key={index}
//                   src={comment.profile_picture}
//                   alt={`commenter ${index + 1}`}
//                   width={300}
//                   height={300}
//                   className="-mr-2 h-[30px] w-[30px] object-cover rounded-full"
//                 />
//               ))}
//             </div>
//             {post?.comments_count > 0 && (
//               <div className="rounded-r-[23px] w-[48px] h-[23px] flex-shrink-0 bg-brand-9 z-10 flex items-center justify-center text-[10px] font-semibold tracking-[0px] text-white">
//                 +{post?.comments_count}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export const ThreadArticle = (): JSX.Element => {
  const { post, slug, comments } = useThreadContext();
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(
    post?.user_liked ? "like" : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = useCallback(async () => {
    if (isLoading || userAction === "like" || post?.user_liked) return;

    const previousAction = userAction;

    // Optimistic UI: Update action state
    setIsLoading(true);
    setUserAction("like");

    try {
      await toggleLike(slug, 1);
      window.dispatchEvent(new Event("refetchComments"));
    } catch (error) {
      // Rollback action state on error
      setUserAction(previousAction);
      toast.error("Error toggling like");
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, userAction, post?.user_liked, slug]);

  const handleDislike = useCallback(async () => {
    if (isLoading || userAction === "dislike") return;

    const previousAction = userAction;

    // Optimistic UI: Update action state
    setIsLoading(true);
    setUserAction("dislike");

    try {
      await toggleLike(slug, -1);
      window.dispatchEvent(new Event("refetchComments"));
    } catch (error) {
      // Rollback action state on error
      setUserAction(previousAction);
      toast.error("Error toggling dislike");
      console.error("Error toggling dislike:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, userAction, slug]);

  if (!post) return <ThreadArticleSkeleton />;
  const sanitizedHTML = DOMPurify.sanitize(post?.content || "");

  return (
    <div className="mt-4">
      <div
        className="text-sm text-darkText-secondary mt-2"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
      <div className="flex justify-between mt-6">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary font-semibold text-md">
            Comments
          </span>
        </div>

        <div className="flex gap-2">
          <LikeDislikeButtons
            commentCount={post?.comments_count}
            slug={slug}
            likeCount={parseInt(post?.likes_up || "0")}
            dislikeCount={parseInt(post?.likes_down || "0")}
            handleLike={handleLike}
            handleDislike={handleDislike}
            userAction={userAction}
            isLoading={isLoading}
            user_liked={post?.user_liked}
          />
          <div className="flex items-center">
            <div className="images flex z-30">
              {comments.slice(0, 3).map((comment, index) => (
                <Image
                  key={index}
                  src={comment.profile_picture}
                  alt={`commenter ${index + 1}`}
                  width={300}
                  height={300}
                  className="-mr-2 h-[30px] w-[30px] object-cover rounded-full"
                />
              ))}
            </div>
            {post?.comments_count > 0 && (
              <div className="rounded-r-[23px] w-[48px] h-[23px] flex-shrink-0 bg-brand-9 z-10 flex items-center justify-center text-[10px] font-semibold tracking-[0px] text-white">
                +{post?.comments_count}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Summary = () => {
  const { post, loading } = useThreadContext();
  if (loading) {
    return <SummarySkeleton />;
  }

  const MyArticleSummaryData = [
    { label: "Posted Date", value: post?.created_at },
    { label: "Last Updated", value: post?.updated_at },
    { label: "Total Seen", value: post?.views_count },
    { label: "Total Comments", value: post?.comments_count },
    {
      label: "Target Audience",
      value: post?.state + ", " + post?.lga,
    },
  ];

  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg">
      <h2 className="text-black font-semibold text-lg dark:text-white">
        Summary
      </h2>
      <div className="flex flex-col mt-4 gap-2">
        {MyArticleSummaryData.map((item, index) => (
          <div
            className="flex gap-4 justify-between w-full items-start"
            key={index}
          >
            <p className="text-[#747474] text-sm w-1/2">{item.label}</p>
            <p className="dark:text-white text-black text-sm flex items-start w-1/2">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
