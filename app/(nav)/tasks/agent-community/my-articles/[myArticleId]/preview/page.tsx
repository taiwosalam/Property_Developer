"use client";

// import BackButton from "@/components/BackButton/back-button";
import Image, { StaticImageData } from "next/image";
import "keen-slider/keen-slider.min.css";
import { PropertyImageSlider } from "@/components/Management/Rent And Unit/rental-property-card";
import { ChevronLeft } from "@/public/icons/icons";
import user1 from "@/public/empty/user1.svg";
import user2 from "@/public/empty/user2.svg";
import user3 from "@/public/empty/user3.svg";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import Comment, { CommentData } from "@/components/tasks/announcements/comment";
import ReadyByCard from "@/components/Community/ReadByCard";
import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
import { useState } from "react";
import { toggleLike } from "../../data";
import { LikeDislikeButtons, Loader, ThreadArticleSkeleton } from "../../../components";
import { toast } from "sonner";
import NewComment from "../../../NewComment";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import CommunityComments from "@/components/Community/CommunityComments";
import { CommunitySlider } from "@/components/Community/CommunitySlider";

interface ArticleResponse {
  post: any;
  company_summary: any;
  contributor: any;
  comments: CommentData[];
  readByData: any;
}

interface CommentsResponse {
  message: string;
  data: CommentData[];
}

const ThreadPreview = () => {
  const router = useRouter();
  const { myArticleId } = useParams();
  const slug = myArticleId as string;
  const [post, setPost] = useState<any>(null);
  const [companySummary, setCompanySummary] = useState<any>(null);
  const [contributors, setContributors] = useState<any>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [readyBy, setReadyBy] = useState<any>(null);
  const { data, error, loading, refetch: refetchComments } = useFetch<ArticleResponse>(`/agent_community/${slug}`);
  
  useRefetchOnEvent("refetchComments", ()=> refetchComments({silent:true}));

  useEffect(() => {
    if (data) {
      setPost(data.post.post);
      setCompanySummary(data.post.company_summary);
      setContributors(data.post.contributor);
      setComments(data.post.comments);
      setReadyBy(data.post.readByData);
    }
  }, [data]);

  console.log("data", data);
  // console.log("read by data", data?.post.readByData);

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center">
  <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
  </div>;

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
          {loading ? <Loader className="h-7 w-48" /> : <h1>{post?.title}</h1>}
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
            comments={comments}
          />
          <CommunityComments 
            slug={slug} 
            comments={comments} 
            setComments={setComments} 
          />
        </div>
        <div className="lg:flex-1 space-y-5 lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <Summary 
           post={post} 
           loading={loading} 
          />
          <ReadyByCard 
            data={readyBy} 
          />
        </div>
      </div>
    </div>
  );
};

export default ThreadPreview;


const ThreadArticle = ({ post, slug, comments }: { post: any, slug: string, comments: CommentData[] }): JSX.Element => {
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
      toast.error('Error toggling like');
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
      toast.error('Error toggling dislike');
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
            {/* <p className="text-white text-xs font-semibold rounded-full bg-brand-9 px-3 py-[2px]">
              {post?.comments_count}
            </p> */}
        </div>

        <div className="flex gap-2">
          <LikeDislikeButtons
            commentCount={post?.comments_count}
            slug={slug}
            likeCount={likeCount}
            dislikeCount={dislikeCount}
            handleLike={handleLike}
            handleDislike={handleDislike}
            userAction={userAction}
            isLoading={isLoading}
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
            <div className="rounded-r-[23px] w-[48px] h-[23px] flex-shrink-0 bg-brand-9 z-10 flex items-center justify-center text-[10px] font-semibold tracking-[0px] text-white">
              +{post?.comments_count}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


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