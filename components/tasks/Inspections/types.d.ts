export interface InspectionDefaultExport {
  children: React.ReactNode;
}

export interface InspectionCardProps {
  type: "physical" | "virtual";
}

export interface InspectionCardInfoProps {
  className?: string;
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
