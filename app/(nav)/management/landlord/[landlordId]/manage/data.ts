import type { Field } from "@/components/Table/types";
import type { LandlordPageData } from "../../types";

export const statementTableFields: Field[] = [
  { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  {
    id: "2",
    label: "Name",
    accessor: "name",
  },
  { id: "3", label: "Payment ID", accessor: "payment_id" },
  {
    id: "4",
    label: "Details",
    accessor: "details",
    cellStyle: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      maxWidth: "350px",
    },
  },
  { id: "5", label: "Credit", accessor: "credit" },
  { id: "6", label: "Debit", accessor: "debit" },
  { id: "7", label: "Date", accessor: "date" },
];

const generateTableData = (numItems: number) => {
  const names = [
    "Samuel Fiyinfoluwa",
    "Dada Teniola Emmanuel",
    "Abdulrafiu Mubi",
  ];
  const getRandomValue = () => {
    // Randomly decide if the value should be null or a number
    return Math.random() > 0.5
      ? `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`
      : null;
  };
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    picture: "/empty/SampleLandlord.jpeg",
    name: names[index % names.length],
    payment_id: `Payment ${index + 1}`,
    details: "Rent Cost: Start date: September 02, 2024.",
    credit: getRandomValue(),
    debit: getRandomValue(),
    date: "12/12/2034",
  }));
};

export const statementTableData = generateTableData(10);

export interface IndividualLandlordAPIResponse {
  data: {
    id: number;
    // first_name: string;
    // last_name: string;
    name: string;
    email: string;
    phone: string;
    tier_id?: 1 | 2 | 3 | 4 | 5;
    picture: string;
    gender: string;
    agent: string;
    // owner_type: string;
    notes?: {
      last_updated: string;
      write_up: string;
    };
  };
}

export const transformIndividualLandlordAPIResponse = ({
  data,
}: IndividualLandlordAPIResponse): LandlordPageData => {
  return {
    id: data.id,
    picture: data.picture,
    // first_name: data.first_name,
    // last_name: data.last_name,
    name: data.name,
    email: data.email,
    phone_number: data.phone,
    gender: data.gender,
    notes: data.notes,
    user_tag: data.agent.toLowerCase() === "mobile" ? "mobile" : "web",
    type: "backend error",
    contact_address: { address: "", city: "", state: "", local_govt: "" },
    next_of_kin: {
      name: "",
      email: "",
      address: "",
      phone: "",
      relationship: "",
    },
    guarantor1: {
      name: "",
      relationship: "",
      email: "",
      phone_number: "",
      address: "",
    },
    guarantor2: {
      name: "",
      relationship: "",
      email: "",
      phone_number: "",
      address: "",
    },
    bank_details: {
      bank_name: "",
      account_name: "",
      account_number: "",
      wallet_id: "",
    },
    others: {
      occupation: "",
      type: "",
      family_type: "",
      note: "",
    },
    documents: [],
    properties_managed: [],
  };
};
