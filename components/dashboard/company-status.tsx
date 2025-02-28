"use client";

import React, { useState } from "react";
import CommpanyStatusPreset from "../Modal/company-status-preset";
import Button from "../Form/Button/button";
import Input from "../Form/Input/input";
import DateInput from "../Form/DateInput/date-input";
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
import { useRouter } from "next/navigation";
import { usePersonalInfoStore } from "@/store/personal-info-store";

interface CompanyStatusModalProps {
  status: "approved" | "pending" | "rejected";
  id?: number;
}

// Helper function to format reject_reason as HTML
const formatRejectReason = (reason: string): string => {
  // Split the string on a hyphen with optional surrounding whitespace.
  // const regex = /(.+?)\s*-\s*(.+)/;
  // const match = reason.match(regex);
  // if (match) {
  //   const message = match[1];
  //   const signature = match[2];
  //   // Create HTML with separate paragraphs and additional styling for signature.
  //   return `<p>${message}</p><p class="mt-2 text-sm font-semibold">- ${signature}</p>`;
  // }
  return `<p>${reason}</p>`;
};

const CompanyStatusModal = ({ status, id }: CompanyStatusModalProps) => {
  const router = useRouter();
  const company_id = usePersonalInfoStore((state) => state.company_id);
  const reject_reason = usePersonalInfoStore((state) => state.reject_reason);
  const [activeStep, setActiveStep] = useState(1);

  const useId = company_id ?? id;

  const handleClick = () => {
    if (status === "pending") {
      setActiveStep(2);
    } else {
      router.push(`/setup?edit&id=${useId}`);
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
          {status === "rejected" && reject_reason && (
            <div
              className="mt-2"
              dangerouslySetInnerHTML={{ __html: formatRejectReason(reject_reason) }}
            />
          )}
          <div className="mt-4">
            <Button onClick={handleClick} size="base_medium" className="px-8 py-2">
              {status === "pending" ? "Request Demo" : "Edit Account Setup"}
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
