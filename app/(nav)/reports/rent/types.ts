
  
export type RentListResponse = {
  status: "success" | "error";
  message: string;
  data: {
    total_rents: number;
    current_month_rents: number;
    rents: Rent[];
  };
};

export type Rent = {
  unit_id: number;
  unit_name: string;
  property_name: string;
  tenant_name: string;
  rent_start_date: string;
  rent_end_date: string;
  status: string | null;
  caution_deposit: number;
  total_package: number;
};

export type RentReportData = {
  total_rents: number;
  current_month_rents: number;
  rents: Rent[];
};


