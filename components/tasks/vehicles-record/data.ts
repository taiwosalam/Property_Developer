import { IndividualTenantAPIResponse } from "@/app/(nav)/management/tenants/[tenantId]/manage/data";
import api, { handleAxiosError } from "@/services/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { PersonalDataProps } from "./form-sections";

// export const createVehicleRecord = async (data: any) => {
//   try {
//     const response = await api.post("/vehicle-records", data);
//     return response.status === 200 || response.status === 201;
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       const errorMessage = error.response?.data?.message || error.message;
//       const additionalErrors = error.response?.data?.errors.messages;
//       const idError = error?.response?.data.error;
//       if (idError) {
//         if (typeof idError === "string" && idError.trim() !== "") {
//           toast.error(`Error: ${idError}`);
//         }
//       } else {
//         toast.error(`Error: ${errorMessage}`);
//       }
//       if (additionalErrors) {
//         Object.keys(additionalErrors).forEach((key) => {
//           additionalErrors[key].forEach((msg: string) => {
//             toast.error(`Error: ${msg}`);
//           });
//         });
//       }
//     } else {
//       console.error(error);
//       toast.error("An unexpected error occurred.");
//     }
//     return false;
//   }
// };

export const createVehicleRecord = async (data: any) => {
  try {
    const res = await api.post("/vehicle-records", data);
    if (res.status === 200 || res.status === 201) {
      return true;
    }
  } catch (err) {
    handleAxiosError(err);
    return false;
  }
};
export const updateVehicleDetails = async (data: any, id: number) => {
  try {
    const response = await api.post(`/vehicle-records/${id}`, data);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const checkOutVehicle = async (data: any, id: number) => {
  try {
    const response = await api.post(`/vehicle-records/check-out/${id}`, data);
    // if(response.status === 200 || response.status === 201) {
    //   return true
    // }
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

// /vehicle-record/check-out/1

export const checkInVehicle = async (data: any) => {
  try {
    const response = await api.post(`/vehicle-records/check-in`, data);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export function formatCustomDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = String(date.getUTCFullYear()).slice(-2);

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${day}${month}${year} - ${hours}${minutes}${seconds}`;
}

export const updateVehicleRecord = async (data: any, id: number) => {
  try {
    const response = await api.patch(`/vehicle-record/${id}`, data);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error(error);
    handleAxiosError(error);
  }
};

export const transformTenant = (
  // data: IndividualTenantAPIResponse | null //uncomment and fix later
  data: any | null
): PersonalDataProps => {
  const tenant = data?.data;
  return {
    id: Number(tenant?.id),
    full_name: tenant?.name || "",
    state: tenant?.state || "",
    local_government: tenant?.local_government || "",
    city: tenant?.city || "",
    address: tenant?.address || "",
    phone_number: tenant?.phone || "",
    avatar: tenant?.picture || "",
  };
};

export const vehicleData = {
  Cars: {
    brands: [
      "Acura",
      "Alfa Romeo",
      "Aston Martin",
      "Avatr",
      "BAIC",
      "BAW",
      "Bentley",
      "BMW",
      "Brabus",
      "Brilliance",
      "Buick",
      "Cadillac",
      "Changan",
      "Chevrolet",
      "Chery",
      "Chrysler",
      "Citroen",
      "Dacia",
      "Daewoo",
      "Daihatsu",
      "Dongfeng",
      "Ferrari",
      "Fiat",
      "Foton",
      "Geely",
      "Genesis",
      "Higer",
      "Huawei",
      "Hummer",
      "International",
      "Isuzu",
      "IVM",
      "Jetour",
      "JAC",
      "JMC",
      "King Long",
      "Lamborghini",
      "Lancia",
      "Land Rover",
      "Lincoln",
      "MAN",
      "Maruti Suzuki",
      "Maserati",
      "Maxus",
      "Mercury",
      "MG",
      "Mikano ZNA",
      "Mitsubishi",
      "Nord",
      "Oldsmobile",
      "Opel",
      "Polaris",
      "Peugeot",
      "Renault",
      "Rolls-Royce",
      "Saab",
      "Saturn",
      "Seat",
      "Skoda",
      "SsangYong",
      "Subaru",
      "Tata",
      "Tesla",
      "TVS",
      "Volkswagen",
      "Volvo",
      "Wuling",
      "ZX Auto",
      "Toyota",
      "Mercedes-Benz",
      "Lexus",
      "Honda",
      "Hyundai",
      "BMW",
      "Ford",
      "GAC",
      "GMC",
      "Infiniti",
      "Jaguar",
      "Jeep",
      "Kia",
      "Mazda",
      "Mini",
      "Nissan",
      "Pontiac",
      "Porsche",
      "Rover",
      "Scion",
      "Tesla",
      "Volkswagen",
      "Other Brand",
    ],
    colors: [
      "Beige",
      "Black",
      "Blue",
      "Brown",
      "Burgundy",
      "Gold",
      "Gray",
      "Green",
      "Ivory",
      "Matt Black",
      "Off white",
      "Orange",
      "Pink",
      "Purple",
      "Red",
      "Silver",
      "Teal",
      "White",
      "Yellow",
      "Other Color",
    ],
    years: [
      "1987 - 1991",
      "1992 - 1996",
      "1997 - 2001",
      "2002 - 2006",
      "2007 - 2011",
      "2012 - 2016",
      "2017 - 2021",
      "2022 - 2026",
      "Other Year",
    ],
  },
  "Buses & Microbuses": {
    brands: [
      "Ashok Leyland",
      "Blue Bird",
      "Chevrolet",
      "Citroen",
      "Daewoo",
      "Daihatsu",
      "Dodge",
      "Fiat",
      "Force",
      "Foton",
      "Freightliner",
      "GMC",
      "Honda",
      "Hyundai",
      "Isuzu",
      "Iveco",
      "IVM",
      "JAC",
      "Jet",
      "Jin Bei",
      "Joylong",
      "Kia",
      "King Long",
      "LDV",
      "Mazda",
      "Mitsubishi",
      "Nissan",
      "Opel",
      "Peugeot",
      "Renault",
      "Scania",
      "Tata",
      "Vauxhall",
      "Volvo",
      "Yutong",
      "Toyota",
      "Volkswagen",
      "Ford",
      "Suzuki",
      "Mercedes-Benz",
      "Other Brand",
    ],
    colors: [
      "Beige",
      "Black",
      "Blue",
      "Brown",
      "Gold",
      "Green",
      "Grey",
      "Orange",
      "Pink",
      "Red",
      "Silver",
      "White",
      "Yellow",
      "Other Color",
    ],
    years: [
      "1972 - 1976",
      "1977 - 1981",
      "1982 - 1986",
      "1987 - 1991",
      "1992 - 1996",
      "1997 - 2001",
      "2002 - 2006",
      "2007 - 2011",
      "2012 - 2016",
      "2017 - 2021",
      "2022 - 2026",
      "Other Years",
    ],
  },
  "Heavy Equipment": {
    brands: [
      "Aerial Platforms",
      "Asphalt Pavers",
      "Backhoe Loaders",
      "Boom Lifts",
      "Bulldozers",
      "Car Lifts",
      "Compactors",
      "Compressors",
      "Concrete Mixers",
      "Concrete Pumps",
      "Container Handlers",
      "Crane Forks",
      "Cranes",
      "Crushers",
      "Drilling Rigs",
      "Dumpers",
      "Farm Machines",
      "Graders",
      "Loaders",
      "LPG Tanks",
      "Mobile Crusher",
      "Pallet Stackers",
      "Piling Machine",
      "Pipe Layers",
      "Planes",
      "Pneumatic Rollers",
      "Road Roller",
      "Scissor Lifts",
      "Storage Tanks",
      "Swamp Buggies",
      "Tar Boilers",
      "Trenchers",
      "Vibratory Rollers",
      "Wagon Drills",
      "Wheel Loaders",
      "Other",
    ],
    colors: [
      "blue",
      "green",
      "grey",
      "orange",
      "red",
      "white",
      "yellow",
      "black",
    ],
    years: [
      "1972 - 1976",
      "1977 - 1981",
      "1982 - 1986",
      "1987 - 1991",
      "1992 - 1996",
      "1997 - 2001",
      "2002 - 2006",
      "2007 - 2011",
      "2012 - 2016",
      "2017 - 2021",
      "2022 - 2026",
      "Other Years",
    ],
  },
  "Trucks & Trailers": {
    brands: [
      "Crane Trucks",
      "Dump Trucks",
      "Fire Fighting Trucks",
      "Food Trucks",
      "Garbage Compactors",
      "Garbage Trucks",
      "Heavy-Duty Trucks",
      "Low-Bed Trucks",
      "Manlift Trucks",
      "Mini Truck",
      "Refrigerator Truck",
      "Rigid Trucks",
      "Self-Loader Trucks",
      "Semi-Trailers",
      "Tank Trucks",
      "Tow Trucks",
      "Tractor Units",
      "Trailers",
      "Other",
    ],
    colors: [],
    years: [
      "1972 - 1976",
      "1977 - 1981",
      "1982 - 1986",
      "1987 - 1991",
      "1992 - 1996",
      "1997 - 2001",
      "2002 - 2006",
      "2007 - 2011",
      "2012 - 2016",
      "2017 - 2021",
      "2022 - 2026",
      "Other Years",
    ],
  },
};

// Helper function to truncate text
export const truncateText = (
  text: string | undefined | null,
  length?: number
): string => {
  if (!text) return "";
  if (length === undefined || text.length <= length) {
    return text;
  }
  return text.slice(0, length) + "...";
};
