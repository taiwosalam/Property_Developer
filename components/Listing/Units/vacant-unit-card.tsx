import React from "react";

// Images
import { CameraIcon } from "@/public/icons/icons";
import SampleProperty6 from "@/public/empty/SampleProperty6.jpg";

import PreviewEye from "@/public/icons/preview-eye.svg";
import StatsChart from "@/public/icons/stats-chart.svg";
import EditPencil from "@/public/icons/edit-pencil.svg";

// Imports
import { secondaryFont } from "@/utils/fonts";
import Picture from "@/components/Picture/picture";
import UnitPublishModal from "./unit-publish-modal";
import Switch from "@/components/Form/Switch/switch";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
import { unit_card_data_props } from "@/components/Management/Properties/data";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Link from "next/link";
import UnitSponsorPopover from "./unit-sponsor-popover";
import TruncatedText from "@/components/TruncatedText/truncated-text";

const VacantUnitCard = () => {
  return (
    <div
      className="p-6 custom-flex-col gap-4 rounded-2xl bg-white"
      style={{ boxShadow: " 2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <p className="text-brand-10 text-base font-bold">Unit ID: 123456776342</p>
      <SectionSeparator />
      <div className="flex gap-1 items-center">
        <div className="custom-flex-col flex-1 gap-2">
          <div className="flex">
            <KeyValueList referenceObject={unit_card_data_props} data={{}} />
          </div>
          <div className="flex items-start gap-[75px] text-base font-normal">
            <p className="text-[#747474]">Description</p>
            <TruncatedText lines={3} className="text-text-quaternary">
              A multi-family home, also know as a duplex, triplex, or multi-unit
              building, is a residential property that living read more. They
              want to work with their budget in booking an appointment. They
              wants to ease themselves of the stress of having to que, and also
              reduce the read more They wants to ease themselves of the stress
              of having to que, and also reduce the time spent searching for
              something new.for something new. A multi-family home, also know as
              a duplex, triplex, or multi-unit building, is a residential
              property that living read more. They want to work with their
              budget in booking an appointment. ime spent searching
            </TruncatedText>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden">
          <Picture src={SampleProperty6} alt="property preview" size={168} />
          <div className="absolute inset-0 p-3">
            <div className="flex justify-end">
              <div className="bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
                <CameraIcon />
                <p className="text-black font-medium text-[10px]">+23</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SectionSeparator />
      <div
        className={`flex gap-12 justify-end text-brand-primary text-base font-semibold capitalize ${secondaryFont.className}`}
      >
        <Modal>
          <ModalTrigger className="flex gap-2 capitalize">
            <Switch checked />
            <p>publish</p>
          </ModalTrigger>
          <ModalContent>
            <UnitPublishModal />
          </ModalContent>
        </Modal>
        <Link
          href={"/management/properties/1"}
          className="flex items-center gap-2"
        >
          <Picture src={PreviewEye} width={24} height={17} />
          <p>preview</p>
        </Link>
        <Link href={"/listing/statistics"} className="flex gap-2">
          <Picture src={StatsChart} size={24} />
          <p>stats</p>
        </Link>
        <UnitSponsorPopover />
        <Link
          href={"/management/properties/1/edit-property"}
          className="flex gap-2"
        >
          <Picture src={EditPencil} size={24} />
          <p>edit</p>
        </Link>
      </div>
    </div>
  );
};

export default VacantUnitCard;
