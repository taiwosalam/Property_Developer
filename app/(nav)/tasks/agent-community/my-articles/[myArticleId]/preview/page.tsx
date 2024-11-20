"use client";

// import BackButton from "@/components/BackButton/back-button";
import Image, { StaticImageData } from "next/image";
// import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Sample from "@/public/empty/SampleProperty.jpeg";
import Sample2 from "@/public/empty/SampleProperty2.jpeg";
import Sample3 from "@/public/empty/SampleProperty3.jpeg";
import Sample4 from "@/public/empty/SampleProperty4.png";
import Sample5 from "@/public/empty/SampleProperty5.jpg";
import { PropertyImageSlider } from "@/components/Management/Rent And Unit/rental-property-card";
import { ChevronLeft, ThumbsDown, ThumbsUp } from "@/public/icons/icons";
import user1 from "@/public/empty/user1.svg";
import user2 from "@/public/empty/user2.svg";
import user3 from "@/public/empty/user3.svg";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import Comment, { CommentProps } from "@/components/tasks/announcements/comment";
import ReadyByCard from "@/components/Community/ReadByCard";
import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
import { useState } from "react";
import { empty } from "@/app/config";
import { sendMyArticleComment, sendMyArticleReply, toggleLike } from "../../data";
import { ThreadArticleSkeleton } from "../../../components";
import { toast } from "sonner";

interface ArticleResponse {
  post: any;
  company_summary: any;
  contributor: any;
  comments: CommentProps[];
}

interface CommentsResponse {
  message: string;
  data: CommentProps[];
}

const ThreadPreview = () => {
  const router = useRouter();
  const { myArticleId } = useParams();
  const slug = myArticleId as string;
  const [post, setPost] = useState<any>(null);
  const [companySummary, setCompanySummary] = useState<any>(null);
  const [contributors, setContributors] = useState<any>(null);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const { data, error, loading } = useFetch<ArticleResponse>(`/agent_community/${slug}`);

  useEffect(() => {
    if (data) {
      setPost(data.post.post);
      setCompanySummary(data.post.company_summary);
      setContributors(data.post.contributor);
      setComments(data.post.comments);
    }
  }, [data]);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1 mb-1">
          <button
            type="button"
            aria-label="Go Back"
            onClick={() => router.back()}
            className="p-2"
          >
            <ChevronLeft />
          </button>
          {loading ? (
            <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <h1 className="text-black dark:text-white font-bold text-lg lg:text-xl">
              {post?.title}
            </h1>
          )}
        </div>
        <Button
          href={`/tasks/agent-community/my-articles/${slug}/manage`}
          size="sm"
          className="py-2 px-3"
        >
          Manage Article
        </Button>
      </div>
      <div className="flex flex-col gap-y-5 gap-x-10 lg:flex-row lg:items-start">
        <div className="lg:w-[58%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <div className="slider h-[250px] md:h-[300px] lg:h-[350px] w-full relative px-[20px] md:px-[35px]">
            {loading ? (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ) : post?.media?.length > 0 ? (
              <PropertyImageSlider images={post?.media} thread />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">No image</p>
              </div>
            )}
          </div>
          <ThreadArticle post={post} slug={slug} />
          <ThreadComments slug={slug} />
        </div>
        <div className="lg:flex-1 space-y-5 lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <Summary post={post} loading={loading} />
          <ReadyByCard />
        </div>
      </div>
    </div>
  );
};

export default ThreadPreview;


