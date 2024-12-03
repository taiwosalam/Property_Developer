import type { Field } from "@/components/Table/types";
import type { TenantData } from "../../types";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";

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
    id: string;
    // first_name: string;
    // last_name: string;
    name: string;
    email: string;
    phone: string;
    tier_id?: 1 | 2 | 3 | 4 | 5;
    picture: string;
    agent: string;
    // gender: string;
    user_id: string;
    note: {
      // last_updated: string;
      note: string;
    };
    bank_details: {
      bank_name: string;
      account_name: string;
      account_number: string;
      // wallet_id: string;
    };
    next_of_kin: {
      name: string;
      phone: string;
      email: string;
      address: string;
      relationship: string;
    };
    documents: any[]; //confirm structure
  };
}

export const transformIndividualTenantAPIResponse = ({
  data,
}: IndividualTenantAPIResponse): TenantData => {
  return {
    id: data.id,
    picture: data.picture,
    name: data.name,
    user_id: data.user_id,
    // first_name: data.first_name,
    // last_name: data.last_name,
    email: data.email,
    user_tag: data.agent.toLowerCase() === "mobile" ? "mobile" : "web",
    badge_color: data.tier_id ? tierColorMap[data.tier_id] : undefined,
    phone_number: data.phone,
    tenant_type: "backend error",
    gender: "", //backend error
    birthdate: "",
    religion: "",
    marital_status: "",
    contact_address: { address: "", city: "", state: "", local_govt: "" },
    next_of_kin: data.next_of_kin,
    others: {
      employment: "",
      employment_type: "",
      family_type: "",
    },
    bank_details: data.bank_details,
    notes: {
      last_updated: "backend error",
      write_up: data.note.note,
    },
    documents: data.documents,
  };
};
