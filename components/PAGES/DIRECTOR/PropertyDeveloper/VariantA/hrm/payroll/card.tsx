"use client";
import { useState } from "react";
import React from "react";
import SimpleDatePicker from "./calendar";
import StaffSelectionPanel from "@/components/StaffSelectionPanel";
import CustomTable from "@/components/Table/table";
import { PaymentHistory, staffFields } from "./data";
import { staffData } from "./data";
import { Staff } from "./data";
import { Avatar, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CancelIcon, VerticalEllipsisIcon } from "@/public/icons/icons";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";

const StaffTable: React.FC = () => {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const handleActionClick = (row: any) => {
    const staff = staffData.find((s) => s.id === row.id) || null;
    setSelectedStaff(staff);
  };
  const tableData = transformStaffData(staffData, setSelectedStaff);

  return (
    <>
      <CustomTable
        data={tableData}
        fields={staffFields}
        onActionClick={handleActionClick}
        className="max-w-full"
      />

      <Dialog open={!!selectedStaff} onClose={() => setSelectedStaff(null)}>
        <StaffModal
          setSelectedStaff={setSelectedStaff}
          selectedStaff={selectedStaff as Staff}
        />
      </Dialog>
    </>
  );
};

export default StaffTable;

export const transformStaffData = (
  data: Staff[],
  onActionClick: (s: Staff) => void
) =>
  data.map((staff) => ({
    id: staff.id,
    staffCell: (
      <div className="flex items-center gap-2">
        <Avatar src={staff.avatar} sx={{ width: 40, height: 40 }} />
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{staff.name}</span>
          <span className="text-xs text-gray-500">{staff.role}</span>
        </div>
      </div>
    ),
    paydayCell: new Date(staff.payday).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    totalMonthlyCell: `₦${staff.totalMonthly.toLocaleString()}`,
    attendanceCell: `${staff.attendance} days`,
    outstandingCell: `₦${staff.outstanding.toLocaleString()}`,
    actionCell: (
      <button
        onClick={() => onActionClick(staff)}
        className="p-2 grid place-items-center text-gray-500 hover:text-gray-700"
      >
        <VerticalEllipsisIcon />
      </button>
    ),
  }));

interface StaffModalProps {
  selectedStaff: Staff;
  setSelectedStaff: (val: any) => void;
}

