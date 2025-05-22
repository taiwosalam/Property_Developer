"use client";

import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import TextArea from "@/components/Form/TextArea/textarea";
import ModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import { empty } from "@/app/config";
import React, { useState } from "react";
import { CounterButton } from "@/components/Wallet/AddFunds/payment-method";

interface BaseProps {
  type: "check-in" | "check-out" | "decline";
  useCase: "visitor" | "vehicle";
  handleBack?: () => void;
  pictureSrc: string;
  userName: string;
  id: string | number;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}
interface VisitorFormProps extends BaseProps {
  useCase: "visitor";
  requestDate: string;
}
interface VehicleFormProps extends BaseProps {
  useCase: "vehicle";
  category: string;
  registrationDate: string;
}

const CheckInOutForm: React.FC<VisitorFormProps | VehicleFormProps> = (
  props
) => {
  const [count, setCount] = useState<number>(0);
  const {
    type,
    handleBack,
    pictureSrc,
    userName,
    id,
    useCase,
    onSubmit,
    loading,
  } = props;
  const handleIncrement = () => {
    setCount((prevCount) => (prevCount < 99 ? prevCount + 1 : prevCount));
  };

  const handleDecrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and ensure the value is between 1 and 99
    if (/^\d*$/.test(value)) {
      const numValue = Number(value);
      if (value === "" || (numValue >= 1 && numValue <= 99)) {
        setCount(numValue || 1); // Default to 1 if input is empty
      }
    }
  };

  return (
    <ModalPreset
    
      heading={
        type === "decline"
          ? `Decline ${useCase === "visitor" ? "Visitor" : "Vehicle"}`
          : type === "check-in"
          ? "Check In"
          : "Check Out"
      }
      back={handleBack ? { handleBack } : undefined}
    >
      <div className="flex flex-col md:flex-row gap-x-10 lg:gap-x-20 md:justify-between gap-y-5 mb-4">
        <form
          onSubmit={onSubmit}
          className="flex flex-col md:flex-row  w-full gap-10 items-start"
        >
          <div className="md:min-w-fit custom-flex-col gap-6">
            <div className="flex-1 flex-col items-center gap-2">
              <div className="mb-[10px] flex items-center gap-4">
                <Picture
                  src={pictureSrc || empty}
                  alt="empty"
                  size={80}
                  rounded
                />
                <div className="flex flex-col">
                  <p className="flex items-center">
                    <span className="text-text-primary dark:text-white text-base font-medium">
                      {userName}
                    </span>
                    {/* <BadgeIcon color="green" /> */}
                  </p>
                  <p className="flex items-center gap-1 text-sm font-normal">
                    <span className="text-text-tertiary dark:text-darkText-2">
                      ID
                    </span>
                    <span className="text-text-primary dark:text-darkText-1">
                      {id}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium">
                {useCase === "visitor" ? (
                  <div className="flex items-center gap-2">
                    <p>Request Date</p>
                    <p>{props.requestDate}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <p className="text-text-tertiary dark:text-darkText-1 min-w-[100px]">
                        Guest/Visitor
                      </p>
                      <p className="text-text-primary dark:text-white capitalize">
                        {props.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-text-tertiary dark:text-darkText-2 min-w-[100px]">
                        Registration
                      </p>
                      <p className="text-text-primary dark:text-white">
                        {props.registrationDate}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {type !== "decline" && (
              <>
                <span className="-mb-3">
                  {useCase === "visitor" ? "Companions" : "Select Passengers"}
                </span>
                <div className="flex justify-between max-w-[200px] px-2 items-center gap-2 border-2 border-text-disabled dark:border-[#3C3D37] rounded-md">
                  <input
                    id={useCase === "visitor" ? "companion" : "passenger"}
                    name={useCase === "visitor" ? "companion" : "passenger"}
                    type="number"
                    value={count}
                    minLength={0}
                    maxLength={2}
                    onChange={handleInputChange}
                    // onChange={(e) => setCount(Number(e.target.value))}
                    className="w-2/3 px-2 py-2 border-transparent focus:outline-none"
                  />
                  <div className="btn flex flex-col items-end justify-end">
                    <CounterButton
                      onClick={handleIncrement}
                      icon="/icons/plus.svg"
                      alt="plus"
                    />
                    <CounterButton
                      onClick={handleDecrement}
                      icon="/icons/minus.svg"
                      alt="minus"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="md:flex-1">
            <p className="mb-[14px] text-text-primary dark:text-white text-lg lg:text-xl font-medium">
              {type === "decline" ? "Reason" : "Inventory"}
            </p>
            <p className="mb-4 text-text-tertiary dark:text-darkText-2 text-sm font-normal">
              {type === "decline"
                ? useCase === "visitor"
                  ? "Please clearly state the reason for denying visitor access."
                  : "Please clearly state the reason for denying vehicle access."
                : useCase === "visitor"
                ? "Please make sure to document and record all items found with visitors, or with companions."
                : "Please ensure that all items discovered with passengers or  in the car, including those in the boot space, are noted and recorded."}
            </p>
            <TextArea
              id={type === "decline" ? "reason" : "inventory"}
              inputSpaceClassName="md:!h-[100px]"
            />
            <Button
              type="submit"
              aria-label="submit"
              size="16_bold"
              className="py-[10px] px-8 rounded-lg block ml-auto mt-5"
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : type === "check-in"
                ? "Check In"
                : "Check Out"}
            </Button>
          </div>
        </form>
      </div>
    </ModalPreset>
  );
};

export default CheckInOutForm;
