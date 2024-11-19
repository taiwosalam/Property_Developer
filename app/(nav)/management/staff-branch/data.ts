import type { BranchCardProps } from "@/components/Management/Staff-And-Branches/branch-card";
import type { Field } from "@/components/Table/types";

export interface BranchesPageData {
  total_pages: number;
  current_page: number;
  total_branches: number;
  new_branches_count: number;
  total_properties: number;
  new_properties_count: number;
  total_staffs: number;
  new_staffs_count: number;
  branches: BranchCardProps[];
}

export interface StaffAndBranchPageState {
  gridView: boolean;
  selectedState: string;
  selectedLGA: string;
  localGovernments: string[];
  branchesPageData: BranchesPageData;
}

export const branchTableFields: Field[] = [
  { id: "1", label: "S/N", accessor: "S/N" },
  { id: "2", label: "", accessor: "branch_picture", isImage: true },
  { id: "3", label: "Branch Name", accessor: "branch_title" },
  { id: "4", label: "Branch Address", accessor: "branch_full_address" },
  { id: "5", label: "Branch Manager", accessor: "manager_name" },
  {
    id: "6",
    label: "Total Staff",
    accessor: "staff_count",
    contentStyle: {
      color: "#fff",
      padding: "4px",
      borderRadius: "8px",
      backgroundColor: "#8C62FF",
      display: "grid",
      placeItems: "center",
      width: "32px",
      margin: "auto",
    },
  },
  {
    id: "7",
    label: "Properties",
    accessor: "property_count",
    contentStyle: {
      color: "#fff",
      padding: "4px",
      borderRadius: "8px",
      backgroundColor: "#2DD4BF",
      display: "grid",
      placeItems: "center",
      width: "32px",
      margin: "auto",
    },
  },
  {
    id: "8",
    label: "Units",
    accessor: "unit_count",
    contentStyle: {
      color: "#fff",
      padding: "4px",
      borderRadius: "8px",
      backgroundColor: "#38BDF8",
      display: "grid",
      placeItems: "center",
      width: "32px",
      margin: "auto",
    },
  },
];

export interface BranchApiResponse {
  data: {
    current_page: number;
    last_page: number;
    total: number;
    data: {
      id: number;
      branch_name: string;
      branch_address: string;
      branch_manager: string; // to be added
      picture: string;
      staff_count: number;
      property_count: number;
      unit_count: number;
    }[];
  };
}

export const transformBranchApiResponse = (
  data: BranchApiResponse
): BranchesPageData => {
  return {
    total_pages: data.data.last_page,
    current_page: data.data.current_page,
    total_branches: data.data.total,
    new_branches_count: 0, // to be added
    total_properties: 0, // to be added
    new_properties_count: 0, // to be added
    total_staffs: 0, // to be added
    new_staffs_count: 0, // to be added
    branches: data.data.data.map((branch) => ({
      id: String(branch.id),
      branch_title: branch.branch_name,
      branch_full_address: branch.branch_address,
      manager_name: branch.branch_manager,
      branch_picture: branch.picture,
      staff_count: branch.staff_count,
      property_count: branch.property_count,
      unit_count: branch.unit_count,
      manager_picture: "", // to be added
    })),
  };
};
