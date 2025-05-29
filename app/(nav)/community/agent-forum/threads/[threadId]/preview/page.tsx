"use client";
import { useEffect, useState } from "react";

// import BackButton from "@/components/BackButton/back-button";
import Image, { StaticImageData } from "next/image";
// import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft } from "@/public/icons/icons";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import { CommentData } from "@/components/tasks/announcements/comment";
import { ContributorDetails } from "@/components/Community/Contributor";
import CompanySummary from "@/components/Community/CompanySummary";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import CommunityComments from "@/components/Community/CommunityComments";
import { CommunitySlider } from "@/components/Community/CommunitySlider";
import PreviewThreadArticle from "@/components/Community/PreviewArticle";
import { ThreadResponse, transformApiData } from "./data";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";

const ThreadPreview = () => {
  const router = useRouter();
  const { threadId } = useParams();
  const slug = threadId as string;
  const [post, setPost] = useState<any>(null);
  const [companySummary, setCompanySummary] = useState<any>(null);
  const [contributors, setContributors] = useState<any>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [targetAudience, setTargetAudience] = useState<string>("");
  const {
    data,
    error,
    loading,
    isNetworkError,
    refetch: refetchComments,
  } = useFetch<ThreadResponse>(`/agent_community/${slug}`);
  useRefetchOnEvent("refetchComments", () => refetchComments({ silent: true }));

  // Process API data and set state
  useEffect(() => {
    if (data) {
      const transformedData = transformApiData(data);
      setPost(transformedData.post);
      setCompanySummary(transformedData.companySummary);
      setContributors(transformedData.contributors);
      setComments(transformedData.comments);
      setTargetAudience(transformedData.targetAudience);
    }
  }, [data]);

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

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
          href={`/community/agent-forum/my-articles/create`}
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
          <PreviewThreadArticle post={post} slug={slug} comments={comments} />
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
            targetAudience={targetAudience}
          />
          <CompanySummary loading={loading} companySummary={companySummary} />
        </div>
      </div>
    </div>
  );
};

export default ThreadPreview;
