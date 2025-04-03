export interface InspectionDefaultExport {
  children: React.ReactNode;
}

export interface InspectionCardProps {
  type?: "physical" | "virtual"
  data?: {
    id: number;
    property_name: string;
    price: string;
    address: string;
    unit_fee_period: string;
    yearly_price: string;
    inspection_type: "virtual_inspection" | "physical_inspection";
    booked_by: string;
    inspection_date: string;
    inspection_time: string;
  }
}

export interface InspectionCardInfoProps {
  className?: string;
  unit_fee_period: string;
  image: string | null;
  title: string;
  address: string;
  total_price: string;
  yearly_price: string;
}

export interface InspectionCardDetailProps {
  desc: string;
  title: string;
  verirified?: boolean;
}

export interface InspectionCardTitleDescProps {
  desc: string;
  title: string;
}
