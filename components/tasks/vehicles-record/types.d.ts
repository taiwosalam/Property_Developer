interface CheckInOut {
  id: number;
  vehicle_record_id: number;
  in_by: string;
  out_by: string | null;
  passengers_in: number;
  passengers_out: number | null;
  inventory_in: string;
  inventory_out: string | null;
  check_in_time: string;
  check_out_time: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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
  checkOut: CheckInOut;
}

export type VehicleRecord = PendingVehicleRecord | CompletedVehicleRecord;
