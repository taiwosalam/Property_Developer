"use client";

// import BackButton from "@/components/BackButton/back-button";
import Image, { StaticImageData } from "next/image";
// import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Sample from "@/public/empty/SampleProperty.jpeg";
import Sample2 from "@/public/empty/SampleProperty2.jpeg";
import Sample3 from "@/public/empty/SampleProperty3.jpeg";
import Sample4 from "@/public/empty/SampleProperty4.png";
import Sample5 from "@/public/empty/SampleProperty5.jpg";
import { PropertyImageSlider } from "@/components/Management/Rent And Unit/rental-property-card";
import { ChevronLeft, ThumbsDown, ThumbsUp } from "@/public/icons/icons";
import user1 from "@/public/empty/user1.svg";
import user2 from "@/public/empty/user2.svg";
import user3 from "@/public/empty/user3.svg";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import {
  comments,
  companyStats,
  MyArticleSummaryData,
  threadArticle,
} from "../../../data";
import Comment from "@/components/tasks/announcements/comment";
import ReadyByCard from "@/components/Community/ReadByCard";

const ThreadPreview = () => {
  const router = useRouter();
  const { myArticleId } = useParams();
  const sampleImages: StaticImageData[] = [
    Sample,
    Sample2,
    Sample3,
    Sample4,
    Sample5,
  ];
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
            Rent Increase & Maintenance
          </h1>
        </div>
        <Button
          href={`/tasks/agent-community/my-articles/${myArticleId}/manage`}
          size="sm"
          className="py-2 px-3"
        >
          Manage Article
        </Button>
      </div>
      <div className="flex flex-col gap-y-5 gap-x-10 lg:flex-row lg:items-start">
        <div className="lg:w-[58%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <div className="slider h-[250px] md:h-[300px] lg:h-[350px] w-full relative px-[20px] md:px-[35px]">
            <PropertyImageSlider images={sampleImages} thread />
          </div>
          <ThreadArticle />
          <ThreadComments />
        </div>
        <div className="lg:flex-1 space-y-5 lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <Summary />
          <ReadyByCard />
        </div>
      </div>
    </div>
  );
};

export default ThreadPreview;

const ThreadArticle = () => {
  return (
    <div className="mt-4">
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
const Summary = () => {
  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg">
      <h2 className="text-black font-semibold text-lg dark:text-white">
        Summary
      </h2>
      <div className="flex flex-col mt-4 gap-2">
        {MyArticleSummaryData.map((item, index) => (
          <div
            className="flex gap-4 justify-between w-full items-start"
            key={index}
          >
            <p className="text-[#747474] text-sm w-1/2">{item.label}</p>
            <p className="dark:text-white text-black text-sm flex items-start w-1/2">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
