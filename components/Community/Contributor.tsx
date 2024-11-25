import Image from "next/image";
import SampleUser from "@/public/empty/sample-user.svg";
import { empty } from "@/app/config";
import { TextSkeleton } from "@/app/(nav)/tasks/agent-community/components";
import { formatDate } from "@/app/(nav)/tasks/agent-community/property-request/data";
import { useEffect } from "react";

export const ContributorDetails = ({ 
  title, 
  loading, 
  post, 
  contributors, 
  targetAudience, 
  postedDate, 
  updatedDate 
}: { 
  title: string, 
  loading?: boolean, 
  post?: any, 
  contributors?: any, 
  targetAudience?: string, 
  postedDate?: string, 
  updatedDate?: string 
}) => {

  useEffect(() => {
    console.log("post", post);
  }, [post]);

  if (loading) {
    return (
      <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="flex flex-col mt-4 gap-2">
          <div className="flex gap-4">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <ContributorUserSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md dark:bg-darkText-primary p-4 rounded-lg">
      <h2 className="text-black font-semibold text-lg dark:text-white">
        {title}
      </h2>
      <div className="flex flex-col mt-4 gap-2">
        <div className="flex gap-4">
          <p className="text-[#747474] text-sm"> Posted Date </p>
          <p className="dark:text-white text-black text-sm">
            {post?.created_at || <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse inline-block" />}
          </p>
        </div>
        <div className="flex gap-4">
          <p className="text-[#747474] text-sm"> Last Updated </p>
          <p className="dark:text-white text-black text-sm">
            {post?.updated_at || <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse inline-block" />}
          </p>
        </div>
        <div className="flex gap-4">
          <p className="text-[#747474] text-sm"> Target Audience </p>
          <p className="dark:text-white text-black text-sm">
            {targetAudience || <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse inline-block" />}
          </p>
        </div>
      </div>
      <ContributorUser contributors={contributors} />
    </div>
  );
};

const ContributorUser = ({ contributors }: { contributors: any }) => {
  
  return (
    <div className="flex flex-col mt-6 gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="imgWrapper h-[154px] w-[154px] mx-auto md:mx-0">
          <Image src={contributors?.picture || empty} alt="user" width={300} height={300} className="w-full h-full object-cover" />
        </div>
        <div className="userDetails flex flex-col gap-1">
          <p className="dark:text-white text-black text-[25px] font-bold">
            {contributors?.name || "___"}
          </p>
          <div className="flex flex-row lg:flex-col gap-2">
            <p className="text-brand-9 text-sm"> {contributors?.title || "___"} </p>
            <p className="text-white bg-[#003DAD] px-2 py-1 text-xs w-fit rounded-lg">
              {contributors?.role || "___"}
            </p>
          </div>
          <p className="text-sm"> Contact : {contributors?.phone_number || "___"} </p>
          <p className="text-sm"> Email Address: {contributors?.email || "___"} </p>
        </div>
      </div>
      <div className="desc text-sm">
        <p>
          { contributors?.bio || <TextSkeleton />  }
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

const ContributorUserSkeleton = () => {
  return (
    <div className="flex flex-col mt-6 gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="h-[154px] w-[154px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto md:mx-0" />
        <div className="flex flex-col gap-2">
          <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="flex flex-row lg:flex-col gap-2">
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="w-40 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="flex items-center justify-center w-full">
        <div className="w-1/2 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default ContributorDetails;
