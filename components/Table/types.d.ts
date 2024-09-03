// Define the type for Fields
export interface Field {
  id: string;
  label?: string;
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
  displayTableHead?: boolean;
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
