import React from "react";

//Images
import CancelIcon from "@/public/icons/cancel.svg";

// Imports
import Picture from "@/components/Picture/picture";
import { ModalTrigger } from "@/components/Modal/modal";
import InspectionCardInfo from "./inspection-card-info";
import {
  InspectionCardDesc,
  InspectionCardTitle,
  InspectionCardTitleDesc,
} from "./inspection-card-components";
import Button from "@/components/Form/Button/button";

const InspectionDetailModal = () => {
  return (
    <div
      className="w-[600px] max-w-[80%] max-h-[90vh] rounded-lg bg-white dark:bg-darkText-primary custom-flex-col pb-14 gap-6 overflow-x-hidden overflow-y-auto custom-round-scrollbar"
      style={{
        border: "1px solid rgba(193, 194, 195, 0.40) dark:border-darkText-1",
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="sticky top-0 z-[2] custom-flex-col gap-[2px] py-4 px-6 bg-brand-1">
        <div className="flex justify-end">
          <ModalTrigger close>
            <Picture src={CancelIcon} alt="close" size={24} />
          </ModalTrigger>
        </div>
        <h2 className="text-text-secondary text-base font-medium text-center">
          Inspection details
        </h2>
      </div>
      <InspectionCardInfo className="px-6" />
      <div className="relative z-[1] custom-flex-col gap-4">
        <div className="w-full border-b border-dashed border-brand-7 opacity-50"></div>
        <div className="custom-flex-col gap-8 px-6">
          <div className="custom-flex-col gap-4">
            <InspectionCardTitle>other details</InspectionCardTitle>
            <InspectionCardTitleDesc title="Booked by" desc="Salam AIshat" />
            <InspectionCardTitleDesc title="Selected Date" desc="25/01/2024" />
            <InspectionCardTitleDesc title="Selected Time" desc="12:30pm" />
            <InspectionCardTitleDesc title="Phone" desc="09145434578" />
            <InspectionCardTitleDesc title="Branch" desc="Bodija Branch" />
            <InspectionCardTitleDesc title="Property" desc="Harmony Cottage" />
            <InspectionCardTitleDesc
              title="Inspection Type"
              desc="Physical Inspection"
            />
            <div className="custom-flex-col gap-1">
              <InspectionCardTitle>description</InspectionCardTitle>
              <InspectionCardDesc>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent eget dictum sem, ut molestie eros. Morbi in dolor
                augue. Sed aliquet ipsum fringilla sapien facilisis consectetur.
              </InspectionCardDesc>
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <Button variant="sky_blue" size="xs_normal" className="py-2 px-6">
              Request Application
            </Button>
            <Button size="xs_normal" className="py-2 px-6">
              Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionDetailModal;
