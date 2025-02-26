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
  unit_description: string;
  status: string;
  annual_rent: string;
};

export type UnitsReportType = {
  total_unit: number;
  monthly_unit: number;
  units: {
    unit_id: number | string;
    property_name: string;
    unit_name: string;
    status: string;
    annual_rent: string;
  }[];
};


const formatPropertyName = (propertyName?: string | null): string => {
  return !propertyName || propertyName === "N/A" ? "__ __" : propertyName;
};

export const transformUnitListData = (data: UnitListResponse): UnitsReportType => {
  return {
    total_unit: data.data.total_units,
    monthly_unit: data.data.published_this_month,
    units: data.data.units.map((unit) => ({
      unit_id: unit.unit_id || "__ __",
      property_name: unit.property_name || "__ __",
      unit_name: unit.unit_name || "__ __",
      status: unit.status || "__ __",
      annual_rent: unit.annual_rent || "__ __",
      unit_description: formatPropertyName(unit.unit_description),
    })),
  };
};
