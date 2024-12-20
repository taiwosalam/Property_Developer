import { ChartConfig } from "@/components/ui/chart";
import type {
  SingleBranchResponseType,
  SingleBranchPageData,
  EditBranchFormData,
} from "./types";

export const branchIdChartConfig = {
  sales: {
    label: "Sales",
    color: "#38BDF8",
  },
  profits: {
    label: "Profits",
    color: "#2DD4BF",
  },
  expenses: {
    label: "Expenses",
    color: "#E9212E",
  },
} satisfies ChartConfig;

export const branchIdChartData = [
  { date: "2024-09-01", profits: 50, sales: 70, expenses: 30 },
  { date: "2024-09-02", profits: 90, sales: 100, expenses: 60 },
  { date: "2024-09-03", profits: 30, sales: 40, expenses: 20 },
  { date: "2024-09-08", profits: 110, sales: 120, expenses: 80 },
  { date: "2024-08-18", profits: 60, sales: 70, expenses: 50 },
  { date: "2024-08-20", profits: 130, sales: 150, expenses: 90 },
  { date: "2024-08-28", profits: 80, sales: 100, expenses: 60 },
  { date: "2024-09-30", profits: 120, sales: 140, expenses: 100 },
];

export const transformSingleBranchAPIResponse = (
  response: SingleBranchResponseType
): SingleBranchPageData => {
  const {
    data: { branch, manager },
  } = response;

  return {
    branch_name: branch.branch_name,
    address: `${branch.branch_address}, ${branch.city}, ${branch.local_government}, ${branch.state}`,
    properties: { total: branch.properties_count, new_this_month: 0 },
    landlords: { total: 0, new_this_month: 0 },
    tenants: { total: 0, new_this_month: 0 },
    vacant_units: { total: 0, new_this_month: 0 },
    expired: { total: 0, new_this_month: 0 },
    invoices: { total: 0, new_this_month: 0 },
    inquiries: { total: 0, new_this_month: 0 },
    complaints: { total: 0, new_this_month: 0 },
    listings: { total: 0, new_this_month: 0 },
    staffs: branch.staffs.map((s) => {
      return {
        avatarSrc: "",
        name: `${s.title ? s.title + " " : ""}${s.name}`,
        position: s.staff_role,
        staff_ID: s.id,
      };
    }),
    hasManager: manager.length > 0,
  };
};

export const transformSingleBranchAPIResponseToEditBranchFormDetails = (
  response: SingleBranchResponseType
): EditBranchFormData => {
  const {
    data: { branch },
  } = response;
  return {
    id: branch.id,
    branch_name: branch.branch_name,
    isActive: branch.is_active,
    state: branch.state,
    local_government: branch.local_government,
    city: branch.city,
    address: branch.branch_address,
    description: branch.branch_desc,
    picture: branch.picture,
    wallet: "no",
    // wallet: "no",
  };
};
