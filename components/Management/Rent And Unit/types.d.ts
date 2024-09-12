import { StaticImageData } from "next/image";

export interface PropertyDetailsProps {
  rent: number;
  cautionDeposit: number;
  serviceCharge: number;
}

export interface ActionButtonProps {
  label: string;
  color: string;
}

interface PropertyImageSliderProps {
  images: StaticImageData[];
  showOverlay: boolean;
}
