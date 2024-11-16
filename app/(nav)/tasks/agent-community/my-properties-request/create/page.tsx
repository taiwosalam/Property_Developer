"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  PropertyRequestFirstSection,
  PropertyRequestSecondSection,
} from "@/components/Community/ManageRequest";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { toast } from "sonner";
import { usePropertyRequestStore } from "@/store/createPropertyStore";
import { AuthForm } from "@/components/Auth/auth-components";
import { createPropertyRequest } from "../data";

const CreateMyPropertyRequest = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { minBudget, maxBudget, resetBudgets } = usePropertyRequestStore();

  const handleCreateClick = async (data: Record<string, any>) => {
    setIsCreating(true);
    try {
      if (minBudget !== null && maxBudget !== null && minBudget > maxBudget) {
        toast.error("Maximum budget cannot be less than minimum budget.");
        resetBudgets();
        return;
      }
      const result = await createPropertyRequest(data);
      if (result) {
        toast.success("Property request created successfully");
        router.push("/tasks/agent-community/my-properties-request");
      }
    } catch (error) {
      toast.error("Failed to create property request. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
    <AuthForm 
    // setValidationErrors={() => {}}
     onFormSubmit={handleCreateClick}
     returnType="form-data"
    >
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
              Create Property Request
            </h1>
          </div>
        </div>

        <div className="body w-full flex flex-col lg:flex-row justify-between mt-10 gap-10">
          <div className="first flex flex-col w-full lg:w-[60%]">
            <PropertyRequestFirstSection placeholderText="Please be aware that you are responsible for all posts. Post Real Estate, Property request only." />
          </div>
          <div className="second flex flex-col w-full lg:w-[40%]">
            <PropertyRequestSecondSection />
          </div>
        </div>
      </div>
      <FixedFooter className="flex gap-6 justify-end">
        <button
          type="button"
          className="py-2 px-7 bg-[#FDE9EA] text-[#E9212E] rounded-[4px] text-sm font-medium"
        >
          Delete
        </button>
        <button
          type="submit"
          className="py-2 px-7 bg-brand-9 text-white rounded-[4px] text-sm font-medium"
        >
          { isCreating ? "Creating..." : "Create" }
        </button>
        </FixedFooter>
      </AuthForm>
    </>
  );
};

export default CreateMyPropertyRequest;
