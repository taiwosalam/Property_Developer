"use client";

import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ThumbsDown, ThumbsUp } from "@/public/icons/icons";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import { ContributorDetails } from "@/components/Community/Contributor";
import CompanySummary from "@/components/Community/CompanySummary";
import useFetch from "@/hooks/useFetch";
import { useState, useEffect } from "react";
import PropertyRequestComments from "@/components/Community/PropertyRequestComments";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import MoreDetailsCard from "@/components/AgentRequest/moreDetails";
import ThreadArticle from "@/components/AgentRequest/threadArticle";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";

interface PropertyRequestResponse {
  data: {
    PropertyRequest: any;
    contributor: any;
    readByData: any;
    comments: any;
    company_summary: any;
  };
}

const PreviewPage = () => {
  const router = useRouter();
  const { requestId } = useParams();
  const [propertyRequest, setPropertyRequest] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [readByData, setReadByData] = useState<any>(null);
  const [companySummary, setCompanySummary] = useState<any>(null);
  const [comments, setComments] = useState<any>(null);
  const [slug, setSlug] = useState<string>("");
  const {
    data,
    loading,
    error,
    refetch: refetchComments,
  } = useFetch<PropertyRequestResponse>(
    `/agent_requests/${requestId}`
  );
  useRefetchOnEvent("refetchComments", () => refetchComments({ silent: true }));

  useEffect(() => {
    if (data) {
      setPropertyRequest(data.data.PropertyRequest);
      setSlug(data.data.PropertyRequest.slug);
      setUser(data.data.contributor);
      setReadByData(data.data.readByData);
      setComments(data.data.comments);
      setCompanySummary(data.data.company_summary);
    }
  }, [data]);

  console.log("data here - ", data);

  if (loading) return <PageCircleLoader />;

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
          <h1 className="text-black dark:text-white font-bold text-lg lg:text-xl">
            {propertyRequest?.title}
          </h1>
        </div>
        <Button
          href={`/management/agent-request/my-properties-request/create`}
          size="sm"
          className="py-2 px-3"
        >
          Create Property Request
        </Button>
      </div>
      <div className="flex flex-col gap-y-5 gap-x-10 lg:flex-row lg:items-start">
        <div className="lg:w-[58%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <MoreDetailsCard propertyRequest={propertyRequest} user={user} />
          <ThreadArticle
            propertyRequest={propertyRequest}
            comments={data?.data.comments}
          />
          <PropertyRequestComments
            id={requestId as string}
            slug={slug}
            comments={data?.data.comments}
            setComments={setComments}
          />
        </div>
        <div className="lg:flex-1 space-y-5 lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <ContributorDetails
            title="Requester Details"
            contributors={user}
            post={propertyRequest}
            targetAudience={propertyRequest?.target_audience?.join(", ")}
            postedDate={propertyRequest?.created_at}
            updatedDate={propertyRequest?.updated_at}
          />
          <CompanySummary companySummary={companySummary} />
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
