import Avatar from "@mui/material/Avatar";
import CustomTable from "@/components/Table/table";
import { Field } from "@/components/Table/types";

// Data type
interface DataItem {
  _id: string;
  staffName: string;
  orderId: string;
  category: string[];
  quantity: number;
  amount: string;
  unit: number;
  dateTime: string;
  status: string;
  avatar: string;
}

// Sample data
const tableData: DataItem[] = [
  {
    _id: "1",
    staffName: "David Adekunle Ajala",
    orderId: "1234567890",
    category: ["Materials", "Others"],
    quantity: 20,
    amount: "₦21,500",
    unit: 20,
    dateTime: "02/08/24 12:43 PM",
    status: "Pending",
    avatar: "path/to/avatar1.jpg",
  },
  {
    _id: "2",
    staffName: "David Adekunle Ajala",
    orderId: "1234567890",
    category: ["Materials", "Tools", "Plant & Equipments"],
    quantity: 21,
    amount: "₦21,500",
    unit: 21,
    dateTime: "02/08/24 12:43 PM",
    status: "New",
    avatar: "path/to/avatar2.jpg",
  },
  {
    _id: "2",
    staffName: "David Adekunle Ajala",
    orderId: "1234567890",
    category: ["Materials", "Tools", "Plant & Equipments"],
    quantity: 21,
    amount: "₦21,500",
    unit: 21,
    dateTime: "02/08/24 12:43 PM",
    status: "New",
    avatar: "path/to/avatar2.jpg",
  },
  {
    _id: "2",
    staffName: "David Adekunle Ajala",
    orderId: "1234567890",
    category: ["Materials", "Tools", "Plant & Equipments"],
    quantity: 21,
    amount: "₦21,500",
    unit: 21,
    dateTime: "02/08/24 12:43 PM",
    status: "New",
    avatar: "path/to/avatar2.jpg",
  },
  {
    _id: "2",
    staffName: "David Adekunle Ajala",
    orderId: "1234567890",
    category: ["Materials", "Tools", "Plant & Equipments"],
    quantity: 21,
    amount: "₦21,500",
    unit: 21,
    dateTime: "02/08/24 12:43 PM",
    status: "New",
    avatar: "path/to/avatar2.jpg",
  },
];

// Helpers for badge colors
const getCategoryColor = (category: string) => {
  switch (category) {
    case "Materials":
      return "#3B82F6";
    case "Tools":
      return "#22D3EE";
    case "Plant & Equipments":
      return "#A855F7";
    case "Others":
      return "#F472B6";
    default:
      return "#D1D5DB";
  }
};
const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "#F59E0B";
    case "New":
      return "#3B82F6";
    case "Delivered":
      return "#10B981";
    case "Canceled":
      return "#EF4444";
    case "Record":
      return "#6B7280";
    default:
      return "#D1D5DB";
  }
};

// Table fields: separate avatar and name
const tableFields: Field[] = [
  {
    id: "avatar",
    accessor: "avatarCell",
    label: "",
  },
  {
    id: "staffName",
    accessor: "staffNameCell",
    label: "Staff Name",
  },
  { id: "orderId", accessor: "orderId", label: "Order ID" },
  { id: "category", accessor: "categoryCell", label: "Category" },
  { id: "quantity", accessor: "quantity", label: "Quantity" },
  { id: "amount", accessor: "amount", label: "Amount" },
  { id: "unit", accessor: "unit", label: "Unit" },
  { id: "dateTime", accessor: "dateTime", label: "Date/Time" },
  { id: "status", accessor: "statusCell", label: "Status" },
];

// Transform data for table
const transformedData = tableData.map((d) => ({
  ...d,
  avatarCell: <Avatar src={d.avatar} sx={{ width: 40, height: 40 }} />,
  staffNameCell: <span>{d.staffName}</span>,
  categoryCell: (
    <div className="flex flex-wrap gap-2 max-w-[200px]">
      {d.category.map((c) => {
        const color = getCategoryColor(c);
        return (
          <span
            key={c}
            style={{
              backgroundColor: color + "80", // 50% opacity using hex alpha
              border: `1px solid ${color}`,
              color: color,
              borderRadius: "4px",
              padding: "2px 6px",
              fontSize: "12px",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {c}
          </span>
        );
      })}
    </div>
  ),
  statusCell: (
    <span
      style={{
        backgroundColor: getStatusColor(d.status) + "80", // 50% opacity
        border: `1px solid ${getStatusColor(d.status)}`, // full color border
        color: getStatusColor(d.status), // full color text
        borderRadius: "4px",
        padding: "2px 6px",
        fontSize: "12px",
        textAlign: "center",
        display: "inline-block",
      }}
    >
      {d.status}
    </span>
  ),
}));

const InventoryTable: React.FC = () => {
  return (
    <CustomTable
      data={transformedData}
      fields={tableFields}
      tableBodyCellSx={{ padding: "8px" }}
    />
  );
};

export default InventoryTable;
