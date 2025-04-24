import { staffTierColorMap, tierColorMap } from "@/components/BadgeIcon/badge-icon";
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
  branches_monthly_count: number;
  property_count: number;
  properties_monthly_count: number;
  staff_count: number;
  staff_monthly_count: number;
  data: {
    id: string;
    branch_name: string;
    branch_address: string;
    state: string;
    local_government: string;
    city: string;
    picture: string;
    staffs_count: number;
    properties_count: number;
    units_count: number;
    is_active: 1 | 0;
    manager: {
      id: string;
      name: string;
      tier: 1 | 2 | 3 | 4| 5;
      picture: string | null;
    } | null;
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
    new_branches_count: response.branches_monthly_count,
    total_properties: response.property_count,
    new_properties_count: response.properties_monthly_count,
    total_staffs: response.staff_count,
    new_staffs_count: response.staff_monthly_count,
    branches: data.map((branch) => ({
      id: branch.id,
      branch_title: branch.branch_name,
      is_active: branch.is_active,
      branch_full_address: `${branch.branch_address}, ${branch.city}, ${branch.local_government}, ${branch.state}`,
      manager_name: branch.manager?.name || "",
      branch_picture: branch.picture,
      staff_count: branch.staffs_count || 0,
      property_count: branch.properties_count || 0,
      unit_count: branch.units_count || 0,
      manager_picture: branch.manager?.picture || null,
      badgeColor: branch?.manager?.tier && "gray"
      // badgeColor: branch?.manager?.tier
      //   ? staffTierColorMap[branch?.manager?.tier as keyof typeof staffTierColorMap]
      //   : undefined,
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
