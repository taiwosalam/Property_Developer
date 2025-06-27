// import { states } from "@/data";
import { getAllStates } from "@/utils/states";
import {
  InspectionPageType,
  InspectionDataApiResponse,
  InspectionDetailsApiResponse,
} from "./type";
import { transformUnitDetails } from "../../listing/data";
import { boolean } from "zod";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { formatTime } from "../../notifications/data";

dayjs.extend(advancedFormat);

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

export const formatToNaira = (amount: string | number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(Number(amount));
};

export type TInspectionDetails = {
  id: number;
  property_name: string;
  total_package: string;
  fee_amount: string;
  unit_fee_amount: string;
  inspection_type: "physical_inspection" | "virtual_inspection";
  address: string;
  images: { src: string }[];
  booked_by: string;
  booked_by_id: number;
  inspection_date: string;
  inspection_time: string;
  phone: string;
  branch_name: string;
  property: string;
  description: string;
  tier: number;
  userId: number;
};

function formatReadableDate(dateString: string): string {
  if (
    !dateString ||
    dateString === "0000-00-00" ||
    !dayjs(dateString).isValid()
  ) {
    return "___ ___";
  }

  return dayjs(dateString).format("Do, MMMM YYYY");
}

export const transformInspectionDetails = (
  data: InspectionDetailsApiResponse
): TInspectionDetails => {
  const inspections = data?.data;

  return {
    id: inspections?.id ?? 0,
    userId: inspections?.unit?.user_id,
    tier: inspections?.tier,
    property_name: inspections?.unit
      ? transformUnitDetails(inspections?.unit)
      : "___ ____",
    total_package: inspections?.unit
      ? formatToNaira(inspections?.unit?.total_package)
      : "___ ___",
    fee_amount: inspections?.unit?.fee_amount
      ? formatToNaira(inspections?.unit?.fee_amount)
      : "___ ___",
    unit_fee_amount: inspections?.unit?.fee_period || "___ ___",
    inspection_type: inspections?.inspection_type || "virtual_inspection",
    address:
      `${inspections?.full_address}, ${inspections?.city_area}, ${inspections?.local_government} ${inspections?.state}` ||
      "___ ___",
    images:
      inspections?.unit?.images.map((img) => {
        return { src: img.path };
      }) || [],
    booked_by: inspections?.booked_by
      ? inspections?.booked_by.toLowerCase()
      : "___ ___",
    booked_by_id: inspections?.booked_by_id,
    inspection_date: inspections?.inspection_date
      ? formatReadableDate(inspections?.inspection_date)
      : "___ ___",
    inspection_time: inspections?.inspection_time
      ? formatTime(inspections?.inspection_time)
      : "___ ___",
    phone: inspections?.phone || "___ ___",
    branch_name: inspections?.unit?.property?.branch?.branch_name || "___ ___",
    property: inspections?.property_name || "___ ___",
    description: inspections?.description || "___ ___",
  };
};

export const transformInspectionCard = (
  data: InspectionDataApiResponse
): InspectionPageType => {
  return {
    total_inspections: data?.total_inspections ?? 0,
    total_months: data?.total_months ?? 0,
    total_physical: data?.total_physical ?? 0,
    total_physical_month: data?.total_physical_month ?? 0,
    total_virtual: data?.total_virtual ?? 0,
    total_virtual_month: data?.total_virtual_month ?? 0,
    total_page: data.pagination?.total_pages,
    current_page: data?.pagination?.current_page,
    card:
      data?.inspections.map((item) => {
        return {
          id: item?.id,
          property_id: item?.unit?.property_id,
          tier: item?.tier,
          property_name: item?.unit
            ? transformUnitDetails(item?.unit)
            : "___ ____",
          total_package: item?.unit?.total_package
            ? formatToNaira(item?.unit?.total_package)
            : "___ ___",
          fee_amount: item?.unit?.fee_amount
            ? formatToNaira(item?.unit?.fee_amount)
            : "___ ___",
          unit_fee_amount: item?.unit?.fee_period || "___ ___",
          inspection_type: item?.inspection_type || "virtual_inspection",
          address:
            `${item?.full_address}, ${item?.city_area}, ${item?.local_government} ${item.state}` ||
            "___ ___",
          images:
            item?.unit?.images.map((img) => {
              return { src: img.path };
            }) || [],
          booked_by: item?.booked_by
            ? item?.booked_by.toLowerCase()
            : "___ ___",
          booked_by_id: item?.booked_by_id,
          inspection_date: formatReadableDate(item?.inspection_date),
          inspection_time: item?.inspection_time || "___ ___",
        };
      }) ?? [],
  };
};

export interface InspectionRequestParams {
  page?: number;
  search?: string;
  sort_order?: "asc" | "desc";
  start_date?: string;
  end_date?: string;
  property_ids?: string;
}
export interface FilterResult {
  options: string[];
  menuOptions: { [key: string]: string[] };
  startDate: string | null;
  endDate: string | null;
}
