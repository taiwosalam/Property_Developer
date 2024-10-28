import { CSSProperties } from "react";

export interface LandlordTenantModalPresetProps {
  back?: {
    handleBack: () => void;
  };
  star?: boolean;
  heading: string;
  style?: CSSProperties;
  children: React.ReactNode;
  lightSeparator?: boolean;
}
