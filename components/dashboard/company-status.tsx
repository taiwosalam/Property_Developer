"use client";

import React, { useState } from "react";
import CommpanyStatusPreset from "../Modal/company-status-preset";
import Button from "../Form/Button/button";
import Input from "../Form/Input/input";
import DateInput from "../Form/DateInput/date-input";
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";

interface CompanyStatusModalProps {
  status: "approved" | "pending" | "rejected";
}

const CompanyStatusModal = ({ status }: CompanyStatusModalProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const handleClick = () => {
    if (status === "pending") {
      setActiveStep(2);
    }
  };
  return (
    <CommpanyStatusPreset
      back={activeStep !== 1 ? () => setActiveStep(1) : undefined}
      type={
        status === "approved"
          ? "success"
          : status === "rejected"
          ? "warning"
          : "success"
      }
      className="lg:w-[50%] w-80%"
    >
      {activeStep === 1 ? (
        <>
          <p className="mt-2">
            {status === "pending"
              ? "Your verification submission has been successful. Please await an email notification regarding the approval of your account."
              : "We regret to inform you that your account verification submission did not meet the requirements."}
          </p>
          {status === "rejected" && (
            <>
              <p>
                Please carefully review all the necessary criteria and ensure
                that you provide accurate information to authenticate your
                company profile.
              </p>
              <p>Please resubmit the verification with the correct details.</p>
            </>
          )}
          <div className="mt-4">
            <Button
              onClick={handleClick}
              size="base_medium"
              className="px-8 py-2"
            >
              {status === "pending" ? "Request Demo" : "Edit Profile"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center w-full">
            <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 w-full">
              <Input
                required
                id="full_name"
                label="full name"
                inputClassName="rounded-[8px]"
              />
              <Input
                required
                id="email"
                label="email"
                type="email"
                inputClassName="rounded-[8px]"
              />
              <DateInput
                required
                id="prefer_date"
                label="prefer date"
                disablePast
                inputClassName="rounded-[8px]"
              />
              <Input
                required
                id="prefer_time"
                type="time"
                label="time"
                inputClassName="rounded-[8px]"
              />
              <PhoneNumberInput
                required
                id="phone"
                label="phone number"
                inputClassName="rounded-[8px]"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button size="base_medium" className="px-8 py-2">
              {status === "pending" ? "Request Demo" : "Edit Profile"}
            </Button>
          </div>
        </>
      )}
    </CommpanyStatusPreset>
  );
};

export default CompanyStatusModal;
