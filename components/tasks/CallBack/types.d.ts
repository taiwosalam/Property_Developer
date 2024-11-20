import { StaticImageData } from "next/image";

export interface UserDetailItemsProp {
  label: string;
  value: string;
}
export interface RequestCardBaseProps {
  cardType: "callback" | "visitor" | "property" | "deopsit" | "agent-community";
  requestDate: string;
  pictureSrc: string;
  userName: string;
  requestId: string;
}

export interface CallRequestCardProps extends RequestCardBaseProps {
  cardType: "callback";
  status: "completed" | "pending";
  phoneNumber: string;
  propertyName: string;
  propertyAddress: string;
  accountOfficer: string;
  resolvedBy: string;
  resolvedDateTime: string;
  branch: string;
  cardViewDetails: {
    label: string;
    accessor: keyof CallRequestCardProps;
  }[];
}

export interface VisitorRequestCardProps extends RequestCardBaseProps {
  cardType: "visitor";
  status: "completed" | "pending" | "in-progress" | "decline";
  visitorName: string;
  visitorPhoneNumber: string;
  secretQuestion: string;
  secretAnswer: string;
  purpose: string;
  propertyName: string;
  branch: string;
  cardViewDetails: {
    label: string;
    accessor: keyof VisitorRequestCardProps;
  }[];
}

export interface PropertyRequestCardProps extends RequestCardBaseProps {
  cardType: "property";
  state: string;
  lga: string;
  propertyType: string;
  category: string;
  minBudget: string;
  maxBudget: string;
  subType: string;
  requestType: string;
  description: string;
  phoneNumber: string;
  cardViewDetails: {
    label: string;
    accessor: keyof PropertyRequestCardProps;
  }[];
}

export interface DepositRequestCardProps extends RequestCardBaseProps {
  cardType: "deposit";
  status: "completed" | "pending";
  propertyName: string;
  unitDetails: string;
  state: string;
  amount: string;
  branch: string;
  cardViewDetails: {
    label: string;
    accessor: keyof DepositRequestCardProps;
  }[];
}

export interface AgentCommunityRequestCardProps extends RequestCardBaseProps {
  cardType: "agent-community";
  userTitle: string;
  propertyTitle: string;
  targetAudience: string[];
  state: string;
  lga: string;
  propertyType: string;
  category: string;
  minBudget: string;
  maxBudget: string;
  subType: string;
  requestType: string;
  description: string;
  phoneNumber: string;
  user?: boolean;
  cardViewDetails: {
    label: string;
    accessor: keyof AgentCommunityRequestCardProps;
  }[];
}

export type RequestCardProps =
  | CallRequestCardProps
  | VisitorRequestCardProps
  | PropertyRequestCardProps
  | DepositRequestCardProps
  | AgentCommunityRequestCardProps;

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
