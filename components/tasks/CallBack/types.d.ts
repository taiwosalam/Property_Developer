import { StaticImageData } from "next/image";

export interface UserDetailItemsProp {
  label: string;
  value: string;
}
export interface CardBaseProps {
  cardType: "callback" | "visitor";
  requestDate: string;
  requestId: string;
  pictureSrc: string;
  userName: string;
  branch: string;
}

export interface CallRequestCardProps extends CardBaseProps {
  cardType: "callback";
  status: "completed" | "pending";
  phoneNumber: string;
  propertyName: string;
  propertyAddress: string;
  accountOfficer: string;
  resolvedBy: string;
  resolvedDateTime: string;
  cardViewDetails: {
    label: string;
    accessor: keyof CallRequestCardProps;
  }[];
}

export interface VisitorRequestCardProps extends CardBaseProps {
  cardType: "visitor";
  status: "completed" | "pending" | "in-progress";
  visitorName: string;
  visitorPhoneNumber: string;
  secretQuestion: string;
  secretAnswer: string;
  purpose: string;
  propertyName: string;
  cardViewDetails: {
    label: string;
    accessor: keyof VisitorRequestCardProps;
  }[];
}

export type CardProps = CallRequestCardProps | VisitorRequestCardProps;

export interface CallRequestModalProps {
  branch: string;
  requesterName: string;
  requesterPicture: string | StaticImageData;
  requestDate: string;
  phoneNumber: string;
  propertyName: string;
  propertyAddress: string;
  accountOfficer: string;
  resolvedBy: string;
  resolvedDateTime: string;
}
