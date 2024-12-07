"use client";
import { useEffect, useState } from "react";
import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Button from "@/components/Form/Button/button";
import type { VehicleRecord } from "./types";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import CheckInOutForm from "../visitors-requests/check-in-out-form";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import { AuthForm } from "@/components/Auth/auth-components";
import { checkOutVehicle } from "./data";
import { toast } from "sonner";
import { format_date_time } from "@/app/(nav)/management/vehicles-record/data";
import ModalPreset from "@/components/Modal/modal-preset";

const VehicleRecordModal: React.FC<
  VehicleRecord & {
    showOpenRecordsButton?: boolean;
  }
> = ({
  status,
  pictureSrc,
  name,
  id,
  category,
  registrationDate,
  latest_check_in,
  showOpenRecordsButton = true,
}) => {
    
    const checkIn = {
      id: latest_check_in?.id,
      name: latest_check_in?.in_by || "---",
      passenger: latest_check_in?.passengers_in || "---",
      date: latest_check_in?.check_in_time
        ? format_date_time(latest_check_in?.check_in_time)
        : "---",
      inventory: latest_check_in?.inventory_in || "---",
    };

    const [checkOut, setCheckOut] = useState({
      id: latest_check_in?.id,
      name: latest_check_in?.out_by || "---",
      passenger: latest_check_in?.passengers_out || "---",
      date: latest_check_in?.check_out_time
        ? format_date_time(latest_check_in?.check_out_time)
        : "---",
      inventory: latest_check_in?.inventory_out || "---",
    });

    const handleCheckOut = async (event: React.FormEvent) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      if (data.passenger) {
        data.passengers_out = data.passenger;
        delete data.passenger;
      }

      if (data.inventory) {
        data.inventory_out = data.inventory;
        delete data.inventory;
      }

      try {
        const response = await checkOutVehicle(data, checkIn.id);
        if (response) {
          console.log("response", response);
          setCheckOut({
            id: response.id || checkOut.id,
            name: response.data.out_by || checkOut.name,
            passenger: response.data.passengers_out || checkOut.passenger,
            date: response.data.check_out_time ? format_date_time(response.data.check_out_time) : checkOut.date,
            inventory: response.data.inventory_out || checkOut.inventory,
          });
          window.dispatchEvent(new Event("refetchVehicleRecord"));
          toast.success("Vehicle checked out successfully");
          setActiveStep("success-action");
        } else {
          toast.error("Failed to check out vehicle");
        }
      } catch (error) {
        console.error(error);
      }
    };


  const [activeStep, setActiveStep] = useState<
    "default" | "check-out" | "success-action"
  >("default");
  const handleBack = () => {
    setActiveStep("default");
  };


  if (activeStep === "default") {
    return (
      <WalletModalPreset title="Vehicle Record">
        <div className="flex flex-col md:flex-row items-center justify-between font-medium gap-2">
          <div className="flex items-center gap-2">
            <Picture size={80} src={pictureSrc} rounded />
            <div className="text-base text-text-primary dark:text-white space-y-1">
              <p className="flex items-center">
                <span>{name}</span>
                <BadgeIcon color="blue" />
              </p>
              <p>
                <span className="text-text-tertiary dark:text-darkText-1">
                  ID:
                </span>{" "}
                {id}
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-4">
              <p className="text-text-tertiary dark:text-darkText-1 min-w-[100px]">
                Category
              </p>
              <p className="text-text-primary dark:text-white capitalize">
                {category}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-text-tertiary dark:text-darkText-1 min-w-[100px]">
                Registration
              </p>
              <p className="text-text-primary dark:text-white">
                {registrationDate}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-borders-dark my-5 -mx-6 border-dashed" />
        <div className="mb-9 text-sm space-y-8">
          {/* Check In */}
          <div>
            <p className="mb-2 text-text-label dark:text-white text-base font-bold">
              Check In
            </p>
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-1.5">
              <div className="flex gap-4">
                <p className="text-text-label dark:text-darkText-2 font-normal min-w-[90px] md:min-w-[unset]">
                  By
                </p>
                <p className="text-text-primary dark:text-white font-medium">
                  {checkIn.name}
                </p>
              </div>
              <div className="flex gap-4">
                <p className="text-text-label dark:text-darkText-2 font-normal min-w-[90px] md:min-w-[unset]">
                  Passengers
                </p>
                <p className="text-text-primary dark:text-white font-medium">
                  {checkIn.passenger}
                </p>
              </div>
              <div className="flex gap-4">
                <p className="text-text-label dark:text-darkText-2 font-normal min-w-[90px] md:min-w-[unset]">
                  Date - Time
                </p>
                <p className="text-text-primary dark:text-white font-medium">
                  {checkIn.date}
                </p>
              </div>
            </div>
            <p className="text-text-label dark:text-white font-normal mb-1">
              Inventory
            </p>
            <div dangerouslySetInnerHTML={{ __html: checkIn.inventory }} />
            {/* <TruncatedText lines={2}>{checkIn.inventory}</TruncatedText> */}
          </div>
          {/* Check Out */}
          <div>
            <p className="mb-2 text-text-label dark:text-white text-base font-bold">
              Check Out
            </p>
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <p className="text-text-label dark:text-darkText-2 font-normal min-w-[90px] md:min-w-[unset]">
                  By
                </p>
                <p className="text-text-primary dark:text-white font-medium">
                  {checkOut?.name ? checkOut.name : "---"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-text-label dark:text-darkText-2 font-normal min-w-[90px] md:min-w-[unset]">
                  Passengers
                </p>
                <p className="text-text-primary dark:text-white font-medium">
                  {checkOut?.passenger ? checkOut.passenger : "---"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-text-label dark:text-darkText-2 font-normal min-w-[90px] md:min-w-[unset]">
                  Date - Time
                </p>
                <p className="text-text-primary dark:text-white font-medium">
                  {checkOut?.date ? checkOut.date : "---"}
                </p>
              </div>
            </div>
            <p className="text-text-label dark:text-white font-normal mb-1">
              Inventory
            </p>
            <div dangerouslySetInnerHTML={{ __html: checkOut.inventory }} />
          </div>
        </div>
        {/* Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4 md:gap-[70px]">
          {status === "pending" && (
            <Button
              size="sm_bold"
              className="py-[10px] px-6 rounded-lg"
              onClick={() => setActiveStep("check-out")}
            >
              Check Out
            </Button>
          )}
          {showOpenRecordsButton && (
            <Button
              size="sm_bold"
              className="py-[10px] px-6 rounded-lg"
              href={`/management/vehicles-record/${id}/record`}
            >
              Open Records
            </Button>
          )}
        </div>
      </WalletModalPreset>
    );
  }
  
  if (activeStep === "check-out") {
    return (
      <>
      {/* <form onSubmit={handleCheckOut}> */}
      <CheckInOutForm
        type="check-out"
        useCase="vehicle"
        handleBack={handleBack}
        pictureSrc={pictureSrc}
        userName={name}
        id={id}
        category={category}
        registrationDate={registrationDate}
        onSubmit={handleCheckOut}
        />  
      {/* </form> */}
      </>
    );
  }

  if (activeStep === "success-action") {
    return (
      <ModalPreset type="success">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-lg font-bold text-text-primary dark:text-white">
            Vehicle checked out successfully!
          </p>
          <Button
            size="sm_bold"
            className="mt-4 py-[10px] px-6 rounded-lg"
            onClick={() => setActiveStep("default")}
          >
            Close
          </Button>
        </div>
      </ModalPreset>
    );
  }

  return <div></div>;
};

export default VehicleRecordModal;
