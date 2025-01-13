"use client";

import React, { useEffect, useRef } from "react";

// Imports
import PinField from "react-pin-field";
import Button from "@/components/Form/Button/button";

const InputPin = () => {
  const pinFieldRef = useRef<HTMLInputElement[] | null>(null);

  useEffect(() => {
    if (pinFieldRef.current && pinFieldRef.current.length > 0) {
      pinFieldRef.current[0].focus();
    }
  }, []);

  return (
    <div className="custom-flex-col gap-20">
      <div className="custom-flex-col gap-10">
        <p className="text-text-tertiary dark:text-darkText-1 text-center text-sm font-medium">
        Please enter your 4-digit PIN
        </p>
        <div className="flex gap-6 justify-center">
          <PinField
            length={4}
            ref={pinFieldRef}
            validate={/^[0-9]$/}
            className="w-10 h-10 text-center border border-solid border-[#2B2B2B] rounded-lg custom-primary-outline"
          />
        </div>
      </div>
      <Button size="sm_medium" className="py-2 px-8">
        withdraw
      </Button>
    </div>
  );
};

export default InputPin;