export function StaffModal({
  selectedStaff,
  setSelectedStaff,
}: StaffModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!selectedStaff) return null;

  // Left side details
  const staffDetails = [
    { key: "Account Number", value: selectedStaff.accountNumber },
    { key: "Bank Name", value: selectedStaff.bankName },
    { key: "Account Name", value: selectedStaff.accountName },
    { key: "Wallet ID", value: selectedStaff.walletId },
    { key: "Daily Payment", value: selectedStaff.dailyPayment },
  ];

  // Fields for edit mode
  const detailFields = [
    { key: "accountNumber", label: "Account Number", type: "text" },
    { key: "bankName", label: "Bank Name", type: "text" },
    { key: "accountName", label: "Account Name", type: "text" },
    { key: "walletId", label: "Wallet ID", type: "text" },
    { key: "dailyPayment", label: "Daily Payment", type: "number" },
    { key: "deduction", label: "Deduction", type: "number" },
    { key: "bonus", label: "Bonus", type: "number" },
  ];

  // Right side (Payment History)
  const historyFields = [
    { id: "month", accessor: "month", label: "Month" },
    { id: "amount", accessor: "amount", label: "Amount" },
    { id: "date", accessor: "date", label: "Date" },
    { id: "status", accessor: "status", label: "Status" },
  ];

  return (
    <Dialog
      open={!!selectedStaff}
      onClose={() => setSelectedStaff(null)}
      maxWidth="md"
      fullWidth
    >
      <DialogContent className="relative">
        <TwoColumnPanel
          title1="User Details"
          title2="Payment History"
          onClose={() => setSelectedStaff(null)}
          content1={
            !isEditing ? (
              <div className="space-y-3">
                {staffDetails.map(({ key, value }) => (
                  <div key={key} className="flex justify-between pb-1">
                    <span className="font-medium">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
                <div className="sticky bottom-0">
                  <Button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-3">
                {detailFields.map((field) => (
                  <Input
                    key={field.key}
                    id={field.label}
                    label={field.label}
                    type={field.type}
                    defaultValue={selectedStaff[field.key]}
                  />
                ))}
                <div className="flex justify-end sticky bottom-0 gap-2 mt-4">
                  <Button type="submit">Save</Button>
                </div>
              </form>
            )
          }
          content2={
            <CustomTable
              data={transformPaymentHistory(selectedStaff.paymentHistory)}
              fields={historyFields}
            />
          }
        />
      </DialogContent>
    </Dialog>
  );
}

const Title = ({ title }: { title: string }) => {
  return (
    <div className="text-xl bg-white z-50 sticky top-0 font-medium mb-2">
      {title}
    </div>
  );
};

// map statuses to styles
const statusStyles: Record<string, string> = {
  Paid: "bg-red-100 border border-red-300 text-red-600",
  Unpaid: "bg-green-100 border border-green-300 text-green-600",
  Pending: "bg-yellow-100 border border-yellow-300 text-yellow-600",
};

export const transformPaymentHistory = (history: PaymentHistory[]) =>
  history.map((h) => ({
    ...h,
    status: (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          statusStyles[h.status] || "bg-gray-100 border text-gray-600"
        }`}
      >
        {h.status}
      </span>
    ),
    amount: `₦${h.amount.toLocaleString()}`,
  }));

import { ReactNode } from "react";

interface TwoColumnPanelProps {
  title1: string;
  title2: string;
  content1: ReactNode;
  content2: ReactNode;
  onClose?: () => void;
}

export const TwoColumnPanel: React.FC<TwoColumnPanelProps> = ({
  title1,
  title2,
  content1,
  content2,
  onClose,
}) => {
  return (
    <div className="grid grid-cols-2 gap-6 relative">
      {/* Center line */}
      <div className="center absolute z-[100] top-0 h-full w-1 bg-gray-100 transform -translate-x-1/2 left-1/2"></div>

      {/* Close button */}
      {onClose && (
        <div
          onClick={onClose}
          className="cancel absolute z-[100] -top-4 -right-4 p-4 cursor-pointer"
        >
          <CancelIcon />
        </div>
      )}

      {/* Left side */}
      <div className="max-h-[350px] relative no-scrollbar overflow-y-auto">
        <h3 className="text-lg z-[100] sticky top-0 bg-white font-semibold mb-4">
          {title1}
        </h3>
        {content1}
      </div>

      {/* Right side */}
      <div className="relative">
        <h3 className="text-lg z-[100] sticky top-0 bg-white font-semibold mb-4">
          {title2}
        </h3>
        {content2}
      </div>
    </div>
  );
};

// Mock data
const mockStaff = [
  {
    id: 1,
    name: "David Adekunle Ajala",
    position: "Manager",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Mary Johnson",
    position: "Accountant",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "James Smith",
    position: "Engineer",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    id: 4,
    name: "Sophia Brown",
    position: "HR",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 5,
    name: "Michael Davis",
    position: "Developer",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: 6,
    name: "Emma Wilson",
    position: "Designer",
    avatar: "https://randomuser.me/api/portraits/women/85.jpg",
  },
  {
    id: 1,
    name: "David Adekunle Ajala",
    position: "Manager",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Mary Johnson",
    position: "Accountant",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "James Smith",
    position: "Engineer",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  },
];

export const CalendarAndStaffPanel: React.FC = () => {
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleStaffSelect = (staffId: number) => {
    setSelectedStaffIds((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  return (
    <div className="bg-white w-[600px] max-w-[90%] rounded-2xl p-6 ">
      <TwoColumnPanel
        title1="Staffs"
        title2="Pick a Date"
        content1={
          <StaffSelectionPanel
            staffList={mockStaff}
            selectedStaff={selectedStaffIds}
            onStaffSelect={handleStaffSelect}
          />
        }
        content2={
          <div>
            <SimpleDatePicker
              initialDate={selectedDate}
              onDateChange={setSelectedDate}
            />

            <div className="mt-2 gap-2 justify-end flex h-max butn">
              <Button size="sm" className="whitespace-nowrap">
                Pay Selected
              </Button>
              <Button size="sm" className="whitespace-nowrap">
                Pay All
              </Button>
            </div>
          </div>
        }
        onClose={() => console.log("Panel closed")}
      />
    </div>
  );
};
