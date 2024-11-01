"use client";

import React, { useState } from "react";

// Images
import {
  CameraIcon,
  EditPencilIcon,
  PreviewEyeIcon,
  StatsChartIcon,
} from "@/public/icons/icons";
import SampleProperty6 from "@/public/empty/SampleProperty6.jpg";

// Imports
import Picture from "@/components/Picture/picture";
import UnitPublishModal from "./unit-publish-modal";
import Switch from "@/components/Form/Switch/switch";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
import { unit_card_data_props } from "@/components/Management/Properties/data";
import { Modal, ModalContent } from "@/components/Modal/modal";
import Link from "next/link";
import UnitSponsorPopover from "./unit-sponsor-popover";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";

const VacantUnitCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [isOpened, setIsOpened] = useState(false);

  const togglePublish = () => {
    setIsOpen(false);
    setChecked(!checked);
  };

  return (
    <div
      className="p-6 custom-flex-col gap-4 rounded-2xl bg-white dark:bg-darkText-primary"
      style={{ boxShadow: " 2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <p className="text-brand-10 text-base font-bold">Unit ID: 123456776342</p>
      <SectionSeparator />
      <div className="custom-flex-col gap-4 overflow-x-auto custom-round-scrollbar">
        <div className="min-w-[800px] custom-flex-col gap-4">
          <div className="flex gap-6 items-center">
            <div className="custom-flex-col flex-1 gap-2">
              <div className="flex">
                <KeyValueList
                  referenceObject={unit_card_data_props}
                  data={{}}
                />
              </div>
              <div className="flex items-start gap-[75px] text-base font-normal">
                <p className="text-[#747474] dark:text-darkText-1">
                  Description
                </p>
                <TruncatedText
                  lines={3}
                  className="text-text-quaternary dark:text-darkText-2"
                >
                  A multi-family home, also know as a duplex, triplex, or
                  multi-unit building, is a residential property that living
                  read more. They want to work with their budget in booking an
                  appointment. They wants to ease themselves of the stress of
                  having to que, and also reduce the read more They wants to
                  ease themselves of the stress of having to que, and also
                  reduce the time spent searching for something new.for
                  something new. A multi-family home, also know as a duplex,
                  triplex, or multi-unit building, is a residential property
                  that living read more. They want to work with their budget in
                  booking an appointment. ime spent searching
                </TruncatedText>
              </div>
            </div>
            <div
              onClick={() => setIsOpened(true)}
              className="relative rounded-2xl overflow-hidden cursor-pointer"
            >
              <Picture
                src={SampleProperty6}
                alt="property preview"
                size={168}
              />
              <PopupImageModal
                isOpen={isOpened}
                images={[{ src: SampleProperty6, isVideo: false }]}
                onClose={() => setIsOpened(false)}
              />
              <div className="absolute inset-0 p-3">
                <div className="flex justify-end">
                  <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1.5">
                    <CameraIcon />
                    <p className="text-black dark:text-white font-medium text-[10px]">
                      +23
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
          "flex flex-wrap gap-4 lg:gap-12 justify-between lg:justify-end text-brand-primary text-base font-medium lato"
        }
      >
        <div className="flex  gap-2 capitalize">
          <Switch checked={checked} onClick={() => setIsOpen(true)} />
          <p>publish</p>
        </div>
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
          href={"/management/properties/1"}
          className="flex items-center gap-2"
        >
          <PreviewEyeIcon />
          <p>Preview</p>
        </Link>
        <Link href={"/listing/statistics"} className="flex gap-2">
          <StatsChartIcon />
          <p>Stats</p>
        </Link>
        <Link
          href={"/management/properties/1/edit-property"}
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
