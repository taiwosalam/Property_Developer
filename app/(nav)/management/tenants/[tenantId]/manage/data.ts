import type { Field } from "@/components/Table/types";
import type { TenantData } from "../../types";

export const statementTableFields: Field[] = [
  { id: "1", accessor: "S/N" },
  {
    id: "2",
    label: "Payment Date",
    accessor: "payment_date",
  },
  { id: "3", label: "Amount Paid", accessor: "amount_paid" },
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
  { id: "5", label: "Start Date", accessor: "start_date" },
  { id: "6", label: "End Date", accessor: "end_date" },
];

const generateTableData = (numItems: number) => {
  const getRandomValue = () => {
    return `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`;
  };
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    payment_date: "12/12/2034",
    amount_paid: getRandomValue(),
    details: "Rent Cost: Start date: September 02, 2024.",
    start_date: "12/12/2034",
    end_date: "12/12/2034",
  }));
};

export const statementTableData = generateTableData(10);

export interface IndividualTenantAPIResponse {
  data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    tier_id: number;
    picture: string;
    gender: string;
    notes: {
      last_updated: string;
      write_up: string;
    };
    tenant: {
      owner_type: string;
      agent: string;
    };
  };
}

export const transformIndividualTenantAPIResponse = ({
  data,
}: IndividualTenantAPIResponse): TenantData => {
  return {
    id: data.id,
    picture: data.picture,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    user_tag: data.tenant.agent.toLowerCase() === "mobile" ? "mobile" : "web",
    phone_number: data.phone_number,
    gender: data.gender,
    birthdate: "",
    religion: "",
    marital_status: "",
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
      email: "",
      phone_number: "",
      address: "",
      relationship: "",
    },
    guarantor2: {
      name: "",
      email: "",
      phone_number: "",
      address: "",
      relationship: "",
    },
    others: {
      occupation: "",
      type: "",
      family_type: "",
      note: "",
    },
    bank_details: {
      bank_name: "",
      account_name: "",
      account_number: "",
      wallet_id: "",
    },
    notes: data.notes,
    documents: [],
  };
};
