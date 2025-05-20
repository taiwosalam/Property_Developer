"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  PropertyRequestFirstSection,
  PropertyRequestSecondSection,
  StateAndLocalGovt,
} from "@/components/Community/ManageRequest";
import AddPhotoAndVideo from "@/components/Community/AddPhotoAndVideo";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Comment from "../../../threads/[threadId]/preview/comment";
import ThreadComments from "@/components/Community/ThreadComments";
import { usePropertyRequestStore } from "@/store/createPropertyStore";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { deletePropertyRequest, updatePropertyRequest } from "../../../data";
import { AuthForm } from "@/components/Auth/auth-components";
import CommunityComments from "@/components/Community/CommunityComments";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { DeletePropertyRequestModal, DeletePropertyRequestModalSuccess } from "@/components/Modal/delete-inventory";
import Button from "@/components/Form/Button/button";
import PropertyRequestComments from "@/components/Community/PropertyRequestComments";

const desc =
  "#Commercial and retail real estate fundamentals are expected to remain strong due to the scarcity of new construction deliveries, prompting compelling opportunities for investors amid high interest rates and inflation in the market, writes CHINEDUM UWAEGBULAM. Despite economic headwinds and challenges with obtaining building permits, experts predict that the demand for housing will remain strong, and the market will see a steady increase in property values this year. There are also opportunities available for high-quality properties that meet the needs of investors and tenants, while low mortgage rates and government incentives will likely contribute to this optimistic outlook as inflation may remain a concern in 2024, affecting both home prices and mortgage rates.";

const ManageMyPropertyRequest = () => {
  const router = useRouter();
  const { id } = useParams();

  const { data, loading, error } = useFetch<{
    data: {
      PropertyRequest: any;
      comments: any;
    };
  }>(`/agent-community/property-requests/${id}`);

  const [propertyRequests, setPropertyRequests] = useState<any>([]);
  const [comments, setComments] = useState<any>([]);
  const [propertyRequestUser, setPropertyRequestUser] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    // 
    if (data?.data?.PropertyRequest) {
      setPropertyRequests(data.data.PropertyRequest);
      setComments(data.data.comments);
      setSlug(data.data.PropertyRequest.slug);
    }
  }, [data]);


  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deletePropertyRequest(id as string);
      if (response) {
        setShowSuccessModal(true);
        toast.success("Property request deleted successfully");
      } else {
        toast.error("Failed to delete property request");
      }
      router.push("/management/agent-community/my-properties-request");
    } catch (error) {
      toast.error("Failed to delete property request");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push("/management/agent-community/my-properties-request");
  };


  const { minBudget, maxBudget, resetBudgets } = usePropertyRequestStore();

  const handleUpdateMyProperty = async (data: any) => {
    if (minBudget !== null && maxBudget !== null && minBudget > maxBudget) {
      toast.error("Maximum budget cannot be less than minimum budget.");
      resetBudgets(); // Reset inputs to 0 or null
    } else {
      const updatedData = { ...data, _method: 'patch' };
      try {
        setIsUpdating(true);
        await updatePropertyRequest(id as string, updatedData);
        toast.success("Property request updated successfully");
        router.push(`/management/agent-community/my-properties-request/${id}/preview`);
      } catch (error) {
        toast.error("Failed to update property request");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
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
            Manage Property Request
          </h1>
        </div>
      </div>

    <AuthForm onFormSubmit={handleUpdateMyProperty}>  
      <div className="flex flex-col gap-y-5 gap-x-10 lg:flex-row lg:items-start">
        <div className="lg:w-[58%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <PropertyRequestFirstSection
            placeholderText=""
            data={propertyRequests}
          />
          <PropertyRequestComments 
            slug={slug}
            id={id as string}
            comments={comments} 
            setComments={setComments}
            edit
            />
        </div>

        <div className="lg:flex-1 space-y-5 lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar lg:pr-2">
          <PropertyRequestSecondSection 
            data={propertyRequests} 
          />
        </div>
      </div>
      <FixedFooter className="flex gap-6 justify-end">
         <Modal>
          <ModalTrigger asChild>
            <Button
              size="sm_medium"
              variant="blank"
              className="py-2 px-7 text-status-error-primary bg-status-error-1"
            >
              delete
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeletePropertyRequestModal 
              handleDelete={handleDelete} 
            />
          </ModalContent>
        </Modal>
        {showSuccessModal && 
        <DeletePropertyRequestModalSuccess 
          open={showSuccessModal} 
          handleClose={handleCloseSuccessModal} 
        />}
        <button
          type="submit"
          className="py-2 px-7 bg-brand-9 text-white rounded-[4px] text-sm font-medium"
        >
         {isUpdating ? "Updating..." : "Update"}
        </button>
        </FixedFooter>
      </AuthForm>
    </div>
  );
};
export default ManageMyPropertyRequest;
