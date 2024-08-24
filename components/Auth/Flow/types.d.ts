// Import
import type { FormSteps } from "@/app/auth/types";

export interface FlowComponentProps {
  changeStep: (step: FormSteps) => void;
}
