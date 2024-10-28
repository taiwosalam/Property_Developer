"use client";

import BackButton from "@/components/BackButton/back-button";
import Image, { StaticImageData } from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { comments, companyStats, threadArticle } from "../../../data";
import { ChevronLeft, FbIcon, InstagramIcon, Mail, MapIcon, PhoneIcon, SocialWebIcon, ThumbsDown, ThumbsUp, TwitterIcon, WebsiteIcon } from "@/public/icons/icons";
import user1 from "@/public/empty/user1.svg";
import user2 from "@/public/empty/user2.svg";
import user3 from "@/public/empty/user3.svg";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import SampleUser from "@/public/empty/sample-user.svg";
import CompanyLogo from "@/public/empty/company-logo.svg";
import Comment from "../../../[threadId]/preview/comment";

const PreviewPage = () => {
  const router = useRouter();
  const { threadId } = useParams();
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
          href={`/tasks/agent-community/${threadId}/create`}
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

const ThreadComments = () => {
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
  return <div className="bg-white dark:bg-dark-100 rounded-lg p-4">SummaryCard</div>;
};

