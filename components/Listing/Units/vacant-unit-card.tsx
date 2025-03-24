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
import { unit_listing_status } from "@/app/(nav)/listing/units/data";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { useAddUnitStore } from "@/store/add-unit-store";

const VacantUnitCard = ({
  status,
  unit_data
}: {
  unit_data: any
  status: "published" | "unpublished" | "under moderation" | "rejected" | "approved" | "pending"
}) => {
  const propertySettings = useAddUnitStore((state) => state.propertySettings);
  const currency = propertySettings?.currency;
  const [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const referenceObject = {
    "unit no/name": "",
    // unit_details: "",
    rent: "",
    ...(unit_data.caution_fee ? { caution_deposit: "" } : {}),
    service_charge: "",
  };

  const unit_status = status === "pending"
    ? "under moderation"
    : status === "approved"
    ? "published"
    : status;

    // console.log("unit_status", unit_status)
  const togglePublish = () => {
    if (status === 'approved') {
      setIsOpen(false);
      setChecked(!checked);
    }
  };

  useEffect(() => {
    console.log('user status ch', checked)
    console.log('unit data', unit_data)
  }, [checked, unit_data])

  const keyValueData = {
    // unit_details:
    //   unit_data?.unit_type?.toLowerCase() === "land"
    //     ? `${unit_data.unit_preference} - ${unit_data.unit_type} - ${unit_data.total_area_sqm
    //     }${unit_data.number_of && unit_data.number_of !== "0"
    //       ? ` - ${unit_data.number_of}`
    //       : ""
    //     }`
    //     : `${unit_data.unit_preference} - ${unit_data.bedroom || 0} bedroom${parseInt(unit_data.bedroom || "0") > 1 ? "s" : ""
    //     } - ${unit_data.unit_sub_type} - ${unit_data.unit_type}`,
    "unit no/name": unit_data.unit_name,
    rent: `${currencySymbols[currency || "naira"]}${formatNumber(
      parseFloat(unit_data.rent)
    )}`,
    ...(unit_data.caution_fee
      ? {
        caution_deposit: `${currencySymbols[currency || "naira"]
          }${formatNumber(parseFloat(unit_data.caution_fee))}`,
      }
      : {}),
    service_charge: `${currencySymbols[currency || "naira"]}${formatNumber(
      parseFloat(unit_data.service_charge || "0")
    )}`,
  };

  const color = unit_listing_status[unit_status as keyof typeof unit_listing_status];
  const sanitizedHTML = DOMPurify.sanitize(unit_data?.description || "");

  return (
    <div
      className="p-6 custom-flex-col gap-4 rounded-2xl bg-white dark:bg-darkText-primary"
      style={{ boxShadow: " 2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex items-center gap-6 justify-between">
        <p className="text-brand-10 text-base font-bold">Unit ID: {unit_data.unitId}</p>
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
                />
              </div>
              <div className="flex items-start gap-[75px] text-base font-normal">
                <p className="text-[#747474] dark:text-darkText-1">
                  Property Title
                </p>
                {/* <TruncatedText
                  lines={3}
                  className="text-text-quaternary dark:text-darkText-2"
                  as="div"
                >
                  <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
                </TruncatedText> */}
                <span> { unit_data.property_title } </span>
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
        className={
          "flex flex-wrap gap-4 lg:gap-12 justify-between lg:justify-end text-brand-9 text-base font-medium lato"
        }
      >
        { status === "approved" && (
        <div className="flex  gap-2 capitalize">
          <Switch checked={checked} onClick={() => setIsOpen(true)} />
          <p>Under Moderation</p>
        </div>
        )}
        <UnitSponsorPopover />
        <Modal
          state={{
            isOpen,
            setIsOpen,
          }}
        >
          <ModalContent>
            <UnitPublishModal isPublished={checked} onYes={togglePublish} />
          </ModalContent>
        </Modal>

        <Link
          href={`/management/properties/${unit_data.property_id}`}
          className="flex items-center gap-2"
        >
          <PreviewEyeIcon />
          <p>Preview</p>
        </Link>
        <Link
          href={`/listing/statistics/${unit_data.unitId}`}
          className="flex gap-2"
        >
          <StatsChartIcon />
          <p>Stats</p>
        </Link>
        <Link
          href={`/management/properties/${unit_data.property_id}/edit-property`}
          className="flex gap-2"
        >
          <EditPencilIcon />
          <p>Edit</p>
        </Link>
      </div>
    </div>
  );
};

export default VacantUnitCard;
