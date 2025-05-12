"use client";

import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";
import { ChevronLeft } from "@/public/icons/icons";
import Button from "@/components/Form/Button/button";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import MoreDetailsCard from "@/components/AgentRequest/moreDetails";
import ThreadArticle from "@/components/AgentRequest/threadArticle";
import PropertyRequestComments from "@/components/Community/PropertyRequestComments";
import ContributorDetails from "@/components/Community/Contributor";
import CompanySummary from "@/components/Community/CompanySummary";
import {
  transformPropertyRequestResponse,
  TransformedPropertyRequestData,
  PropertyRequestResponse,
} from "./data";

const PreviewPage = () => {
  const router = useRouter();
  const { requestId } = useParams();

  const { data, loading, error, isNetworkError, refetch } =
    useFetch<PropertyRequestResponse>(`/agent_requests/${requestId}`);

  useRefetchOnEvent("refetchComments", () => refetch({ silent: true }));

  const transformedData = useMemo(
    () => (data ? transformPropertyRequestResponse(data) : null),
    [data]
  );

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;
  if (!transformedData)
    return (
      <div className="text-center text-text-secondary">No data available</div>
    );

  const { propertyRequest, contributor, companySummary, comments } =
    transformedData;

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
            {propertyRequest.title || "Untitled Request"}
          </h1>
        </div>
        <Button
          href="/management/agent-request/my-properties-request/create"
          size="sm"
          className="py-2 px-3"
        >
          Create Property Request
        </Button>
      </div>
      <div className="flex flex-col gap-y-5 gap-x-10 lg:flex-row lg:items-start">
        <div className="lg:w-[58%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <MoreDetailsCard
            propertyRequest={propertyRequest}
            user={contributor}
          />
          {/* <ThreadArticle
            propertyRequest={propertyRequest}
            comments={comments}
            slug={propertyRequest.slug}
          />
          <PropertyRequestComments
            id={requestId as string}
            slug={propertyRequest.slug}
            comments={comments}
          /> */}
        </div>
        <div className="lg:flex-1 space-y-5 lg:max-h-screen overflow-x-hidden lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <ContributorDetails
            title="Requester Details"
            contributors={contributor}
            post={propertyRequest}
            // targetAudience={propertyRequest.targetAudience}
            postedDate={propertyRequest.createdAt}
          />
          {/* <CompanySummary companySummary={companySummary} /> */}
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
