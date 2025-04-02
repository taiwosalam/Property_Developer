// import { states } from "@/data";
import { getAllStates } from "@/utils/states";
import { InspectionPage, InspectionDataApiResponse } from "./type";

export const inspectionFilterOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export const articleOptions = [
  { label: "All Articles", value: "all" },
  { label: "Trending Articles", value: "trending" },
  { label: "New Articles", value: "new" },
];

export const propertyRequestOptions = [
  { label: "All Property Request", value: "all" },
  { label: "Trending Property Request", value: "trending" },
  { label: "New Property Request", value: "new" },
];

const states = getAllStates();

export const stateOptions = [
  {
    label: "State",
    value: states.map((state) => ({ label: state, value: state })),
  },
];

export const teamChatOptions = [
  { label: "Moniya Branch", value: "moniya" },
  { label: "Germany Branch", value: "germany" },
  { label: "Tokyo Branch", value: "tokyo" },
  { label: "Ontario Branch", value: "ontario" },
  { label: "Australia Branch", value: "australia" },
];

export const transformInspectionCard = (
  data: InspectionDataApiResponse
): InspectionPage => {
  return {
    total_inspections: data?.total_inspections ?? 0,
    total_months: data?.total_months ?? 0,
    total_physical: data?.total_physical ?? 0,
    total_physical_month: data?.total_physical_month ?? 0,
    total_virtual: data?.total_virtual ?? 0,
    total_virtual_month: data?.total_virtual_month ?? 0,
    card:
      data?.inspections.map((item) => {
        return {
          id: item?.id,
          property_name: item?.property_name,
          price: item?.total_package,
          address: item?.full_address,
          yearly_price: "",
          inspection_type: item?.inspection_type,
          booked_by: item?.booked_by,
          inspection_date: item?.inspection_date,
          inspection_time: item?.inspection_time,
        };
      }) ?? [],
  };
};
