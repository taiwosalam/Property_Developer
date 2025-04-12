"use client";

import Image from "next/image";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ThumbsDown, ThumbsUp } from "@/public/icons/icons";
import user1 from "@/public/empty/user1.svg";
import user2 from "@/public/empty/user2.svg";
import user3 from "@/public/empty/user3.svg";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import ThreadComments from "@/components/Community/ThreadComments";
import ReadyByCard from "@/components/Community/ReadByCard";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import PropertyRequestComments from "@/components/Community/PropertyRequestComments";
import { formatDateRange } from "../../../data";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";

interface PropertyRequestResponse {
  data: {
    PropertyRequest: any;
    readByData: any;
    comments: any;
  };
}

const PreviewPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [propertyRequest, setPropertyRequest] = useState<any>(null);
  const [readBy, setReadBy] = useState<any>(null);
  const [comments, setComments] = useState<any>([]);
  const [slug, setSlug] = useState("");
  const { data, loading, isNetworkError, error, refetch } =
    useFetch<PropertyRequestResponse>(
      `/agent-community/property-requests/${id}`
    );
  useRefetchOnEvent("refetchComments", () => refetch({ silent: true }));

  useEffect(() => {
    if (data) {
      setPropertyRequest(data.data.PropertyRequest);
      setReadBy(data.data.readByData);
      setSlug(data.data.PropertyRequest.slug);
      setComments(data.data.comments);
    }
  }, [data]);

  // console.log(propertyRequest);
  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

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
            {propertyRequest?.title || "___"}
          </h1>
        </div>
        <Button
          href={`/management/agent-community/my-properties-request/${id}/manage`}
          size="sm"
          className="py-2 px-3"
        >
          Manage Property Request
        </Button>
      </div>
      <div className="flex flex-col gap-y-5 gap-x-10 lg:flex-row lg:items-start">
        <div className="lg:w-[58%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <ThreadArticle propertyRequest={propertyRequest} />
          {/* <ThreadComments /> */}
          <PropertyRequestComments
            id={id as string}
            slug={slug}
            comments={comments}
            setComments={setComments}
          />
        </div>
        <div className="lg:flex-1 space-y-5 lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <SummaryCard propertyRequest={propertyRequest} />
          <MoreDetailsCard propertyRequest={propertyRequest} />
          <ReadyByCard data={readBy} />
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;

const ThreadArticle = ({ propertyRequest }: { propertyRequest: any }) => {
  return (
    <div className="">
      <div
        dangerouslySetInnerHTML={{
          __html: propertyRequest?.description || "___",
        }}
      />
      <div className="flex justify-between mt-6">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary">Comments</span>
          <p className="text-white text-xs font-semibold rounded-full bg-brand-9 px-3 py-[2px]">
            {propertyRequest?.comments_count}
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1">
            <ThumbsUp />
            <p>{propertyRequest?.likes_up}</p>
          </button>
          <button className="flex items-center gap-1">
            <ThumbsDown />
            <p>{propertyRequest?.likes_down}</p>
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
              {propertyRequest?.likes_up}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SECOND SIDE
const SummaryCard = ({ propertyRequest }: { propertyRequest: any }) => {
  const propertySummaryData = [
    { label: "Posted Date", value: propertyRequest?.created_at },
    { label: "Last Updated", value: propertyRequest?.updated_at },
    { label: "Total Seen", value: propertyRequest?.views_count },
    { label: "Total Comment", value: propertyRequest?.comments_count },
  ];
  return (
    <div className="bg-white dark:bg-darkText-primary rounded-lg p-4">
      <h3> Summary </h3>
      <div className="flex flex-col mt-4 gap-2">
        {propertySummaryData.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 items-start justify-between w-full"
          >
            <p className="text-[#747474] text-sm">{item.label}</p>
            <p className="dark:text-white text-black text-sm">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const MoreDetailsCard = ({ propertyRequest }: { propertyRequest: any }) => {
  const propertyMoreDetails = [
    {
      label: "Target Audience:",
      value: propertyRequest?.target_audience?.join(", ") || "--- ---",
    },
    {
      label: "Category:",
      value: propertyRequest?.property_category || "--- ---",
    },
    {
      label: "Property Type:",
      value: propertyRequest?.property_type || "--- ---",
    },
    {
      label: "Sub Type:",
      value: propertyRequest?.property_sub_type || "--- ---",
    },
    {
      label: "Min Budget:",
      value: `₦${propertyRequest?.min_budget}` || "--- ---",
    },
    {
      label: "Max Budget:",
      value: `₦${propertyRequest?.max_budget}` || "--- ---",
    },
    {
      label: "Date Range:",
      value:
        formatDateRange(
          propertyRequest?.start_date,
          propertyRequest?.end_date
        ) || "__,__,__",
    },
  ];
  return (
    <div className="bg-white dark:bg-darkText-primary rounded-lg p-4">
      <div className="flex flex-col mt-4 gap-2">
        {propertyMoreDetails.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 items-start justify-between w-full"
          >
            <p className="text-[#747474] text-sm">{item.label}</p>
            <p className="dark:text-white text-black text-sm">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
