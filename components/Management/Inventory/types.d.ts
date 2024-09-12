// Imports
import { inventory_conditions } from "./data";

export interface InventoryCardDataProps {
  inventory_id: string;
  created_date: string;
  edited_date: string;
  property_name: string;
  branch_name: string;
  account_officer: string;
}

export interface InventoryCardProps {
  data: Partial<InventoryCardDataProps>;
}

export interface InventoryListProps extends InventoryCardProps {}

export interface InventoryListInfoProps {
  chunkSize?: number;
  data: Partial<InventoryCardDataProps>;
}

export type InventoryConditions = (typeof inventory_conditions)[number];

export interface InventoryItemProps {
  edit?: boolean;
  data?: {
    name: string;
    quantity: number;
    condition: InventoryConditions;
    image: string;
  };
}

export interface InventoryFieldProps {
  children: React.ReactNode;
}
