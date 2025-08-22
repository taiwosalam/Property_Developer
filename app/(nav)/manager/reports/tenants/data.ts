import type { Field } from "@/components/Table/types";

export const reportsTenantsFilterOptionsWithDropdown = [
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

export const tenantsReportTableFields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "Tenant / Occupant ID", accessor: "id" },
  {
    id: "2",
    label: "Name",
    accessor: "name",
    cellStyle: { textTransform: "uppercase" },
  },
  { id: "3", label: "Gender", accessor: "gender" },
  { id: "4", label: "Contact Address", accessor: "address" },
  { id: "5", label: "Telephone", accessor: "telephone" },
  { id: "6", label: "Status", accessor: "status" },
];

interface Tenant {
  tenant_id: number;
  name: string;
  gender: string;
  address: string;
  lga: string;
  city: string;
  state: string;
  telephone: string;
  status: string;
}

interface Data {
  total_tenants: number;
  monthly_tenants: number;
  tenants: Tenant[];
  pagination: {
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };
}

export interface TenantListResponse {
  status: string;
  message: string;
  data: Data;
}

export interface ITenantListReport {
  id: number | string;
  name: string;
  gender: string;
  address: string;
  telephone: string;
  status: string;
}
export interface TenantReport {
  total_tenants: number;
  monthly_tenants: number;
  tenants: ITenantListReport[];
  pagination: {
    total: number;
    current_page: number;
    last_page: number;
  };
}

export const transformTenantData = (
  data: TenantListResponse
): TenantReport => ({
  total_tenants: data.data.total_tenants,
  monthly_tenants: data.data.monthly_tenants,
  tenants: data.data.tenants.map((tenant) => ({
    id: tenant.tenant_id || "__ __",
    name: tenant.name || "__ __",
    gender: tenant.gender || "__ __",
    address:
      [tenant.address, tenant.lga, tenant.city, tenant.state]
        .filter(Boolean)
        .join(", ") || "__ __",
    telephone: tenant.telephone || "__ __",
    status: tenant.status || "__ __",
  })),
  pagination: {
    total: data?.data?.pagination?.total || 0,
    current_page: data?.data?.pagination?.current_page || 0,
    last_page: data?.data?.pagination?.last_page || 0,
  },
});

export interface ReportsRequestParams {
  page?: number;
  search?: string;
  sort_order?: "asc" | "desc";
  account_officer_id?: string;
  start_date?: string;
  end_date?: string;
  property_id?: string;
  branch_id?: string;
  status?: string;
  is_active?: string;
}
