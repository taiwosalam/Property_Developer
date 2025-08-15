"use client";

// import BackButton from "@/components/BackButton/back-button";
import Image, { StaticImageData } from "next/image";
import "keen-slider/keen-slider.min.css";
import { PropertyImageSlider } from "@/components/Management/Rent And Unit/rental-property-card";
import { ChevronLeft } from "@/public/icons/icons";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import Comment, { CommentData } from "@/components/tasks/announcements/comment";
import ReadyByCard from "@/components/Community/ReadByCard";
import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
import { useState } from "react";
import {
  Loader,
} from "../../../components";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import CommunityComments from "@/components/Community/CommunityComments";
import { CommunitySlider } from "@/components/Community/CommunitySlider";
import DOMPurify from "dompurify";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import { transformApiData } from "../../../threads/[threadId]/preview/data";
import { ThreadProvider } from "@/utils/my-article-context";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { Summary, ThreadArticle } from "../components";

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

  const {
    data,
    error,
    loading,
    silentLoading,
    isNetworkError,
    refetch: refetchComments,
  } = useFetch<ArticleResponse>(`/agent_community/${slug}`);

  useRefetchOnEvent("refetchComments", () => refetchComments({ silent: true }));

  useEffect(() => {
    if (data) {
      const transformedData = transformApiData(data as any);
      setPost(transformedData.post);
      setCompanySummary(transformedData.companySummary);
      setContributors(transformedData.contributors);
      setComments(transformedData.comments);
      setReadyBy(transformedData.readByData ?? []);
    }
  }, [data]);


  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <ThreadProvider
      post={post}
      comments={comments}
      slug={slug}
      loading={loading}
      setComments={setComments}
      refetchComments={refetchComments}
    >
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
            href={`/community/agent-forum/my-articles/${slug}/manage`}
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
            <ThreadArticle  />
            <CommunityComments
              slug={slug}
              comments={comments}
              setComments={setComments}
            />
          </div>
          <div className="lg:flex-1 space-y-5 lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
            <Summary />
            <ReadyByCard data={readyBy} />
          </div>
        </div>
      </div>
    </ThreadProvider>
  );
};

export default ThreadPreview;
