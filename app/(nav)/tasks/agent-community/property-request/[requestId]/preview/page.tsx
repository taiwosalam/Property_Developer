"use client";

import BackButton from "@/components/BackButton/back-button";
import Image, { StaticImageData } from "next/image";
// import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {
  comments,
  propertyMoreDetails,
  propertySummaryData,
  readyByData,
  threadArticle,
} from "../../../data";
import { ChevronLeft, ThumbsDown, ThumbsUp } from "@/public/icons/icons";
import user1 from "@/public/empty/user1.svg";
import user2 from "@/public/empty/user2.svg";
import user3 from "@/public/empty/user3.svg";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import Comment from "../../../[threadId]/preview/comment";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

const PreviewPage = () => {
  const router = useRouter();
  const { requestId } = useParams();
  return (
    <div>
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
          <h1 className="text-black dark:text-white font-bold text-lg lg:text-xl">
            Property Title
          </h1>
        </div>
        <Button
          href={`/tasks/agent-community/property-request/${requestId}/manage`}
          size="sm"
          className="py-2 px-3"
        >
          Manage Property Request
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row justify-between w-full mt-4 gap-5">
        <div className="side1 flex w-full lg:w-[60%] flex-col">
          <ThreadArticle />
          <ThreadComments />
        </div>
        <div className="side2 w-full lg:w-[40%] flex flex-col gap-4">
          <SummaryCard />
          <MoreDetailsCard />
          <ReadyByCard />
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;

const ThreadArticle = () => {
  return (
    <div className="">
      {threadArticle.map((article, index) => (
        <p key={index} className="text-sm text-darkText-secondary mt-2">
          {article}
        </p>
      ))}
      <div className="flex justify-between mt-6">
        <div className="text-black font-semibold">Comments</div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1">
            <ThumbsUp />
            <p>57</p>
          </button>
          <button className="flex items-center gap-1">
            <ThumbsDown />
            <p>11</p>
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

export const ThreadComments = () => {
  return (
    <div className="mt-4">
      {comments.map((comment, index) => (
        <Comment key={comment.id} {...comment} />
      ))}
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

const MoreDetailsCard = () => {
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

const ReadyByCard = () => {
  return (
    <div className="bg-[#EFF6FF] dark:bg-darkText-primary rounded-lg p-4">
      <h4 className="text-black dark:text-white font-semibold text-sm">
        Ready By
      </h4>
      {readyByData.map((item, index) => (
        <div key={index} className="flex w-full gap-3 mt-3 justify-between">
          <div className="flex gap-1 items-center">
            <div className="imgWrapper h-10 w-10">
              <Image
                src={user2}
                alt="user"
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-black dark:text-white text-md font-semibold">
              {item.name}
            </p>
            <BadgeIcon color="blue" />
          </div>
          <p className="text-black dark:text-white text-sm"> {item.time} </p>
        </div>
      ))}
    </div>
  );
};
