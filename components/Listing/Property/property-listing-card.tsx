"use client";

import React, { useState } from "react";

// Types
import type { PropertyListingCardProps } from "./types";
import type { ButtonProps } from "@/components/Form/Button/types";

// Images
import { CameraIcon, VideoIcon } from "@/public/icons/icons";
import SampleProperty6 from "@/public/empty/SampleProperty6.jpg";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { property_listing_data, property_listing_status } from "./data";
import { SectionSeparator } from "@/components/Section/section-components";

import {
  PropertyListingRed,
  PropertyListingLabelID,
  PropertyListingParagraph,
  PropertyListingTitleDesc,
} from "./property-listing-component";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import Link from "next/link";
import { Modal, ModalContent } from "@/components/Modal/modal";
import ListingFlow from "@/components/Settings/Modals/listing-otp-flow";
import { useRouter } from "next/navigation";
import { deleteProperty } from "@/app/(nav)/management/properties/[id]/edit-property/data";
import { toast } from "sonner";
import { empty } from "@/app/config";

const PropertyListingCard: React.FC<PropertyListingCardProps> = ({
  data,
  status,
  propertyType,
  page,
}) => {
  const button_props: ButtonProps = {
    size: "sm_medium",
    className: "py-2 px-8",
  };

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const color = property_listing_status[status];

  const [isDeleting, setIsDeleting] = useState(false);

  const [isOpened, setIsOpened] = useState(false);

  const hanldeOpen = () => {
    console.log("open modal");
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!data.id) {
      return;
    }
    setIsDeleting(true);
    try {
      const success = await deleteProperty(data.id);
      if (success) {
        toast.success("Property deleted");
        window.dispatchEvent(new Event("refetchPropertyDraft"));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // switch case for route
  const getContinueRoute = () => {
    switch (page) {
      case "manager":
        return `/manager/management/properties/${data.id}/edit-property`;
      case "account":
        return `/account/management/properties/${data.id}/edit-property`;
      default:
        return `/management/properties/${data.id}/edit-property`;
    }
  };

  // switch case for preview route
  const getPreviewRoute = () => {
    switch (page) {
      case "manager":
        return `/manager/management/properties/${data.id}`;
      case "account":
        return `/account/management/properties/${data.id}`;
      default:
        return `/management/properties/${data.id}`;
    }
  };

  return (
    <div
      className="p-6 pb-0 rounded-2xl bg-white dark:bg-darkText-primary custom-flex-col gap-4"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex items-center gap-6 justify-between">
        <PropertyListingLabelID id={data.id} type={propertyType} />
        <div
          className="w-5 h-5 rounded-full"
          style={{ backgroundColor: color || "#ebeef0" }}
        ></div>
      </div>
      <SectionSeparator />
      <div className="pb-6 overflow-x-auto custom-round-scrollbar">
        <div className="min-w-[800px] custom-flex-col gap-4">
          <div className="flex items-center gap-6 justify-between">
            <div className="flex flex-1">
              <KeyValueList
                chunkSize={4}
                data={data as any}
                referenceObject={property_listing_data}
              />
            </div>
            <div
              onClick={() => setIsOpened(true)}
              className="relative rounded-2xl overflow-hidden"
            >
              <Picture
                src={data.images ? data.images[0] : empty}
                alt="property preview"
                width={220}
                height={204}
              />
              <PopupImageModal
                isOpen={isOpened}
                images={
                  data.images &&
                  data.images.map((image: any) => ({
                    src: image,
                    isVideo: false,
                  }))
                }
                onClose={() => setIsOpened(false)}
                currentIndex={0}
              />
              <div
                style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                className="absolute inset-0 custom-flex-col justify-between p-3"
              >
                <div className="flex justify-end">
                  <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1.5">
                    <CameraIcon />
                    <p className="text-black dark:text-white font-medium text-[10px]">
                      +{data.images?.length ?? 0}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  {/* <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1.5">
                    <CameraIcon />
                    <p className="text-black dark:text-white font-medium text-[10px]">
                      {data.images?.length ?? 0}
                    </p>
                  </div> */}
                  {data.video_link && (
                    <div className="bg-brand-1 dark:bg-darkText-primary dark:text-white rounded py-1 px-1.5 gap-1.5 flex items-center">
                      <VideoIcon />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <SectionSeparator />
          <div className="flex items-center gap-[10%] justify-between">
            <div className="custom-flex-col flex-1">
              {status === "draft" ? (
                <PropertyListingParagraph>
                  <p className="text-red-500">
                    Property creation is not yet complete.
                  </p>
                </PropertyListingParagraph>
              ) : // ) : status === "awaiting" || status === "unpublished" ? (
              //   <PropertyListingParagraph>
              //     Created By : Ajadi David -- Moniya Branch
              //   </PropertyListingParagraph>
              // ) : status === "moderation" ? (
              //   <PropertyListingRed>
              //     Please review the property settings and replace the picture,
              //     as it appears to have been mistakenly used for another
              //     property.
              //   </PropertyListingRed>
              status === "request" ? (
                <PropertyListingTitleDesc
                  title={
                    data?.company_name || "Taiwo Salam & Co. Properties Ltd"
                  }
                  desc="Requests permission to add and manage this property in their portfolio."
                />
              ) : null}
            </div>
            <div className="flex gap-3 items-center">
              {status === "draft" ? (
                <>
                  <Button
                    variant="light_red"
                    {...button_props}
                    onClick={handleDelete}
                  >
                    {isDeleting ? "please wait" : "delete"}
                  </Button>
                  <Button
                    {...button_props}
                    href={getContinueRoute()}
                  >
                    continue
                  </Button>
                </>
              ) : // ) : status === "unpublished" ? (
              //   <>
              //     <Button variant="border" {...button_props}>
              //       manage
              //     </Button>
              //     <Button {...button_props}>publish</Button>
              //   </>
              // ) : status === "moderation" ? (
              //   <Button variant="border" {...button_props}>
              //     manage
              //   </Button>
              status === "request" ? (
                <>
                  <Button {...button_props} onClick={hanldeOpen}>
                    action
                  </Button>
                  <Modal state={{ isOpen, setIsOpen }}>
                    <ModalContent>
                      <ListingFlow inviteId={data?.inviteId?.[0]}/>
                    </ModalContent>
                  </Modal>
                  <Button
                    variant="border"
                    {...button_props}
                    onClick={() => router.push(getPreviewRoute())}
                  >
                    preview
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingCard;
