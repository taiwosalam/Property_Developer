import type { Field } from "@/components/Table/types";
import type { TenantData } from "../../types";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

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
    title: string;
    email: string;
    phone: string;
    tier_id?: 1 | 2 | 3 | 4 | 5;
    picture?: string;
    agent: string;
    gender: string;
    tenant_type: string;
    user_id: string;
    state: string;
    local_government: string;
    address: string;
    city: string;
    note: {
      last_updated_at: Date;
      note: string;
    };
    bank_details: {
      bank_name: string;
      account_name: string;
      account_number: string;
      // wallet_id: string;
    };
    Others: {
      occupation: string | null;
      job_type: string | null;
      family_type: string | null;
    };
    next_of_kin: {
      name: string;
      phone: string;
      email: string;
      address: string;
      relationship: string;
    };
    guarantor?: {
      name: string;
      phone: string;
      email: string;
      address: string;
      relationship: string;
    }[];
    documents: {
      type: string;
      files: (
        | {
            url: string;
            updated_at: string;
          }
        | string
      )[];
    }[];
  };
}

export const transformIndividualTenantAPIResponse = ({
  data,
}: IndividualTenantAPIResponse): TenantData => {
  const lastUpdated = data.note.last_updated_at
    ? moment(data.note.last_updated_at).format("DD/MM/YYYY")
    : "";
  return {
    id: data.id,
    picture: data.picture || "",
    name: data.name,
    user_id: data.user_id,
    title: data.title,
    // first_name: data.first_name,
    // last_name: data.last_name,
    email: data.email,
    user_tag: data.agent.toLowerCase() === "mobile" ? "mobile" : "web",
    badge_color: data.tier_id ? tierColorMap[data.tier_id] : undefined,
    phone_number: data.phone,
    tenant_type: data.tenant_type,
    gender: data.gender,
    birthdate: "",
    religion: "",
    marital_status: "",
    contact_address: {
      address: data.address,
      city: data.city,
      state: data.state,
      local_govt: data.local_government,
    },
    next_of_kin: data.next_of_kin,
    others: {
      occupation: data.Others.occupation,
      ...(data.Others.occupation &&
        data.Others.occupation.toLowerCase() === "employed" && {
          employment_type: data.Others.job_type,
        }),
      family_type: data.Others.family_type,
      tenant_type: data.tenant_type,
    },
    bank_details: data.bank_details,
    notes: {
      last_updated: lastUpdated,
      write_up: data.note.note,
    },
    documents: data.documents.flatMap((doc) => {
      return doc.files.map((file, index) => {
        if (typeof file === "string") {
          return {
            id: uuidv4(),
            name: `${doc.type} ${index + 1}`,
            link: file,
            document_type: doc.type,
          };
        } else {
          return {
            id: uuidv4(),
            name: `${doc.type} ${index + 1}`,
            date: moment(file.updated_at).format("DD/MM/YYYY"),
            link: file.url,
            document_type: doc.type,
          };
        }
      });
    }),
  };
};
