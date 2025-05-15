"use client";

import Image from "next/image";
import "keen-slider/keen-slider.min.css";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import ThreadComments from "@/components/Community/ThreadComments";
import ReadyByCard from "@/components/Community/ReadByCard";
import { useEffect, useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import PropertyRequestComments from "@/components/Community/PropertyRequestComments";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";
import {
  Contributor,
  PropertyRequest,
  PropertyRequestResponse,
} from "../../../[requestId]/preview/types";
import { transformPropertyRequestResponse } from "../../../[requestId]/preview/data";
import BackButton from "@/components/BackButton/back-button";
import { formatNumber } from "@/utils/number-formatter";
import { MoreDetailsCard, SummaryCard, ThreadArticle } from "./components";
import { CommentProps } from "@/app/(nav)/accountant/management/agent-community/type";

const PreviewPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [agentRequest, setAgentRequest] = useState<PropertyRequest | null>(
    null
  );
  const [readBy, setReadBy] = useState<any>(null);
  const [contributor, setContributor] = useState<Contributor | null>(null);
  const [comments, setComments] = useState<any>([]);
  const [commentThread, setCommentThread] = useState<CommentProps[] | null>(null)

  const { data, loading, error, isNetworkError, refetch } =
    useFetch<PropertyRequestResponse>(`/agent_requests/${id}`);
  useRefetchOnEvent("refetchComments", () => refetch({ silent: true }));


  useEffect(() => {
    if (data) {
      const transformedData = transformPropertyRequestResponse(data);
      setAgentRequest(transformedData.agentRequest);
      setContributor(transformedData.contributor);
      setReadBy(transformedData.readByData);
      setCommentThread(transformedData.comments);
    }
  }, [data]);

  console.log(commentThread)

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
        <BackButton>{agentRequest?.title || "--- ---"}</BackButton>
        <Button
          href={`/management/agent-community/my-properties-request/${id}/manage`}
          size="sm"
          className="py-2 px-8"
        >
          Manage Property Request
        </Button>
      </div>
      <div className="flex flex-col gap-y-5 gap-x-10 lg:flex-row lg:items-start">
        <div className="lg:w-[58%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <ThreadArticle propertyRequest={agentRequest} readByData={readBy}/>
          <ThreadComments comments={commentThread || []} slug={agentRequest?.slug}/>
          <PropertyRequestComments
            id={id as string}
            slug={agentRequest?.slug ?? ""}
            comments={comments}
            setComments={setComments}
          />
        </div>
        <div className="lg:flex-1 space-y-5 lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <SummaryCard agentRequest={agentRequest} />
          <MoreDetailsCard propertyRequest={agentRequest} />
          <ReadyByCard data={readBy} />
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
