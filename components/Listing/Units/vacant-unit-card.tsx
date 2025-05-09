"use client";

import { useEffect, useState } from "react";

// Images
import {
  CameraIcon,
  EditPencilIcon,
  PreviewEyeIcon,
  StatsChartIcon,
} from "@/public/icons/icons";
import SampleProperty6 from "@/public/empty/SampleProperty6.jpg";

// Imports
import DOMPurify from "dompurify";
import Picture from "@/components/Picture/picture";
import UnitPublishModal from "./unit-publish-modal";
import Switch from "@/components/Form/Switch/switch";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
import { Modal, ModalContent } from "@/components/Modal/modal";
import Link from "next/link";
import UnitSponsorPopover from "./unit-sponsor-popover";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import {
  ToggleUnitPublish,
  unit_listing_status,
} from "@/app/(nav)/listing/units/data";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { useAddUnitStore } from "@/store/add-unit-store";
import { transformUnitDetails } from "@/app/(nav)/listing/data";
import { PropertyListingRed } from "../Property/property-listing-component";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import useFetch from "@/hooks/useFetch";
import { useGlobalStore } from "@/store/general-store";


const VacantUnitCard = ({
  status,
  unit_data,
  availableSponsors,
}: {
  unit_data: any;
  availableSponsors?: number;
  status:
    | "published"
    | "unpublished"
    | "under moderation"
    | "rejected"
    | "approved"
    | "pending";
}) => {
  const propertySettings = useAddUnitStore((state) => state.propertySettings);
  const currency = unit_data.currency || "naira";
  const [isOpen, setIsOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const is_sponsored = unit_data.is_sponsored;


  const referenceObject = {
    property_title: "",
    unit_name: "",
    unit_details: "",
    rent: "",
    ...(unit_data.caution_fee ? { caution_deposit: "" } : {}),
    total_package: "",
    address: "",
    unit_type: "",
    account_officer: "",
  };

  const published = unit_data.published;
  const unit_status =
    status === "pending"
      ? "under moderation"
      : status === "approved" && published
      ? "published"
      : status === "approved" && !published
      ? "unpublished"
      : status;

  const [checked, setChecked] = useState(unit_status === "published");
  useEffect(() => {
    setChecked(unit_status === "published");
  }, [unit_status]);

  const togglePublish = async () => {
    if (status !== "approved") {
      toast.warning("The Unit is not yet approved!");
      return;
    }
    try {
      setPublishing(true);
      const payload = {
        publish: unit_data.published ? 0 : 1,
      };
      const unitId = unit_data.unitId;
      const res = await ToggleUnitPublish(unitId, objectToFormData(payload));
      if (res) {
        setIsOpen(false);
        // setChecked(!checked);
        toast.success("Updated Successfully");
        window.dispatchEvent(new Event("refetchRentUnit"));
      }
    } catch (error) {
      toast.error("Failed to Switch");
    } finally {
      setPublishing(false);
    }
  };

  const keyValueData = {
    property_title: unit_data.property_title,
    unit_name: unit_data.unit_name,
    unit_details: transformUnitDetails(unit_data),
    rent: `${
      currencySymbols[currency as keyof typeof currencySymbols]
    }${formatNumber(parseFloat(unit_data.rent))}`,
    ...(unit_data.caution_fee
      ? {
          caution_deposit: `${
            currencySymbols[currency as keyof typeof currencySymbols]
          }${formatNumber(parseFloat(unit_data.caution_fee))}`,
        }
      : {}),
    total_package: unit_data.total_package,
    address: unit_data.address,
    unit_type: unit_data.unit_type,
    account_officer: "",
    //sponsored_count: unit_data.s
  };

  const color =
    unit_listing_status[unit_status as keyof typeof unit_listing_status];
  const sanitizedHTML = DOMPurify.sanitize(unit_data?.description || "");

  return (
    <div
      className="p-6 custom-flex-col gap-4 rounded-2xl bg-white dark:bg-darkText-primary"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex items-center gap-6 justify-between">
        <p className="text-brand-10 text-base font-bold">
          Unit ID: {unit_data.unitId}
        </p>
        <div
          className="w-5 h-5 rounded-full"
          style={{ backgroundColor: color || "#ebeef0" }}
        ></div>
      </div>
      <SectionSeparator />
      <div className="custom-flex-col gap-4 overflow-x-auto custom-round-scrollbar">
        <div className="min-w-[800px] custom-flex-col gap-4">
          <div className="flex gap-6 items-center">
            <div className="custom-flex-col flex-1 gap-2">
              <div className="flex">
                <KeyValueList
                  data={keyValueData}
                  referenceObject={referenceObject}
                  truncateLength={35} 
                />
              </div>
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="relative rounded-2xl overflow-hidden cursor-pointer"
            >
              <Picture
                src={unit_data.images[0]}
                alt="property preview"
                size={168}
              />
              <PopupImageModal
                isOpen={isModalOpen}
                images={unit_data.images.map((image: any) => ({
                  src: image,
                }))}
                onClose={() => setIsModalOpen(false)}
              />
              <div className="absolute inset-0 p-3">
                <div className="flex justify-end">
                  <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1.5">
                    <CameraIcon />
                    <p className="text-black dark:text-white font-medium text-[10px]">
                      +{unit_data.images.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SectionSeparator />
      </div>
      <div
        className={`flex flex-wrap items-center text-brand-9 text-base font-medium lato ${
          status === "rejected" ? "justify-between" : "justify-end"
        }`}
      >
        {status === "rejected" && (
          <div className="flex items-center">
            <PropertyListingRed>
              {unit_data.rejection_reason}
            </PropertyListingRed>
          </div>
        )}

        <div className="flex gap-10 justify-end">
          {status === "approved" && (
            <div className="flex  gap-2 capitalize">
              <Switch checked={checked} onClick={() => setIsOpen(true)} />
              <p> {published ? "Unpublish" : "Publish"} </p>
            </div>
          )}

          {!["under moderation", "rejected", "unpublished"].includes(
            unit_status
          ) && (
            <UnitSponsorPopover
              sponsored_count={unit_data.sponsored_count}
              unitId={unit_data.unitId}
              unitName={keyValueData.unit_name}
              propertyName={unit_data.property_title}
              annualRent={keyValueData.rent}
              status={unit_data.is_active}
              unitDesc={keyValueData.unit_details}
              availableSponsors={availableSponsors || 0}
              is_sponsored={is_sponsored}
            />
          )}

          <Modal
            state={{
              isOpen,
              setIsOpen,
            }}
          >
            <ModalContent>
              <UnitPublishModal
                isPublished={checked}
                onYes={togglePublish}
                loading={publishing}
              />
            </ModalContent>
          </Modal>

          <Link
            href={`/management/properties/${unit_data.property_id}`}
            className="flex items-center gap-2"
          >
            <PreviewEyeIcon />
            <p>Preview</p>
          </Link>
          {!["under moderation", "rejected", "unpublished"].includes(
            unit_status
          ) && (
            <Link
              href={`/listing/statistics/${unit_data.unitId}`}
              className="flex gap-2"
            >
              <StatsChartIcon />
              <p>Stats</p>
            </Link>
          )}
          <Link
            href={`/management/properties/${unit_data.property_id}/edit-property`}
            className="flex gap-2"
          >
            <EditPencilIcon />
            <p>Edit</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VacantUnitCard;
