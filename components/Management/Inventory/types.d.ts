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
  data: Partial<InventoryCardDataProps>;
}
