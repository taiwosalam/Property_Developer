"use client";
import { useState } from "react";
import { ModalTrigger } from "@/components/Modal/modal";
import Picture from "@/components/Picture/picture";
import { XIcon } from "@/public/icons/icons";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Button from "@/components/Form/Button/button";
import type { VehicleRecord } from "./types";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import CheckInOutForm from "../visitors-requests/check-in-out-form";
// import ModalPreset from "@/components/Modal/modal-preset";

const VehicleRecordModal: React.FC<VehicleRecord> = ({
  status,
  pictureSrc,
  name,
  id,
  category,
  registrationDate,
  checkIn,
  checkOut,
}) => {
  const [activeStep, setActiveStep] = useState<
    "default" | "check-out" | "success-action"
  >("default");
  const handleBack = () => {
    setActiveStep("default");
  };

  if (activeStep === "default") {
    return (
      <div className="w-[600px] max-w-[80%] max-h-[85%] rounded-lg overflow-x-auto custom-round-scrollbar">
        {/* Header */}
        <div className="bg-brand-1 text-base text-text-primary py-4 text-center sticky top-0 z-[2]">
          Vehicle Record
          <ModalTrigger
            close
            className="absolute top-[50%] translate-y-[-50%] right-6"
          >
            <XIcon size="30" />
          </ModalTrigger>
        </div>
        {/* Body */}
        <div className="bg-white py-6 px-[40px]">
          <div className="flex items-center justify-between font-medium gap-[7%]">
            <div className="w-[40%] flex items-center gap-2">
              <Picture size={80} src={pictureSrc} rounded />
              <div className="text-base text-text-primary space-y-1">
                <p className="flex items-center">
                  <span>{name}</span>
                  <BadgeIcon color="blue" />
                </p>
                <p>
                  <span className="text-text-tertiary">ID:</span> {id}
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-2 text-sm">
              <div className="flex items-center gap-4">
                <p className="text-text-tertiary min-w-[120px]">Category</p>
                <p className="text-text-primary capitalize">{category}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-text-tertiary min-w-[120px]">Registration</p>
                <p className="text-text-primary">{registrationDate}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-borders-dark my-5 -mx-6 border-dashed" />
          <div className="mb-9 text-sm space-y-8">
            {/* Check In */}
            <div>
              <p className="mb-2 text-text-label text-base font-bold">
                Check In
              </p>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-text-label font-normal">By</p>
                  <p className="text-text-primary font-medium">
                    {checkIn.name}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-text-label font-normal">Passengers</p>
                  <p>{checkIn.passenger}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-text-label font-normal">Date - Time</p>
                  <p>{checkIn.date}</p>
                </div>
              </div>
              <p className="text-text-label font-normal mb-1">Inventory</p>
              <TruncatedText lines={2}>{checkIn.inventory}</TruncatedText>
            </div>
            {/* Check Out */}
            <div>
              <p className="mb-2 text-text-label text-base font-bold">
                Check Out
              </p>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-text-label font-normal">By</p>
                  <p className="text-text-primary font-medium">
                    {checkOut?.name ? checkOut.name : "---"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-text-label font-normal">Passengers</p>
                  <p>{checkOut?.passenger ? checkOut.passenger : "---"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-text-label font-normal">Date - Time</p>
                  <p>{checkOut?.date ? checkOut.date : "---"}</p>
                </div>
              </div>
              <p className="text-text-label font-normal mb-1">Inventory</p>
              <TruncatedText lines={2}>
                {checkOut?.inventory ? checkOut.inventory : "---"}
              </TruncatedText>
            </div>
          </div>
          {/* Buttons */}
          <div className="mt-8 flex items-center justify-center gap-[70px]">
            {status === "pending" && (
              <Button
                size="sm_bold"
                className="py-[10px] px-6 rounded-lg"
                onClick={() => setActiveStep("check-out")}
              >
                Check Out
              </Button>
            )}
            <Button
              size="sm_bold"
              className="py-[10px] px-6 rounded-lg"
              href={`/tasks/vehicles-record/${id}/record`}
            >
              Open Records
            </Button>
          </div>
        </div>
      </div>
    );
  }
  if (activeStep === "check-out") {
    return (
      <CheckInOutForm
        type="check-out"
        handleBack={handleBack}
        pictureSrc={pictureSrc}
        userName={"userName"}
        id={"id"}
      />
    );
  }
  return <div></div>;
};

export default VehicleRecordModal;
