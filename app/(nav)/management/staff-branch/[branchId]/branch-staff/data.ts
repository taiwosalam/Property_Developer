import type { Field } from "@/components/Table/types";

export const branchStaffTableFields: Field[] = [
  { id: "1", accessor: "S/N", label: "S/N" },
  { id: "2", accessor: "picture", isImage: true, picSize: 60 },
  { id: "3", accessor: "full_name", label: "Full Name" },
  { id: "4", accessor: "email", label: "Email" },
  { id: "5", accessor: "phone_number", label: "Phone Number" },
  { id: "6", accessor: "position", label: "Position" },
  { id: "7", accessor: "gender", label: "Gender" },
  { id: "8", accessor: "staff_id", label: "Staff ID" },
  { id: "9", accessor: "action" },
];

export const generateBranchStaffTableData = (numItems: number) => {
  const names = [
    "Samuel Teniola Adekunle",
    "Dada Fiyinfoluwa",
    "Abdulrafiu Mubi",
  ];
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    picture: "/empty/SampleLandlord.jpeg",
    full_name: names[index % names.length],
    email: "dontmailme@gmail.com",
    phone_number: "08012345678",
    position: "Senior Dev",
    gender: index % 2 === 0 ? "Male" : "Female",
    staff_id: "1234567890",
  }));
};

export const branchStaffTableData = generateBranchStaffTableData(15);
