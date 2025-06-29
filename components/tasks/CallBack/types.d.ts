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
  user?: string;
  userId?: number;
  tier?: string;
  id?: number;
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
  unitName: string;
  id?: number;
  tier_id?: number;
  cardViewDetails: {
    label: string;
    accessor: keyof CallRequestCardProps;
  }[];
}

export interface VisitorRequestCardProps extends RequestCardBaseProps {
  cardType: "visitor";
  status:
    | "completed"
    | "pending"
    | "in-progress"
    | "decline"
    | "checked_in"
    | "cancelled";
  visitorName: string;
  purpose: string;
  id: number;
  tier_id: number;
  visitorPhoneNumber: string;
  secretQuestion: string;
  secretAnswer: string;
  purpose: string;
  propertyName: string;
  unitName?: string;
  branch: string;
  checked_status: string;
  checked_in_by: string | null;
  checked_out_by: string | null;
  check_out_companion: string;
  check_in_companion: string;
  check_in_inventory: string;
  check_out_inventory: string;
  check_in_date: string | null;
  check_out_date: string | null;
  check_in_time: string | null;
  check_out_time: string | null;
  decline_by: string | null;
  decline_date: string | null;
  decline_time: string | null;
  reason: string | null;
  cardViewDetails: {
    label: string;
    accessor: keyof VisitorRequestCardProps;
  }[];
}

export interface PropertyRequestCardProps extends RequestCardBaseProps {
  cardType: "property";
  userId?: number;
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
  location: string;
  
  createdAt: string;
  updatedAt: string;
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
  tier_id?: string | number;
  // targetAudience: string[];
  state: string;
  lga: string;
  expiredDate?: string;
  propertyType: string;
  category: string;
  minBudget: string;
  maxBudget: string;
  subType: string;
  requestType: string;
  description: string;
  phoneNumber: string;
  user?: boolean;
  status?: "active" | "inactive";
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
  tier_id?: number;
}
