"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  CommentProps,
  CompanySummary as TCompanySummary,
  Contributor,
  PropertyRequest,
  PropertyRequestResponse,
} from "./types";

import { CompanySummaryTypes } from "@/components/Community/types";
import { transformPropertyRequestResponse } from "./data";
import BackButton from "@/components/BackButton/back-button";
import ThreadComments from "@/components/Community/ThreadComments";
const PreviewPage = () => {
  const router = useRouter();
  const { requestId } = useParams();

  const [agentRequest, setAgentRequest] = useState<PropertyRequest | null>(
    null
  );
  const [readBy, setReadBy] = useState<any>(null);
  const [contributor, setContributor] = useState<Contributor | null>(null);
  const [comments, setComments] = useState<any>([]);
  const [companySummary, setCompanySummary] = useState<TCompanySummary | null>(
    null
  );
  const [commentThread, setCommentThread] = useState<CommentProps[] | null>(
    null
  );

  const { data, loading, error, isNetworkError, refetch } =
    useFetch<PropertyRequestResponse>(`/agent_requests/${requestId}`);
  useRefetchOnEvent("refetchComments", () => refetch({ silent: true }));

  useEffect(() => {
    if (data) {
      const transformedData = transformPropertyRequestResponse(data);
      setAgentRequest(transformedData.agentRequest);
      setContributor(transformedData.contributor);
      setReadBy(transformedData.readByData);
      setCommentThread(transformedData.comments);
      setCompanySummary(transformedData.companySummary);
    }
  }, [data]);

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;
  if (!data)
    return (
      <div className="text-center text-text-secondary">No data available</div>
    );

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <BackButton>{agentRequest?.title || "Untitled Request"}</BackButton>
        <Button
          href="/community/agent-request/my-properties-request/create"
          size="sm"
          className="py-2 px-3"
        >
          Create Property Request
        </Button>
      </div>
      <div className="flex flex-col gap-y-5 gap-x-10 lg:flex-row lg:items-start">
        <div className="lg:w-[58%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <MoreDetailsCard propertyRequest={agentRequest} user={contributor} />
          <ThreadArticle
            propertyRequest={agentRequest}
            comments={commentThread || []}
            readByData={readBy}
            // slug={agentRequest?.slug ?? ""}
          /> 
          <PropertyRequestComments
            id={requestId as string}
            slug={agentRequest?.slug ?? ""}
            comments={commentThread || []}
            setComments={setComments}
          />
          <ThreadComments comments={commentThread || []} />
        </div>
        <div className="lg:flex-1 space-y-5 lg:max-h-screen overflow-x-hidden lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <ContributorDetails
            title="Requester Details"
            contributors={contributor}
            post={agentRequest}
            postedDate={agentRequest?.createdAt ?? ""}
          />
          {companySummary && <CompanySummary companySummary={companySummary} />}
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
