"use client";

import Image from "next/image";
import React, { useState } from "react";

// Types
import type { FlowComponentProps } from "./types";
import type { ValidationErrors } from "@/utils/types";

// Images
import ReloadBlue from "@/public/icons/reload-blue.svg";

// Imports
import Button from "@/components/Form/Button/button";
import { objectLength } from "@/utils/object-length";
import { AuthHeading, AuthPinField } from "../auth-components";
import { checkValidatonError, validateData } from "@/utils/validation";
import { useFormDataStore } from "@/store/formdatastore";
import { verifyEmail } from "@/app/auth/data";
import { useRouter } from "next/navigation";

const VerifyEmailAddress: React.FC<FlowComponentProps> = ({ changeStep }) => {
  // State for managing error messages
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});
  const router = useRouter();

  // State for storing the entered code
  const [code, setCode] = useState("");

  // Handler for changes in the PIN field
  const handlePinChange = (pin: string) => {
    setCode(pin); // Update the state with the new PIN value
    setErrorMsgs({}); // Clear any existing error messages
  };

  // Handler for when the form is submitted
  const handleCodeSubmit = async () => {
    const data = {
      code, // Include the entered code in the data object
    };

    // Validate the entered code using the validation function
    const validation = validateData(data);

    // If there are no validation errors, proceed to the next step
    if (!objectLength(validation.invalidKeys)) {
      console.log(data);
      const status = await verifyEmail(code); // Pass the OTP to the verifyEmail function
      if (status) {
        router.push("/setup"); // Proceed to the next step in the flow
      }
    } else {
      setErrorMsgs(validation.invalidKeys); // Set error messages if validation fails
    }
  };

  // Check for validation errors specifically for the "code" field
  const validationError = checkValidatonError({
    errors: errorMsgs,
    key: "code",
  });

  const email = useFormDataStore((state) => state.formData.email);

  return (
    <div className="custom-flex-col gap-20">
      {/* Heading for the verification step */}
      <AuthHeading title="Verify Email Address">
        An OTP code has been sent to your email (
        <span className="text-supporting-1">{email}</span>) for verification
      </AuthHeading>

      <div className="custom-flex-col gap-10">
        <div className="custom-flex-col gap-2">
          {/* PIN input field */}
          <AuthPinField onChange={handlePinChange} />
          {/* Display validation error if present */}
          {validationError && (
            <p className="text-sm text-center text-red-500 font-medium">
              {validationError}
            </p>
          )}
        </div>
        {/* Button to submit the code */}
        <Button onClick={handleCodeSubmit}>verify</Button>
      </div>

      <div className="flex items-center justify-between">
        {/* Resend code button */}
        <button className="flex gap-1 text-brand-secondary text-base font-medium">
          <Image src={ReloadBlue} alt="resend" height={20} />
          <p className="opacity-50">Resend code</p>
          <p>(40s)</p>
        </button>
        {/* Button to go back and change the email */}
        <button
          onClick={() => changeStep("prev")}
          className="text-brand-secondary text-base font-medium"
        >
          Change email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailAddress;
