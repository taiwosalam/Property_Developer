"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  PropertyRequestFirstSection,
  StateAndLocalGovt,
} from "@/components/Community/ManageRequest";
import AddPhotoAndVideo from "@/components/Community/AddPhotoAndVideo";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { AuthForm } from "@/components/Auth/auth-components";
import { createArticle, transformFormArticleData } from "../data";
import { toast } from "sonner";

const CreateArticle = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleSubmit = async (formData: FormData) => {
    // Parse and append target_audience as an array
    const targetAudience = formData.get("target_audience");
    if (typeof targetAudience === "string") {
      const audienceArray = targetAudience.split(",").slice(0, 60); // Split into an array and limit to 60 items
      audienceArray.forEach((audience) => formData.append("target_audience[]", audience.trim()));
    }

    imageFiles.forEach((file) => formData.append("pictures[]", file));
  
    const transformedData = transformFormArticleData(formData);
    console.log("Submitting:", transformedData);
  
    setIsCreating(true); 
    try {
      const success = await createArticle(formData);
      if (success) {
        toast.success("Article created successfully!");
        router.push("/tasks/agent-community/my-articles");
      } else {
        toast.error("Failed to create the article.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the article.");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };
  
  

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
       returnType="form-data"
       onFormSubmit={handleSubmit}
          className="custom-flex-col gap-5"
          setValidationErrors={() => { }}
        >
          <div className="body w-full flex flex-col lg:flex-row justify-between mt-10 gap-10">
            <div className="first flex flex-col w-full lg:w-[60%]">
              <PropertyRequestFirstSection placeholderText="Please be aware that you are responsible for all posts or uploads you make. Post Real Estate, Property related Articles and stay on topic." />
            </div>

            <div className="second flex flex-col w-full lg:w-[40%]">
              <SecondSection setImageFiles={setImageFiles} />
            </div>
          </div>
          <FixedFooter className="flex gap-6 justify-end">
            <button
              type="submit"
              disabled={isCreating}
              className="py-2 px-7 bg-brand-9 text-white rounded-[4px] text-sm font-medium"
            >
             { isCreating ? "Creating..." : "Create" }
            </button>
          </FixedFooter>
        </AuthForm>
      </div>
    </>
  );
};

export default CreateArticle;

const SecondSection = ({setImageFiles}: {setImageFiles: (files: File[]) => void}) => {
  return (
    <div className="bg-white dark:bg-darkText-primary p-4 rounded-lg flex flex-col gap-4">
    <AddPhotoAndVideo onFilesChange={(files) => setImageFiles(files)} />
      <StateAndLocalGovt />
    </div>
  );
};
