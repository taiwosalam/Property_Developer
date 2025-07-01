import { StaticImageData } from "next/image";

export interface InspectionDefaultExport {
  children: React.ReactNode;
  tier?: number;
}

type Image = {
  src: string | StaticImageData;
  isVideo?: boolean;
};
export interface InspectionCardProps {
  type?: "physical" | "virtual";
  data?: {
    id: number;
    property_name: string;
    is_application?: boolean;
    tier: number;
    total_package: string;
    fee_amount: string;
    unit_fee_amount: string;
    address: string;
    address: string;
    images: Image[];
    inspection_type: "virtual_inspection" | "physical_inspection";
    booked_by: string;
    booked_by_id: number;
    inspection_date: string;
    inspection_time: string;
  };
}

type Image = {
  src: string | StaticImageData;
  isVideo?: boolean;
};
export interface InspectionCardInfoProps {
  className?: string;
  unit_fee_period: string;
  image: Image[];
  title: string;
  address: string;
  total_price: string;
  yearly_price: string;
}

export interface InspectionCardDetailProps {
  desc: string;
  title: string;
  verirified?: boolean;
  tier?: number;
}

export interface InspectionCardTitleDescProps {
  desc: string | React.ReactNode;
  title: string;
}
