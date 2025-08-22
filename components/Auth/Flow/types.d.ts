// Import
import type { FormSteps } from "@/app/(onboarding)/auth/types";

export interface FlowComponentProps {
  changeStep: (step: FormSteps) => void;
}

export interface VerifyEmailAddressProps extends FlowComponentProps {
  type: "sign up" | "forgot password";
}
