import type { Field } from "@/components/Table/types";
import type { VehicleRecord } from "@/components/tasks/vehicles-record/types";

export const vehicleRecordFIltersOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export const VehicleRecordData: VehicleRecord[] = [
  {
    id: "12345",
    status: "pending",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    name: "John Doe",
    category: "guest",
    registrationDate: "01/01/2024",
    plate_number: "XD9400AA",
    last_update: "02/03/2024 3:30PM",
    checkIn: {
      name: "John Doe",
      passenger: "3",
      date: "01/01/2024",
      inventory:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    },
  },
  {
    status: "completed",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    name: "John Doe",
    id: "123456",
    category: "visitor",
    registrationDate: "01/01/2024",
    plate_number: "KrD2000AA",
    last_update: "02/03/2024 3:30PM",
    checkIn: {
      name: "John Doe",
      passenger: "4",
      date: "01/01/2024",
      inventory:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    },
    checkOut: {
      name: "John Doe",
      passenger: "2",
      date: "01/01/2024",
      inventory:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    },
  },
];

export const veicleRecordTablefields: Field[] = [
  { id: "1", accessor: "pictureSrc", isImage: true, picSize: 40 },
  { id: "2", label: "Name", accessor: "name" },
  { id: "3", label: "Plate Number", accessor: "plate_number" },
  { id: "4", label: "Guest / Visitor", accessor: "category" },
  { id: "5", label: "Last Update", accessor: "last_update" },
  { id: "6", label: "Status", accessor: "status" },
  { id: "7", accessor: "action" },
];
