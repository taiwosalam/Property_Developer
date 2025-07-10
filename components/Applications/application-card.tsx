"use client";

import Image from "next/image";
import React, { useState } from "react";

// Types
import type { ApplicationCardProps } from "./types";

// Images
import LocationIcon from "@/public/icons/location.svg";
import PhoneFilled from "@/public/icons/phone-filled.svg";
import CalendarFilled from "@/public/icons/calendar-filled.svg";

import SampleProperty4 from "@/public/empty/SampleProperty4.png";
import Avatar from "@/public/empty/avatar.png";

// Imports
import Picture from "../Picture/picture";
import { secondaryFont } from "@/utils/fonts";
import BadgeIcon from "../BadgeIcon/badge-icon";
import { Modal, ModalContent } from "../Modal/modal";
import FlaggedApplicantAccountModal from "./flagged-applicant-account-modal";
import clsx from "clsx";
import Link from "next/link";
import PopupImageModal from "../PopupSlider/PopupSlider";
import { getBadgeColor } from "@/lib/utils";
import { empty } from "@/app/config";

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  status,
  type,
  data,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = () => {
    if (status === "flagged" && type !== "rejected") {
      setModalOpen(true);
    }
  };

  const Content = () => (
    <>
      <div className="flex gap-2 items-center">
        <Picture src={data?.photo || empty} alt="avatar" size={50} rounded />
        <div className="custom-flex-col">
          <div className="flex items-center gap-2">
            <p className="text-black text-sm font-bold dark:text-white capitalize">
              {data?.full_name}
            </p>

            <BadgeIcon
              color={getBadgeColor(data?.tier_id) || "gray"}
              noMargin
            />
          </div>

          <p
            className={`text-black dark:text-darkText-1 text-xs font-normal ${secondaryFont.className}`}
          >
            {data?.email}
          </p>
        </div>
      </div>
      <div className="custom-flex-col gap-4">
        <div className="custom-flex-col gap-1">
          <p
            className={`text-text-quaternary dark:text-white text-base font-bold capitalize truncate ${secondaryFont.className}`}
          >
            {data?.property_name}
          </p>
          <div className="flex items-center gap-1">
            <Picture src={LocationIcon} alt="location" width={12} height={16} />
            <p className="text-text-disabled text-xs font-normal capitalize truncate">
              {data?.address}
            </p>
          </div>
        </div>
        <div className="pr-4 flex items-center gap-4 justify-between">
          <div className="custom-flex-col gap-2 text-borders-normal text-xs font-medium">
            <div className="flex items-center gap-2">
              <Picture src={PhoneFilled} alt="phone number" size={16} />
              <p className="dark:text-white">{data?.phone_number}</p>
            </div>
            <div className="flex items-center gap-2">
              <Picture src={CalendarFilled} alt="date" size={16} />
              <p className="dark:text-white">{data?.date}</p>
            </div>
          </div>
          <div
            className={`custom-flex-col ${secondaryFont.className} text-right`}
          >
            <p className="text-brand-primary text-2xl font-bold truncate max-w-[200px]">
              {(data?.currency ?? "") + data?.total_package}
            </p>
            <p className="text-text-label dark:text-white text-xs font-semibold">
              Total Package
            </p>
            <p className="text-text-disabled text-base font-medium capitalize truncate  max-w-[150px]">
              <span className="text-highlight">
                {(data?.currency ?? "") +
                  data?.yearly_amount +
                  "000000000000000"}
              </span>{" "}
              / <span className="">{data?.renew_fee_period}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div
      style={{ boxShadow: "4px 4px 5px 0px rgba(0, 0, 0, 0.03)" }}
      className={clsx(
        "custom-flex-col gap-4 pb-4 rounded-2xl overflow-hidden border-2 border-solid bg-white dark:bg-darkText-primary",
        {
          "border-[#FACC15]": type === "pending",
          "border-[#8B5CF6]": type === "evaluated",
          "border-[#22C55E]": type === "approved",
          "border-[#EF4444]": type === "rejected",
        }
      )}
    >
      <div
        role="button"
        onClick={() => setIsOpened(true)}
        className="relative w-full h-[180px]"
      >
        <Image
          src={data?.images?.[0] || empty}
          alt="preview"
          fill
          sizes="500px"
          className="object-cover"
        />
        <PopupImageModal
          isOpen={isOpened}
          images={
            Array.isArray(data?.images)
              ? data.images.map((img) => ({ src: img }))
              : []
          }
          onClose={() => setIsOpened(false)}
        />
      </div>
      {status === "flagged" &&
      type !== "rejected" &&
      type !== "evaluated" &&
      type !== "approved" ? (
        <div
          role="button"
          onClick={handleCardClick}
          className="custom-flex-col gap-3 px-2"
        >
          <Content />
        </div>
      ) : (
        <Link
          href={`applications/${data?.id}/manage`}
          className="custom-flex-col gap-3 px-2"
        >
          <Content />
        </Link>
      )}
      <Modal state={{ isOpen: modalOpen, setIsOpen: setModalOpen }}>
        <ModalContent>
          <FlaggedApplicantAccountModal
            flag_details={data?.flag_details}
            id={data?.id}
            setIsOpen={setModalOpen}
            type={type}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ApplicationCard;
