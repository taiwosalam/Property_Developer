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

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  status,
  type = "staff",
  data
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = () => {
    if (status == "flagged") {
      setModalOpen(true);
    }
  };

  const Content = () => (
    <>
      <div className="flex gap-2 items-center">
        <Picture src={Avatar} alt="avatar" size={50} rounded />
        <div className="custom-flex-col">
          <div className="flex items-center gap-2">
            <p className="text-black text-sm font-bold dark:text-white">
              David Ajala
            </p>
            {type == "staff" ? (
              <BadgeIcon color="blue" noMargin />
            ) : (
              <p className="text-support-3 text-xs font-bold italic">Guest</p>
            )}
          </div>
          {type == "staff" ? (
            <p
              className={`text-black text-xs font-normal ${secondaryFont.className} dark:text-white`}
            >
              User ID: 12345678909
            </p>
          ) : (
            <p
              className={`text-black dark:text-darkText-1 text-xs font-normal ${secondaryFont.className}`}
            >
              ajaladavid75@gmail.com
            </p>
          )}
        </div>
      </div>
      <div className="custom-flex-col gap-4">
        <div className="custom-flex-col gap-1">
          <p
            className={`text-text-quaternary dark:text-white text-base font-bold ${secondaryFont.className}`}
          >
            Semi-Furnished 2 Bedroom Self-contain
          </p>
          <div className="flex items-center gap-1">
            <Picture src={LocationIcon} alt="location" width={12} height={16} />
            <p className="text-text-disabled text-xs font-normal">
              Street 23, All Avenue, Nigeria
            </p>
          </div>
        </div>
        <div className="pr-4 flex items-center gap-4 justify-between">
          <div className="custom-flex-col gap-2 text-borders-normal text-xs font-medium">
            <div className="flex items-center gap-2">
              <Picture src={PhoneFilled} alt="phone number" size={16} />
              <p className="dark:text-white">+2348132086958</p>
            </div>
            <div className="flex items-center gap-2">
              <Picture src={CalendarFilled} alt="date" size={16} />
              <p className="dark:text-white">12/12/2024</p>
            </div>
          </div>
          <div className={`custom-flex-col ${secondaryFont.className}`}>
            <p className="text-brand-primary text-2xl font-bold">₦1,950,000</p>
            <p className="text-text-label dark:text-white text-xs font-semibold">
              Total Package
            </p>
            <p className="text-text-disabled text-base font-medium">
              <span className="text-highlight">₦700,000</span> / Yearly
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
        "custom-flex-col gap-4 pb-4 rounded-2xl overflow-hidden border border-solid bg-white dark:bg-darkText-primary",
        {
          "border-support-2": type == "staff",
          "border-support-3": type == "guest",
        }
      )}
    >
      <div
        role="button"
        onClick={() => setIsOpened(true)}
        className="relative w-full h-[180px]"
      >
        <Image
          src={SampleProperty4}
          alt="preview"
          fill
          sizes="500px"
          className="object-cover"
        />
        <PopupImageModal
          isOpen={isOpened}
          images={[{ src: SampleProperty4 }]}
          onClose={() => setIsOpened(false)}
        />
      </div>
      {status === "flagged" ? (
        <div
          role="button"
          onClick={handleCardClick}
          className="custom-flex-col gap-3 px-2"
        >
          <Content />
        </div>
      ) : (
        <Link
          href={"/applications/1/manage"}
          className="custom-flex-col gap-3 px-2"
        >
          <Content />
        </Link>
      )}
      <Modal state={{ isOpen: modalOpen, setIsOpen: setModalOpen }}>
        <ModalContent>
          <FlaggedApplicantAccountModal />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ApplicationCard;
