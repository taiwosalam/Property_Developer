import type { Field } from "@/components/Table/types";
import type { LandlordPageData } from "../../types";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

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
    id: string;
    // first_name: string;
    // last_name: string;
    name: string;
    email: string;
    phone: string;
    user_id: string;
    tier_id?: 1 | 2 | 3 | 4 | 5;
    picture?: string;
    gender: string;
    agent: string;
    owner_type: string;
    state: string;
    local_government: string;
    address: string;
    note: {
      last_updated_at: Date | null;
      note: string;
    };
    bank_details: {
      bank_name: string;
      account_name: string;
      account_number: string;
      // wallet_id: string; uncoment this later. mobile users have wallet_id
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
    properties: any[];
    previous_properties: any[];
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

export const transformIndividualLandlordAPIResponse = ({
  data,
}: IndividualLandlordAPIResponse): LandlordPageData => {
  // console.log('data', data)
  const lastUpdated = data.note.last_updated_at
    ? moment(data.note.last_updated_at).format("DD/MM/YYYY")
    : "";
  return {
    id: data.id,
    picture: data.picture || "",
    // first_name: data.first_name,
    // last_name: data.last_name,
    name: data.name,
    email: data.email,
    phone_number: data.phone,
    gender: data.gender,
    notes: {
      last_updated: lastUpdated,
      write_up: data.note.note,
    },
    owner_type: data.owner_type,
    user_id: data.user_id,
    badge_color: data.tier_id ? tierColorMap[data.tier_id] : undefined,
    user_tag: data.agent.toLowerCase() === "mobile" ? "mobile" : "web",
    contact_address: {
      address: data.address,
      city: "",
      state: data.state,
      local_govt: data.local_government,
    },
    next_of_kin: data.next_of_kin,
    bank_details: data.bank_details,
    others: {
      employment: data.Others.occupation,
      employment_type: data.Others.job_type,
      family_type: data.Others.family_type,
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
    properties_managed: data.properties.map((p) => {
      const totalReturns = p.properties.units.reduce((sum:any, unit:any) => {
        return sum + parseFloat(unit.fee_amount);
      }, 0);
      const feePercentage =
      p.properties.property_type === "rental" ? p.properties.agency_fee : p.properties.management_fee;

      return {
        id: p.properties.id,
        name: p.properties.title,
        address: `${p.properties.full_address}, ${p.properties.city_area}, ${p.properties.local_government}, ${p.properties.state}`,
        state: p.properties.state,
        local_govt: p.properties.local_government,
        type: p.properties.type,
        images: p.properties.images.map((image: any) => image.path),
        status: p.properties.status,
        tenant_count: p.properties.tenant_count,
        total_units: p.properties.units.length,
        currency: p.properties.currency,
        last_updated: moment(p.properties.updated_at).format("DD/MM/YYYY"),
        total_returns: totalReturns,
        total_income: (totalReturns * feePercentage) / 100,
        mobile_tenants: 0,
        web_tenants: 0,
        accountOfficer: "",
        owing_units: 0,
        available_units: 0,
        isClickable: true,
        viewOnly: false,
        branch: p.properties.branch.branch_name,
      }
    }),
    previous_properties: data.previous_properties.map((p) => {
      const totalReturns = p.properties.units.reduce((sum:any, unit:any) => {
        return sum + parseFloat(unit.fee_amount);
      }, 0);
      const feePercentage =
      p.properties.property_type === "rental" ? p.properties.agency_fee : p.properties.management_fee;

      return {
        id: p.properties.id,
        name: p.properties.title,
        address: `${p.properties.full_address}, ${p.properties.city_area}, ${p.properties.local_government}, ${p.properties.state}`,
        state: p.properties.state,
        local_govt: p.properties.local_government,
        type: p.properties.type,
        images: p.properties.images.map((image: any) => image.path),
        status: p.properties.status,
        tenant_count: p.properties.tenant_count,
        total_units: p.properties.units.length,
        currency: p.properties.currency,
        last_updated: moment(p.properties.updated_at).format("DD/MM/YYYY"),
        total_returns: totalReturns,
        total_income: (totalReturns * feePercentage) / 100,
        mobile_tenants: 0,
        web_tenants: 0,
        accountOfficer: "",
        owing_units: 0,
        available_units: 0,
        isClickable: true,
        viewOnly: false,
        branch: p.properties.branch.branch_name,
      }
    }),
  };
};
