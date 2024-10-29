"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FirstSection,
  StateAndLocalGovt,
} from "@/components/Community/ManageRequest";
import Image from "next/image";
import { MAX_FILE_SIZE_MB } from "@/data";
import { DeleteIconOrange, PlusIcon } from "@/public/icons/icons";
import Input from "@/components/Form/Input/input";
import AddPhotoAndVideo from "@/components/Community/AddPhotoAndVideo";

const CreateArticle = () => {
  const router = useRouter();
  return (
    <>
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
            Create Article
          </h1>
        </div>
      </div>

      <div className="body w-full flex flex-col lg:flex-row justify-between mt-10 gap-10">
        <div className="first flex flex-col w-full lg:w-[60%]">
          <FirstSection inputValue="" showTextAreaPlaceholder={true} />
        </div>

        <div className="second flex flex-col w-full lg:w-[40%]">
          <SecondSection />
        </div>
      </div>
    </>
  );
};

export default CreateArticle;

const SecondSection = () => {
  return (
    <div className="bg-white dark:bg-darkText-primary p-4 rounded-lg flex flex-col gap-4">
      <AddPhotoAndVideo />
      <StateAndLocalGovt />
    </div>
  );
};
