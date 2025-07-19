import { formatToNaira } from "@/lib/utils";
import { CURRENCY_SIGN } from "./data";

export type UnitListResponse = {
  status: "success" | "error";
  message: string;
  data: {
    total_units: number;
    vacant_units: number;
    occupied_units: number;
    total_published: number;
    published_this_month: number;
    total_unpublished: number;
    unpublished_this_month: number;
    units: Units[];
  };
};

export type Units = {
  unit_id: number;
  property_name: string;
  unit_name: string;
  currency: string;
  unit_description: string;
  status: string;
  annual_rent: string;
  total_package: string;
  period: string;
  is_active: string;
};

export type UnitListRequest = {
  unit_id: number | string;
  unit_name: string;
  status: string;
  period: string;
  total_package: string;
  annual_rent: string;
  currency: string;
};

export type UnitsReportType = {
  total_unit: number;
  monthly_unit: number;
  units: UnitListRequest[];
};

const formatPropertyName = (propertyName?: string | null): string => {
  return !propertyName || propertyName === "N/A" ? "__ __" : propertyName;
};

export const transformUnitListData = (
  data: UnitListResponse
): UnitsReportType => {
  return {
    total_unit: data.data.total_units,
    monthly_unit: data.data.published_this_month,
    units: data.data.units.map((unit) => ({
      unit_id: unit.unit_id || "__ __",
      unit_name: unit.unit_name || "__ __",
      status: unit.is_active || "__ __",
      annual_rent:
        `${CURRENCY_SIGN[unit.currency as keyof typeof CURRENCY_SIGN] || "₦"}${
          unit.annual_rent
        }` || "__ __",
      total_package:
        `${CURRENCY_SIGN[unit.currency as keyof typeof CURRENCY_SIGN] || "₦"}${
          unit.total_package
        }` || "__ __",
      period: unit.period || "__ __",
      currency:
        CURRENCY_SIGN[unit.currency as keyof typeof CURRENCY_SIGN] || "₦",
    })),
  };
};
