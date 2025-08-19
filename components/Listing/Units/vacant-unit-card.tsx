"use client";

import { useEffect, useState } from "react";

// Images
import {
  CameraIcon,
  EditPencilIcon,
  PreviewEyeIcon,
  StartRentIcon,
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
import { useRole } from "@/hooks/roleContext";
import useWindowWidth from "@/hooks/useWindowWidth";


const VacantUnitCard = ({
  status,
  unit_data,
  availableSponsors,
  page,
}: {
  unit_data: any;
  availableSponsors?: number;
  page?: "manager" | "account";
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
  const { role } = useRole();
  const { isMobile, isTablet, isLaptop, isDesktop } = useWindowWidth();

  const ICON_SIZE = isMobile ? 20 : isTablet ? 22 : 24;
  // const ICON_TEXT = isMobile ? "hidden" : "visible";

  const CAN_LINK_TENANT = role === "manager" || role === "director";
  const CAN_SPONSOR_UNIT = role === "manager" || role === "director";

  console.log("role", role)
  // Function to determine route prefix based on page
  const getRoutePrefix = function (): string {
    switch (role) {
      case "manager":
        return "/manager";
      case "account":
        return "/accountant";
      case "director":
        return "";
      default:
        return "";
    }
  };

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
    rent: `${currencySymbols[currency as keyof typeof currencySymbols]
      }${formatNumber(parseFloat(unit_data.rent))}`,
    ...(unit_data.caution_fee
      ? {
        caution_deposit: `${currencySymbols[currency as keyof typeof currencySymbols]
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
      <div className="custom-flex-col gap-4 overflow-x-auto custom-round-scrollbar hide-scrollbar">
        <div className="min-w-[800px] custom-flex-col gap-4">
          <div className="flex gap-6 items-center">
            <div className="custom-flex-col flex-1 gap-2">
              <div className="flex gap-8 sm:gap-0">
                <KeyValueList
                  data={keyValueData}
                  referenceObject={referenceObject}
                  truncateLength={40}
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
        className={`flex flex-wrap items-center text-brand-9 text-base font-medium lato ${status === "rejected" ? "justify-between" : "justify-end"
          }`}
      >
        {status === "rejected" && (
          <div className="flex items-center">
            <PropertyListingRed>
              {unit_data.rejection_reason}
            </PropertyListingRed>
          </div>
        )}

        <div className="flex items-center gap-10 justify-end">
          {status === "approved" && (
            <div className="flex items-center gap-2 capitalize">
              <Switch checked={checked} onClick={() => setIsOpen(true)} />
              <p className="hidden lg:block"> {published ? "Unpublish" : "Publish"} </p>
            </div>
          )}

          {CAN_SPONSOR_UNIT &&
            !["under moderation", "rejected", "unpublished"].includes(
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

          {CAN_SPONSOR_UNIT && (
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
          )}
          <Link
            href={`${getRoutePrefix()}/management/rent-unit/${unit_data.unitId}`}
            className="flex items-center gap-2 relative group"
          >
            <div className="relative">
              <PreviewEyeIcon size={ICON_SIZE} />
              {/* Mobile hover tooltip */}
              {isMobile && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Preview
                </div>
              )}
            </div>
            <p className="hidden lg:block">Preview</p>
          </Link>
          {!["under moderation", "rejected", "unpublished"].includes(
            unit_status
          ) && (
              <Link
                href={`${getRoutePrefix()}/listing/statistics/${unit_data.unitId}`}
                className="flex items-center gap-2 relative group"
              >
                <div className="relative">
                  <StatsChartIcon size={ICON_SIZE} />
                  {/* Mobile hover tooltip */}
                  {isMobile && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      Stats
                    </div>
                  )}
                </div>
                <p className="hidden lg:block">Stats</p>
              </Link>
            )}
          <Link
            href={`${getRoutePrefix()}/management/properties/${unit_data.property_id}/edit-property`}
            className="flex items-center gap-2 relative group"
          >
            <div className="relative">
              <EditPencilIcon size={ICON_SIZE} />
              {/* Mobile hover tooltip */}
              {isMobile && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Edit
                </div>
              )}
            </div>
            <p className="hidden lg:block">Edit</p>
          </Link>
          {CAN_LINK_TENANT && (
            <Link
              href={`${getRoutePrefix()}/management/rent-unit/${unit_data.unitId
                }/start-rent?type=${unit_data.propertyType}&id=${unit_data.unitId
                }`}
              className="flex items-center gap-2 font-normal relative group"
            >
              <div className="relative">
                <StartRentIcon size={ICON_SIZE} />
                {/* Mobile hover tooltip */}
                {isMobile && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Link Tenant
                  </div>
                )}
              </div>
              <p className="hidden lg:block">Link Tenant</p>
            </Link>
          )}

        </div>
      </div>
    </div>
  );
};

export default VacantUnitCard;