const ThreadArticle = ({ post, slug }: { post: any, slug: string }): JSX.Element => {
  const [likeCount, setLikeCount] = useState(post?.likes_up ? parseInt(post?.likes_up) : 0);
  const [dislikeCount, setDislikeCount] = useState(post?.likes_down ? parseInt(post?.likes_down) : 0);
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

  if (!post) {
    return <ThreadArticleSkeleton />;
  }
  
  return (
    <div className="mt-4">
      <div 
        className="text-sm text-darkText-secondary mt-2" 
        dangerouslySetInnerHTML={{ __html: post?.content }}
      />
      <div className="flex justify-between mt-6">
        <div className="text-black font-semibold">Comments</div>

        <div className="flex gap-2">
          <button className={`flex items-center gap-1 ${userAction === 'like' ? 'text-blue-500' : ''}`} disabled={isLoading} onClick={handleLike}>
            <ThumbsUp />
            <p>{likeCount}</p>
          </button>
          <button className={`flex items-center gap-1 ${userAction === 'dislike' ? 'text-red-500' : ''}`} onClick={handleDislike} disabled={isLoading}>
            <ThumbsDown />
            <p>{dislikeCount}</p>
          </button>

          <div className="flex">
            <div className="images flex z-30">
              <Image
                src={user1}
                alt="blog"
                width={23}
                height={23}
                className="-mr-2"
              />
              <Image
                src={user2}
                alt="blog"
                width={23}
                height={23}
                className="-mr-2"
              />
              <Image
                src={user3}
                alt="blog"
                width={23}
                height={23}
                className="-mr-2"
              />
            </div>
            <div className="rounded-r-[23px] w-[48px] h-[23px] flex-shrink-0 bg-brand-9 z-10 flex items-center justify-center text-[10px] font-semibold tracking-[0px] text-white">
              +{likeCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ThreadComments = ({ slug }: { slug: string }) => {
  const [showInput, setShowInput] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [comments, setComments] = useState<CommentProps[]>([]);

  const { data, error, loading } = useFetch<CommentsResponse>(`/agent_community/${slug}/comments`);

  const handleLike = (commentId: string | number) => {
    console.log('Like comment:', commentId);
  };

  const handleDislike = (commentId: string | number) => {
    console.log('Dislike comment:', commentId);
  };

  useEffect(() => {
    if (data?.data) {
      const commentsData = data.data.map((comment) => ({
        ...comment,
        replies: comment.replies || [],
      }));
      setComments(commentsData);
    }
  }, [data]);



  const sendComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowInput(false);
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get('message');
    const reply = formData.get('reply');
    
    try {
      setCommenting(true);
      
      if (reply) {
        const replyInput = (e.target as HTMLFormElement).querySelector('input[name="reply"]');
        const commentId = Number(replyInput?.id);
        
        if (commentId) {
          // Optimistically update UI
          const newReply: CommentProps = {
            id: Date.now(),
            name: "You",
            text: reply as string,
            likes: 0,
            dislikes: 0,
            handleSubmit: () => {},
            commenting: false,
            replies: []
          };

          setComments(prevComments => 
            prevComments.map(comment => 
              comment.id === commentId
                ? { ...comment, replies: [...(comment.replies || []), newReply] }
                : comment
            )
          );

          // Send to server
          await sendMyArticleReply(slug, commentId.toString(), reply as string);
        }
      } else if (message) {
        // Optimistically update UI
        const newComment: CommentProps = {
          id: Date.now(),
          name: "You",
          text: message as string,
          likes: 0,
          dislikes: 0,
          replies: [],
          handleSubmit: () => {},
          commenting: false
        };

        setComments(prev => [...prev, newComment]);

        // Send to server
        await sendMyArticleComment(slug, message as string);
      }

      // Fetch latest comments in background
      const response = await fetch(`/agent_community/${slug}/comments`);
      const newData = await response.json();
      setComments(newData.data);

      (e.target as HTMLFormElement).reset();
      setShowInput(false);
      toast.success(reply ? "Reply sent successfully" : "Comment sent successfully");
      
    } catch (error) {
      console.error("Error sending comment/reply:", error);
      // Revert optimistic update by re-fetching
      const response = await fetch(`/agent_community/${slug}/comments`);
      const newData = await response.json();
      setComments(newData.data);
      toast.error("Failed to send comment");
    } finally {
      setCommenting(false);
    }
  };

  return (    
  <form onSubmit={sendComment}>
      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment.id} data-comment-id={comment.id}>
            <Comment 
              {...comment} 
              handleLike={handleLike} 
              handleDislike={handleDislike} 
              commenting={commenting}
              handleSubmit={sendComment}
            />
          </div>
        ))}
      </div>
    </form>
  );
};

// SECOND SIDE


const Summary = ({ post, loading }: { post: any; loading: boolean }) => {
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
      value: post?.target_audience ? 
        JSON.parse(post.target_audience).join(', ') : 
        '' 
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


const SummarySkeleton = () => {
  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg animate-pulse">
      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex gap-4 justify-between w-full items-start">
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};