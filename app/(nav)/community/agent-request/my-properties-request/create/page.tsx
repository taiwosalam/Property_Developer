"use client";

import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  PropertyRequestFirstSection,
  PropertyRequestSecondSection,
} from "@/components/Community/ManageRequest";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { toast } from "sonner";
import { usePropertyRequestStore } from "@/store/createPropertyStore";
import { AuthForm } from "@/components/Auth/auth-components";
import { createPropertyRequest } from "../data";
import BackButton from "@/components/BackButton/back-button";
import Button from "@/components/Form/Button/button";
import { useGlobalStore } from "@/store/general-store";
import { ExclamationMark } from "@/public/icons/icons";
import { useTourStore } from "@/store/tour-store";

const placeholderText =
  "Please provide details about the type of property you're looking for. Kindly note that you are fully responsible for all content you post. Only real estate-related posts and genuine property requests are allowed. Irrelevant or unrelated content may be removed.";

const CreateMyPropertyRequest = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getGlobalInfoStore } = useGlobalStore();
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
        router.push("/community/agent-request/my-properties-request");
      }
    } catch (error) {
      console.error("Failed to create property request. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const pathname = usePathname();
  const {
    setShouldRenderTour,
    setPersist,
    isTourCompleted,
    goToStep,
    restartTour,
  } = useTourStore();

  useEffect(() => {
    setPersist(false);
    if (!isTourCompleted("CreateFacilityTour")) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [setShouldRenderTour, setPersist, isTourCompleted]);

  return (
    <>
      <AuthForm onFormSubmit={handleCreateClick} returnType="form-data">
        <div className="mb-16">
          <div className="flex gap-2 items-center">
            <BackButton>Create Property Request</BackButton>

            <button
              onClick={() => restartTour(pathname)}
              type="button"
              className="text-orange-normal"
            >
              <ExclamationMark />
            </button>
          </div>

          <div className="body w-full flex flex-col lg:flex-row justify-between mt-10 gap-10">
            <div className="first flex flex-col w-full lg:w-[60%]">
              <PropertyRequestFirstSection placeholderText={placeholderText} />
            </div>
            <div className="second flex flex-col w-full lg:w-[40%]">
              <PropertyRequestSecondSection />
            </div>
          </div>
        </div>
        <FixedFooter className="flex gap-6 justify-end">
          <Button
            type="submit"
            size="base_medium"
            disabled={
              isCreating ||
              !getGlobalInfoStore("canSubmit") ||
              !getGlobalInfoStore("isValidDateRange")
            }
            className="create-button py-2 px-8"
          >
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </FixedFooter>
      </AuthForm>
    </>
  );
};

export default CreateMyPropertyRequest;
