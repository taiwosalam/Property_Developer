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
import { comments, companyStats, threadArticle } from "../../data";
import {
  ChevronLeft,
  FbIcon,
  InstagramIcon,
  Mail,
  MapIcon,
  PhoneIcon,
  SocialWebIcon,
  ThumbsDown,
  ThumbsUp,
  TwitterIcon,
  WebsiteIcon,
} from "@/public/icons/icons";
import user1 from "@/public/empty/user1.svg";
import user2 from "@/public/empty/user2.svg";
import user3 from "@/public/empty/user3.svg";
import Comment from "./comment";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Form/Button/button";
import SampleUser from "@/public/empty/sample-user.svg";
import CompanyLogo from "@/public/empty/company-logo.svg";

const ThreadPreview = () => {
  const router = useRouter();
  const { threadId } = useParams();
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
          href={`/tasks/agent-community/${threadId}/create`}
          size="sm"
          className="py-2 px-3"
        >
          Create Article
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row justify-between w-full mt-4 gap-5">
        <div className="side1 flex w-full lg:w-[60%] flex-col">
          <div className="slider h-[250px] md:h-[300px] lg:h-[350px] w-full relative px-[20px] md:px-[35px]">
            <PropertyImageSlider images={sampleImages} thread />
          </div>
          <ThreadArticle />
          <ThreadComments />
        </div>
        <div className="side2 w-full lg:w-[40%] flex flex-col gap-4">
          <ContributorDetails />
          <CompanySummary />
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
const ContributorDetails = () => {
  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg">
      <h2 className="text-black font-semibold text-lg dark:text-white">
        Contributor Details
      </h2>
      <div className="flex flex-col mt-4 gap-2">
        <div className="flex gap-4">
          <p className="text-[#747474] text-sm"> Posted Date </p>
          <p className="dark:text-white text-black text-sm"> 12/10/2024 </p>
        </div>
        <div className="flex gap-4">
          <p className="text-[#747474] text-sm"> Last Updated </p>
          <p className="dark:text-white text-black text-sm"> 12/10/2024 </p>
        </div>
        <div className="flex gap-4">
          <p className="text-[#747474] text-sm"> Target Audience </p>
          <p className="dark:text-white text-black text-sm">
            All State, All Logal Government Area
          </p>
        </div>
      </div>
      <ContributorUser />
    </div>
  );
};

const ContributorUser = () => {
  return (
    <div className="flex flex-col mt-6 gap-4">
      <div className="flex gap-4">
        <div className="imgWrapper h-[154px] w-[154px]">
          <Image src={SampleUser} alt="user" width={300} height={300} />
        </div>
        <div className="userDetails flex flex-col gap-1">
          <p className="dark:text-white text-black text-[25px] font-bold">
            {" "}
            ESV Taiwo Salami{" "}
          </p>
          <p className="text-brand-9 text-sm"> Estate Surveyor & Valuer </p>
          <p className="text-white bg-[#003DAD] px-2 py-1 text-xs w-fit rounded-lg">
            Manager
          </p>
          <p className="text-sm"> Contact : +2348100000000 </p>
          <p className="text-sm"> Email Address: emailaddress@gmail.com </p>
        </div>
      </div>
      <div className="desc text-sm">
        <p>
          A multi-family home, also know as a duplex, triplex, or multi-unit
          building, is a residential property that living read more. They want
          to work with their budget in booking an appointment. They wants to
          ease themselves of the stress of having to que, and also reduce the
          time spent searching for something new. They wants to ease themselves
          of the stress of having to que, and also reduce the time spent
          searching for something new.
        </p>
      </div>
      <div className="btn flex items-center justify-center w-full">
        <button className="w-1/2 text-sm border border-brand-9 text-brand-9 px-4 py-1 rounded-lg">
          Message
        </button>
      </div>
    </div>
  );
};

const CompanySummary = () => {
  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg">
      <h2 className="text-black font-semibold text-lg dark:text-white">
        Company Summary
      </h2>
      <div className="flex items-center justify-center w-full mt-4">
        <div className="flex items-center justify-center w-[260px] h-[70px] border border-brand-9 py-2 rounded-lg">
          <Image
            src={CompanyLogo}
            alt="company logo"
            width={500}
            height={500}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="details mt-3">
        <h3 className="text-black leading-50 font-bold text-6 dark:text-white">
          {" "}
          Pat Onukwuli & Co.{" "}
        </h3>
        <div className="service flex flex-col gap-1 mt-1">
          <p> Services </p>
          <p className="text-sm text-text-disabled">
            {" "}
            Sales, Purchase, Rent of Resident Property & Commercial Property{" "}
          </p>
        </div>
        <div className="contacts-details flex flex-col gap-3 mt-4">
          <p> Contacts </p>
          <div className="flex gap-2 text-sm text-text-disabled">
            <MapIcon />
            <span> States and Local Govt. </span>
          </div>
          <div className="flex gap-2 text-sm text-text-disabled">
            <WebsiteIcon />
            <span> https://www.hprealestate.co.in </span>
          </div>
          <div className="flex gap-2 text-sm text-text-disabled">
            <PhoneIcon />
            <span>08132086958 || 09123435487 || 9848848488 </span>
          </div>
          <div className="flex gap-2 text-sm text-text-disabled">
            <Mail />
            <span> emailaddress@gmail.com </span>
          </div>
        </div>
      </div>
      <div className="socials flex gap-2 mt-4">
        <div className="circle rounded-full p-2 border border-black dark:border-white w-fit">
          <FbIcon />
        </div>
        <div className="circle rounded-full p-2 border border-black dark:border-white   w-fit">
          <TwitterIcon />
        </div>
        <div className="circle rounded-full p-2 border border-black dark:border-white w-fit">
          <InstagramIcon />
        </div>
        <div className="circle rounded-full p-2 border border-black dark:border-white w-fit">
          <SocialWebIcon />
        </div>
      </div>

      {/* Joined */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex flex-col gap-2 mt-4">
          {companyStats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <p className="text-sm text-text-label">{stat.label}</p>
              <p className="text-sm text-text-primary dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
