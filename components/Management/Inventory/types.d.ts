// Imports
import { StaticImageData } from "next/image";
import { inventory_conditions } from "./data";

export interface InventoryCardDataProps {
  inventory_id: string;
  created_date: string;
  created_at?: string;
  last_edited: string;
  updated_at?: string;
  // property_name: string;
  branch_name: string;
  account_officer: any;
  branch_id?: string;
  title?: string;
  id?: string;
  total_unit: number;
  imgSrc?: string;
  property_id?: number;
  property_image?: {
    path: string;
  }[];
}

export interface AccountOfficer {
  name: string;
}


export interface InventoryCardProps {
  data: Partial<InventoryCardDataProps>;
  viewOnly?: boolean;
}

export interface InventoryListProps extends InventoryCardProps {}

export interface InventoryListInfoProps {
  chunkSize?: number;
  data: Partial<InventoryCardDataProps>;
}

export type InventoryConditions = (typeof inventory_conditions)[number];

export interface InventoryItemProps {
  edit?: boolean;
  index?: number;
  // inventoryFiles?: File[][];
  // setInventoryFiles?: (files: File[][]) => void;
  inventoryFiles: File[][];
  setInventoryFiles: React.Dispatch<React.SetStateAction<File[][]>>;
  video?: string;
  data?: {
    name: string;
    quantity: number;
    description?: string;
    condition: InventoryConditions;
    images: string[];
    unit?: string;
  };
}

export interface InventoryFieldProps {
  children: React.ReactNode;
  heading?: string;
}


export interface FetchData {
  data: {
    id: string;
    title: string;
    video: string;
    branch_name: string;
    branch_id: string;
    created_date: string;
    // edited_date: string;
    updated_at?: string;
    property_name: string;
    account_officer: string;
    items: {
      id: string;
      description: string;
      image: any[];
      unit: string;
      condition: string;
    };
  };
}

export interface InventoryData {
  title: string;
  inventory_id: string;
  created_date: string;
  edited_date: string;
  property_name: string;
  branch_name: string;
  account_officer: string;
  branch_id: string;
  video?: string;
}

export interface PropertyDetailsProps {
  rent: number;
  cautionDeposit: number;
  serviceCharge: number;
}

export interface ActionButtonProps {
  label: string;
  color: string;
  route?: string;
  modal?: string;
}

interface PropertyImageSliderProps {
  images: StaticImageData[] | string[];
  showOverlay?: boolean;
  thread?: boolean;
}
export interface UnitDetails {
  //   id: string;
  title: string;
  location: string;
  categories: string;
  unitNumber: string;
  unitPreference: string;
  unitType: string;
  unitSubType: string;
  state: string;
  localGovernment: string;
  accountOfficer: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  newTenantPrice: number;
  renewalTenantPrice: number;
  images: string[];
}

export interface Occupant {
  id: string;
  name: string;
  email: string;
  userTag: "mobile" | "web";
  avatar: string;
  gender: string;
  birthday: string;
  religion: string;
  phone: string;
  maritalStatus: string;
  address: string;
  city: string;
  state: string;
  lg: string;
}

export interface FeeDetail {
  name: string;
  amount: number;
}
