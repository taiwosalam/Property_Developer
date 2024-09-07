import React from "react";

// Types
import type { OnboardingActionProps } from "./types";

const OnboardingAction: React.FC<OnboardingActionProps> = ({ children }) => {
  return (
    <button className="py-2 px-8 h-[50px] text-brand-10 text-base font-medium capitalize text-start">
      {children}
    </button>
  );
};

export default OnboardingAction;
