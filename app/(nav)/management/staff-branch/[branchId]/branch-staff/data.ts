import type { Field } from "@/components/Table/types";
import type { BranchStaffPageState, StaffListResponse } from "./types";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";

export const branchStaffTableFields: Field[] = [
  { id: "1", accessor: "S/N", label: "S/N" },
  { id: "2", accessor: "picture", isImage: true, picSize: 60 },
  { id: "3", accessor: "name", label: "Full Name" },
  { id: "4", accessor: "email", label: "Email" },
  { id: "5", accessor: "phone_number", label: "Phone Number" },
  { id: "6", accessor: "position", label: "Position" },
  { id: "7", accessor: "gender", label: "Gender" },
  { id: "8", accessor: "id", label: "Staff ID" },
];

const generateBranchStaffTableData = (numItems: number) => {
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

// export const branchStaffTableData = generateBranchStaffTableData(15);

export const transformStaffListResponse = (
  response: StaffListResponse
): BranchStaffPageState => {
  const { data } = response;
  return {
    total_pages: data.pagination.total_pages,
    current_page: data.pagination.current_page,
    branch_name: data.branch.name,
    branch_address: data.branch.address,
    staffs:
      data.staff?.map((s) => ({
        ...s,
        name: s.title ? `${s.title} ${s.name}` : s.name,
        position: s.staff_role,
        phone_number: s.phone,
        gender: "",
        badge_color: s.tier
          ? tierColorMap[s.tier as keyof typeof tierColorMap ]
          : undefined,
      })) || [],
  };
};

// export const transformStaffListResponse = (
//   response: StaffListResponse
// ): BranchStaffPageState => {
//   const { data } = response;
//   return {
//     total_pages: data.pagination.total_pages,
//     current_page: data.pagination.current_page,
//     branch_name: data.branch.name,
//     branch_address: data.branch.address,
//     // branch_address: `${branch.branch_address}, ${branch.city}, ${branch.local_government}, ${branch.state}`,
//     staffs: data.staff.map((s) => {
//       const name = s.title ? `${s.title} ${s.name}` : s.name;
//       return { ...s, name, position: s.staff_role, phone_number: s.phone, gender: "" };
//     }),
//   };
// };
