import type { Field } from "@/components/Table/types";
export const reportsPropertiessFilterOptions = [
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
export const propertiesReportTablefields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "ID", accessor: "id" },
  {
    id: "2",
    label: "Property",
    accessor: "property",
  },
  { id: "3", label: "Branch", accessor: "branch" },
  {
    id: "5",
    label: "Account Officer",
    accessor: "account_officer",
    cellStyle: { textTransform: "uppercase" },
  },
  { id: "6", label: "landlord / landlady", accessor: "landlord" },
  { id: "7", label: "Date Created", accessor: "date_created" },
];



interface Property {
  property_id: number;
  landlord_name: string;
  property_name: string;
  branch_name: string;
  account_officer: string;
  created_at: string;
}
interface PropertyData {
  total_properties: number;
  monthly_properties: number;
  properties: Property[];
}

export interface PropertyApiResponse {
  status: string;
  message: string;
  data: PropertyData;
}


// Interface representing the transformed property data
interface TransformedProperty {
  id: number;
  property: string;
  branch: string;
  account_officer: string;
  landlord: string;
  date_created: string;
}

// Interface representing the transformed state
export interface TransformedPropertyData {
  total_properties: number;
  monthly_properties: number;
  properties: TransformedProperty[];
}

const formatPropertyName = (propertyName?: string | null): string => {
  return !propertyName || propertyName === "N/A" ? "__ __" : propertyName;
};

export const transformPropertyData = (apiData: PropertyApiResponse): TransformedPropertyData => {
  const { total_properties, monthly_properties, properties } = apiData.data;

  const transformedProperties = properties.map((property) => ({
    id: property.property_id,
    property: property.property_name,
    branch: property.branch_name,
    account_officer: formatPropertyName(property.account_officer),
    landlord: property.landlord_name,
    date_created: property.created_at,
  }));

  return {
    total_properties,
    monthly_properties,
    properties: transformedProperties,
  };
};
