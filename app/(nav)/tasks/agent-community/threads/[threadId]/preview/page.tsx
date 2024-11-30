"use client";
import { useEffect, useState } from "react";

// import BackButton from "@/components/BackButton/back-button";
import Image, { StaticImageData } from "next/image";
// import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { PropertyImageSlider } from "@/components/Management/Rent And Unit/rental-property-card";
import { ChevronLeft, ThumbsDown, ThumbsUp } from "@/public/icons/icons";
import user1 from "@/public/empty/user1.svg";
import user2 from "@/public/empty/user2.svg";
import user3 from "@/public/empty/user3.svg";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import Comment, { CommentData } from "@/components/tasks/announcements/comment";
import { ContributorDetails } from "@/components/Community/Contributor";
import CompanySummary from "@/components/Community/CompanySummary";
import useFetch from "@/hooks/useFetch";
import { ThreadArticleSkeleton } from "../../../components";
import { sendMyArticleComment, sendMyArticleReply, toggleLike } from "../../../my-articles/data";
import { toast } from "sonner";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import NewComment from "../../../NewComment";
import CommunityComments from "@/components/Community/CommunityComments";
import { CommunitySlider } from "@/components/Community/CommunitySlider";

interface ThreadResponse {
  post: any;
  company_summary: any;
  contributor: any;
  comments: CommentData[];
}

const ThreadPreview = () => {
  const router = useRouter();
  const { threadId } = useParams();
  const slug = threadId as string;
  const [post, setPost] = useState<any>(null);
  const [companySummary, setCompanySummary] = useState<any>(null);
  const [contributors, setContributors] = useState<any>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const { data, error, loading, refetch: refetchComments } = useFetch<ThreadResponse>(`/agent_community/${slug}`);

  useRefetchOnEvent("refetchComments", ()=> refetchComments({silent:true}));

  useEffect(() => {
    console.log("data", data);
    if (data) {
      setPost(data.post.post);
      setCompanySummary(data.post.company_summary);
      setContributors(data.post.contributor);
      setComments(data.post.comments);
    }
  }, [data]);

  // console.log("slug", slug);
  console.log("data", data);
  // console.log("companySummary", companySummary);
  // console.log("comments", comments);
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between flex-wrap gap-2">
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
          href={`/tasks/agent-community/my-articles/create`}
          size="sm"
          className="py-2 px-3"
        >
          Create Article
        </Button>
      </div>
      <div className="flex flex-col gap-y-5 gap-x-10 lg:flex-row lg:items-start my-4">
        <div className="lg:w-[58%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <div className="slider h-[250px] md:h-[300px] lg:h-[350px] w-full relative px-[20px] md:px-[35px]">
          {loading ? (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ) : post?.media?.length > 0 ? (
              <CommunitySlider 
                images={post?.media} 
                video_link={post?.video_link}
                thread 
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">No image</p>
              </div>
            )}
          </div>
          <ThreadArticle 
            post={post} 
            slug={slug} 
          />
          <CommunityComments 
            slug={slug} 
            comments={comments}
            setComments={setComments}
          />
        </div>
        <div className="lg:flex-1 space-y-5 lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <ContributorDetails 
            title="Contributor Details" 
            loading={loading} 
            post={post} 
            contributors={contributors} 
            targetAudience={Array.isArray(post?.target_audience) ? post.target_audience.join(', ') : ''} 
          />
          <CompanySummary 
            loading={loading} 
            companySummary={companySummary} 
          />
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
    console.log('like clicked');
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
    console.log('dislike clicked');
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
        <div className="flex items-center gap-2">
          <span className="text-text-secondary">Comments</span>
          <p className="text-white text-xs font-semibold rounded-full bg-brand-9 px-3 py-[2px]">{post?.comments_count}</p>
        </div>

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
