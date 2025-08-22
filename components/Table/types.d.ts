import { SxProps } from "@mui/material";
import { CSSProperties, ReactNode } from "react";
// Define the type for Fields
export interface Field {
  id: string;
  label?: string;
  accessor: string;
  isImage?: boolean;
  picSize?: number;
  cellStyle?: SxProps; // For styling the cell
  contentStyle?: CSSProperties; // For styling the content inside the cell
}

// Define the type for the data items in the table
export interface DataItem {
  id: string | number;
  [key: string]: any;
}

// Define the props for the CustomTable component
export interface CustomTableProps {
  data: any[];
  fields: Field[];
  displayTableHead?: boolean;
  className?: string;
   lastRowRef?: RefObject<HTMLTableRowElement>;
  handleSelect?: (item: DataItem, e?: React.MouseEvent<HTMLElement>) => void;
  onActionClick?: (item: DataItem, e?: React.MouseEvent<HTMLElement>) => void;
  actionButtonIcon?: ReactNode;
  tableHeadClassName?: string;
  tableHeadStyle?: CSSProperties; // For custom TableHead inline style
  tableHeadCellSx?: SxProps;
  tableBodyCellSx?: CSSProperties;
}
