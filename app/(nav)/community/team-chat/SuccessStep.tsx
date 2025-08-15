"use client";

import React from "react";
import Button from "@/components/Form/Button/button";

interface SuccessStepProps {
  onClose: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-text-primary dark:text-white text-lg font-medium">
        Success!
      </p>
      <p className="text-text-disabled text-sm font-normal text-center">
        You have successfully set up a group chat for the team.
      </p>
      <Button
        type="button"
        className="bg-brand-9 text-sm text-white w-1/2 py-2 rounded-md"
        onClick={onClose}
      >
        OK
      </Button>
    </div>
  );
};

export default SuccessStep;
