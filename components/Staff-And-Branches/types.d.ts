import { ReactNode, CSSProperties } from "react";
import { SxProps, Theme } from "@mui/system";

export interface BranchCardProps {
  id: string | number;
  branch_title?: string;
  branch_full_address?: string;
  avatar?: string | null;
  manager_name?: string;
  manager_avatar?: string | null;
  staff_count?: number;
  property_count?: number;
  unit_count?: number;
}
// Define the type for Fields
export interface Field {
  id: string;
  label: string;
  accessor: string;
  isImage?: boolean;
  cellStyle?: SxProps; // For styling the cell
  contentStyle?: CSSProperties; // For styling the content inside the cell
}

// Define the type for the data items in the table
export interface DataItem {
  id: string | number;
  [key: string]: any; // Allow any additional fields
}

// Define the props for the CustomTable component
export interface CustomTableProps {
  data: DataItem[];
  fields: Field[];
  className?: string;
  handleSelect?: (item?: DataItem) => void;
  actionButtonIcon?: ReactNode;
  tableHeadClassName?: string;
  tableHeadStyle?: React.CSSProperties; // For custom TableHead inline style
  tableHeadCellSx?: SxProps;
  tableBodyCellSx?: SxProps;
  evenRowColor?: CSSProperties["color"];
  oddRowColor?: CSSProperties["color"];
}
