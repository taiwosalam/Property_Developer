"use client";

import Image from "next/image";
import "keen-slider/keen-slider.min.css";
import {
  propertyMoreDetails,
  propertySummaryData,
  threadArticle,
} from "../../../data";
import { ChevronLeft, ThumbsDown, ThumbsUp } from "@/public/icons/icons";
import user1 from "@/public/empty/user1.svg";
import user2 from "@/public/empty/user2.svg";
import user3 from "@/public/empty/user3.svg";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import ThreadComments from "@/components/Community/ThreadComments";
import { ContributorDetails } from "@/components/Community/Contributor";
import CompanySummary from "@/components/Community/CompanySummary";
import useFetch from "@/hooks/useFetch";
import { useState, useEffect } from "react";
import { formatDateRange } from "../../data";
import PropertyRequestComments from "@/components/Community/PropertyRequestComments";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

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
  const { data, loading, error, refetch: refetchComments } = useFetch<PropertyRequestResponse>(`/agent-community/property-requests/${requestId}`);
  useRefetchOnEvent("refetchComments", ()=> refetchComments({silent:true}));

  useEffect(() => {
    if (data) {
      setPropertyRequest(data.data.PropertyRequest);
      setUser(data.data.contributor);
      setReadByData(data.data.readByData);
      setComments(data.data.comments);
      setCompanySummary(data.data.company_summary);
      // console.log("data", data);
    }
  }, [data]);
  // console.log(data?.data.PropertyRequest);
  // console.log('comments', comments);

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
          <h1 className="text-black dark:text-white font-bold text-lg lg:text-xl">
            {propertyRequest?.title}
          </h1>
        </div>
        <Button
          href={`/tasks/agent-community/my-properties-request/create`}
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
            user={user} 
          />
          <ThreadArticle 
            propertyRequest={propertyRequest} 
          />
          <PropertyRequestComments 
            id={requestId as string}
            comments={data?.data.comments}
            setComments={setComments}
          />
        </div>
        <div className="lg:flex-1 space-y-5 lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <ContributorDetails
            title="Requester Details"
            contributors={user}
            post={propertyRequest}
            targetAudience={propertyRequest?.target_audience?.join(', ')}
            postedDate={propertyRequest?.created_at}
            updatedDate={propertyRequest?.updated_at}
          />
          <CompanySummary
            companySummary={companySummary}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;

const ThreadArticle = ({ propertyRequest }: { propertyRequest: any }) => {
  useEffect(() => {
    console.log("propertyRequest", propertyRequest);
  }, [propertyRequest]);
  return (
    <div className="">
        <div dangerouslySetInnerHTML={{ __html: propertyRequest?.description }} className="text-sm text-darkText-secondary mt-6" />
      <div className="flex justify-between mt-6">
      <div className="flex items-center gap-2">
          <span className="text-text-secondary">Comments</span>
          <p className="text-white text-xs text-center font-semibold rounded-full bg-brand-9 px-3 py-[2px]">{propertyRequest?.comments_count }</p>
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
              +122
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SECOND SIDE
const SummaryCard = () => {
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

const MoreDetailsCard = ({ propertyRequest, user }: { propertyRequest: any, user: any }) => {
  const propertyMoreDetails = [
    { label: "Location:", value: propertyRequest?.target_audience?.join(', ') },
    { label: "Category:", value: propertyRequest?.property_category },
    { label: "Property Type:", value: propertyRequest?.property_type },
    { label: "Sub Type:", value: propertyRequest?.sub_type },
    { label: "Min Budget:", value: `₦${propertyRequest?.min_budget}` },
    { label: "Max Budget:", value: `₦${propertyRequest?.max_budget}` },
    { label: "Date Range:", value: formatDateRange(propertyRequest?.start_date, propertyRequest?.end_date) },
  ];
  return (
    <div className="bg-white dark:bg-darkText-primary rounded-lg p-4">
      <div className="flex flex-col mt-4 gap-2">
        {propertyMoreDetails.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 items-start justify-between w-full"
          >
            <p className="text-[#747474] text-sm">{item.label || '__'}</p>
            <p className="dark:text-white text-black text-sm">{item.value || '__'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
