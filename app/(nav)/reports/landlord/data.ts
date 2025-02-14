import type { Field } from "@/components/Table/types";

export const reportsLandlordsFilterOptionsWithDropdown = [
  {
    label: "Account Officer",
    value: [
      { label: "Account Officer 1", value: "account_officer1" },
      { label: "Account Officer 2", value: "account_officer2" },
      { label: "Account Officer 3", value: "account_officer3" },
    ],
  },
  {
    label: "Branch",
    value: [
      { label: "Branch 1", value: "Branch1" },
      { label: "Branch 2", value: "Branch2" },
      { label: "Branch 3", value: "Branch3" },
    ],
  },
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export const landlordsReportTableFields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "ID", accessor: "id" },
  {
    id: "2",
    label: "Property",
    accessor: "property",
  },
  { id: "3", label: "Branch", accessor: "branch" },
  { id: "5", label: "Account Officer", accessor: "account_officer" },
  { id: "6", label: "Date Created", accessor: "date_created" },
  { id: "7", label: "Landlord / Landlady", accessor: "landlord" },
];

const generateTableData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: (index + 1).toString(),
    property: `Property ${index + 1}`,
    branch: `Branch ${index + 1}`,
    account_officer: `Account Officer ${index + 1}`,
    date_created: `6/10/2024`,
    landlord: `John Doe`,
  }));
};

export const landlordsReportTableData = generateTableData(10);


// Original API interfaces
export interface Landlord {
  landlord_id: number;
  landlord_name: string;
  property_name: string;
  branch_name: string;
  account_officer: string;
  created_at: string;
}

export interface LandlordsOriginalData {
  total_landlords: number;
  monthly_landlords: number;
  landlords: Landlord[];
}

export interface LandlordsApiResponse {
  status: string;
  message: string;
  data: {
    headers: Record<string, unknown>;
    original: {
      status: string;
      message: string;
      data: LandlordsOriginalData;
    };
    exception: any;
  };
}

// Transformed data interfaces
export interface LandlordReportEntry {
  id: number;
  property: string;
  branch: string;
  account_officer: string;
  date_created: string;
  landlord: string;
}

export interface LandlordsReport {
  total_landlords: number;
  monthly_landlords: number;
  landlords: LandlordReportEntry[];
}

// Transformation function
export const transformLandlordsData = (apiResponse: LandlordsApiResponse): LandlordsReport => {
  const { total_landlords, monthly_landlords, landlords } = apiResponse.data.original.data;
  return {
    total_landlords,
    monthly_landlords,
    landlords: landlords.map((item) => ({
      id: item.landlord_id,
      property: item.property_name,
      branch: item.branch_name,
      account_officer: item.account_officer,
      date_created: item.created_at,
      landlord: item.landlord_name,
    })),
  };
};

// // You might also have your table fields and filter options defined here
// export const landlordsReportTableFields = [
//   { key: "id", label: "ID" },
//   { key: "property", label: "Property" },
//   { key: "branch", label: "Branch" },
//   { key: "account_officer", label: "Account Officer" },
//   { key: "date_created", label: "Date Created" },
//   { key: "landlord", label: "Landlord" },
// ];

// export const reportsLandlordsFilterOptionsWithDropdown = [
//   // ... your filter options
// ];
