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

export const initialBranchesPageData: BranchesPageData = {
  total_pages: 1,
  current_page: 1,
  total_branches: 0,
  new_branches_count: 0,
  total_properties: 0,
  new_properties_count: 0,
  total_staffs: 0,
  new_staffs_count: 0,
  branches: [],
};

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
  branch_count: number;
  data: {
    id: string;
    branch_name: string;
    branch_address: string;
    state: string;
    local_government: string;
    city: string;
    // branch_manager: string;  // to be added
    picture: string;
    staffs_count: number;
    properties_count: number;
    // unit_count: number; // to be added
  }[];
  pagination: {
    // total: number;
    // per_page: number;
    current_page: number;
    last_page: number;
  };
}

export const transformBranchApiResponse = (
  response: BranchApiResponse
): BranchesPageData => {
  const { data, branch_count, pagination } = response;
  return {
    total_pages: pagination.last_page,
    current_page: pagination.current_page,
    total_branches: branch_count,
    new_branches_count: 0, // to be added
    total_properties: 0, // to be added
    new_properties_count: 0, // to be added
    total_staffs: 0, // to be added
    new_staffs_count: 0, // to be added
    branches: data.map((branch) => ({
      id: branch.id,
      branch_title: branch.branch_name,
      branch_full_address: `${branch.branch_address}, ${branch.city}, ${branch.local_government}, ${branch.state}`,
      manager_name: "", // to be added
      branch_picture: branch.picture,
      staff_count: branch.staffs_count,
      property_count: branch.properties_count,
      unit_count: 0, // to be added
      manager_picture: "", // to be added
    })),
  };
};

export interface BranchRequestParams {
  page?: number;
  search?: string;
  sort_order?: "asc" | "desc";
  states?: string;
  start_date?: string;
  end_date?: string;
}
