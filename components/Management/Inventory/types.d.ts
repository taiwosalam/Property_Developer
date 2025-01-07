// Imports
import { inventory_conditions } from "./data";

export interface InventoryCardDataProps {
  inventory_id: string;
  created_date: string;
  created_at?: string;
  last_edited: string;
  updated_at?: string;
  property_name: string;
  branch_name: string;
  account_officer: any;
  branch_id?: string;
  title?: string;
  id?: string;
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
