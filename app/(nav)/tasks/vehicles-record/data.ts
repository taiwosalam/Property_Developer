import type { VehicleRecord } from "@/components/tasks/vehicles-record/types";

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
