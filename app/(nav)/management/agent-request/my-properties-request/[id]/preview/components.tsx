"use client";

import { ThumbsDown, ThumbsUp } from "@/public/icons/icons";
import Image from "next/image";
import user1 from "@/public/empty/user1.svg";
import user2 from "@/public/empty/user2.svg";
import user3 from "@/public/empty/user3.svg";
import { formatNumber } from "@/utils/number-formatter";
import { formatDateRange } from "../../../data";

export const ThreadArticle = ({
  propertyRequest,
}: {
  propertyRequest: any;
}) => {
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
            {propertyRequest?.commentsCount}
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1">
            <ThumbsUp />
            <p>{propertyRequest?.likesUp}</p>
          </button>
          <button className="flex items-center gap-1">
            <ThumbsDown />
            <p>{propertyRequest?.likesDown}</p>
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
              {propertyRequest?.likesUp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SECOND SIDE
export const SummaryCard = ({ agentRequest }: { agentRequest: any }) => {
  const propertySummaryData = [
    { label: "Posted Date", value: agentRequest?.createdAt },
    { label: "Last Updated", value: agentRequest?.startDate },
    { label: "Total Seen", value: agentRequest?.viewsCount },
    { label: "Total Comment", value: agentRequest?.commentsCount },
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

export const MoreDetailsCard = ({
  propertyRequest,
}: {
  propertyRequest: any;
}) => {
  const propertyMoreDetails = [
    {
      label: "State",
      value: propertyRequest?.state || "--- ---",
    },
    {
      label: "Local Governmemt",
      value: propertyRequest?.lga || "--- ---",
    },
    {
      label: "Category:",
      value: propertyRequest?.propertyCategory || "--- ---",
    },
    {
      label: "Property Type:",
      value: propertyRequest?.propertyType || "--- ---",
    },
    {
      label: "Sub Type:",
      value: propertyRequest?.propertySubType || "--- ---",
    },
    {
      label: "Min Budget:",
      value:
        `₦${formatNumber(Number(propertyRequest?.minBudget))}` || "--- ---",
    },
    {
      label: "Max Budget:",
      value:
        `₦${formatNumber(Number(propertyRequest?.maxBudget))}` || "--- ---",
    },
    {
      label: "Date Range:",
      value:
        formatDateRange(propertyRequest?.startDate, propertyRequest?.endDate) ||
        "__,__,__",
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
            <p className="dark:text-white text-black text-sm capitalize">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
