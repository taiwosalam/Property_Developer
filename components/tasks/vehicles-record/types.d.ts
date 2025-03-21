interface CheckInOut {
  id: number;
  vehicle_record_id: number;
  in_by: string;
  out_by: string;
  passengers_in: string;
  passengers_out: string;
  inventory_in: string;
  inventory_out: string;
  check_in_time: string;
  check_out_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

interface BaseVehicleRecord {
  status: "pending" | "completed";
  pictureSrc: string;
  name: string;
  id: string | number;
  category: "guest" | "visitor";
  registrationDate: string;
  latest_check_in: CheckInOut;
  plate_number: string;
  last_update: string;
  category: string;
}

interface PendingVehicleRecord extends BaseVehicleRecord {
  status: "pending";
  latest_check_out?: null;
}

interface CompletedVehicleRecord extends BaseVehicleRecord {
  status: "completed";
  checkOut?: CheckInOut;
}

export type VehicleRecord = PendingVehicleRecord | CompletedVehicleRecord;


interface Tenant {
  tenant_id: number;
  name: string;
  gender: string;
  address: string;
  lga: string;
  city: string;
  state: string;
  telephone: string;
  picture: string;
  status: string;
}

interface TenantData {
  total_tenants: number;
  monthly_tenants: number;
  tenants: Tenant[];
}

export interface TenantApiResponse {
  status: string;
  message: string;
  data: TenantData;
}
