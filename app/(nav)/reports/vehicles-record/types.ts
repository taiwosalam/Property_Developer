
export interface VehicleRecordsResponse {
  status: string;
  message: string;
  data: {
    vehicles: VehicleRecord[];
  };
}

export interface VehicleRecord {
  id: number;
  name: string;
  plate_number: string;
  type: string;
  checkin: string;
  checkout: string | null;
  passengers_in: number;
  passengers_out: number | null;
  status: string;
}

export interface VehicleRecordsType {
  id: number;
  full_name: string;
  plate_number: string;
  record_type: string;
  check_in: string;
  check_out: string | null;
  passenger_in: number;
  passenger_out: number | null;
  status: string;
}

export const transformVehicleRecordsData = (
  data: VehicleRecordsResponse
): VehicleRecordsType[] => {
  const { vehicles } = data.data;
  const vehicleData = vehicles.map((vehicle) => {
    return {
      id: vehicle.id,
      full_name: vehicle.name,
      plate_number: vehicle.plate_number,
      record_type: vehicle.type,
      check_in: vehicle.checkin,
      check_out: vehicle.checkout,
      passenger_in: vehicle.passengers_in,
      passenger_out: vehicle.passengers_out,
      status: vehicle.status,
    };
  });
  return vehicleData;
};
