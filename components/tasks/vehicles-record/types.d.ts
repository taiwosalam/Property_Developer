interface CheckInOut {
  name: string;
  passenger: string;
  date: string;
  inventory: string;
}

interface BaseVehicleRecord {
  status: "pending" | "completed";
  pictureSrc: string;
  name: string;
  id: string | number;
  category: "guest" | "visitor";
  registrationDate: string;
  checkIn: CheckInOut;
  plate_number: string;
  last_update: string;
}

interface PendingVehicleRecord extends BaseVehicleRecord {
  status: "pending";
  checkOut?: null;
}

interface CompletedVehicleRecord extends BaseVehicleRecord {
  status: "completed";
  checkOut: CheckInOut;
}

export type VehicleRecord = PendingVehicleRecord | CompletedVehicleRecord;
