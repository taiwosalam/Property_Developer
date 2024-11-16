"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  PropertyRequestFirstSection,
  PropertyRequestSecondSection,
  StateAndLocalGovt,
} from "@/components/Community/ManageRequest";
import AddPhotoAndVideo from "@/components/Community/AddPhotoAndVideo";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { AuthForm } from "@/components/Auth/auth-components";
import { createArticle } from "../data";

const CreateArticle = () => {
  const router = useRouter();

  const handleSubmit = async (data: FormData) => {
    const res = await createArticle(data);
  }

  return (
    <>
      <div className="wra mb-16">
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
        <AuthForm
          // returnType="form-data"
          className="custom-flex-col gap-5"
          onFormSubmit={handleSubmit}
          setValidationErrors={() => { }}
        >
          <div className="body w-full flex flex-col lg:flex-row justify-between mt-10 gap-10">
            <div className="first flex flex-col w-full lg:w-[60%]">
              <PropertyRequestFirstSection placeholderText="Please be aware that you are responsible for all posts or uploads you make. Post Real Estate, Property related Articles and stay on topic." />
            </div>

            <div className="second flex flex-col w-full lg:w-[40%]">
              <SecondSection />
            </div>
          </div>
          <FixedFooter className="flex gap-6 justify-end">
            <button
              type="submit"
              className="py-2 px-7 bg-brand-9 text-white rounded-[4px] text-sm font-medium"
            >
              Create
            </button>
          </FixedFooter>
        </AuthForm>
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
