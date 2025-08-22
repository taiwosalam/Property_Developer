import { CSSProperties } from "react";

export interface LandlordTenantModalPresetProps {
  back?: {
    handleBack: () => void;
  };
  star?: boolean;
  heading: string;
  bodyStyle?: CSSProperties;
  noPaddingTop?: boolean;
  style?: CSSProperties;
  children: React.ReactNode;
  className?: string;
  lightSeparator?: boolean;
  customClose?: () => void;
}
