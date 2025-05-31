import type { Field } from "@/components/Table/types";
import type {
  CurrentRent,
  PreviousRent,
  Statement,
  TenantData,
} from "../../types";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import api, { handleAxiosError } from "@/services/api";
import { UnitItemProps } from "@/components/Management/Properties/unit-item";
import { UnitStatusColors } from "@/components/Management/Properties/property-preview";
import { formatNumber } from "@/utils/number-formatter";
import dayjs from "dayjs";
import { formatFee } from "../../../rent-unit/data";
import { empty } from "@/app/config";

export const statementTableFields: Field[] = [
  { id: "1", accessor: "S/N" },
  {
    id: "7",
    label: "Unit Name",
    accessor: "unit_name",
  },
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
    user_tier?: 1 | 2 | 3 | 4 | 5;
    picture?: string;
    agent: string;
    gender: string;
    tenant_type: string;
    flag: {
      is_flagged: 1 | 0;
      flagged_by: number | string;
      reason: string;
    };
    user_id: string;
    state: string;
    local_government: string;
    address: string;
    city: string;
    birthday?: string;
    religion: string;
    marital_status: string;
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
    guarantor: {
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
            name: string;
          }
        | string
      )[];
    }[];
    current_rent: CurrentRent[];
    previous_rent: PreviousRent[];
    statement: Statement[];
  };
}

export const transformIndividualTenantAPIResponse = ({
  data,
}: IndividualTenantAPIResponse): TenantData => {
  const lastUpdated = data?.note?.last_updated_at
    ? dayjs(data.note.last_updated_at).format("DD/MM/YYYY")
    : "";

  const formattedStatement =
    data?.statement?.map((stmt, index) => ({
      ...stmt,
      "S/N": (index + 1).toString(),
      unit_name: stmt?.unit_name || "--- ---",
      amount_paid: stmt?.amount_paid
        ? `${formatFee(stmt.amount_paid, stmt.currency || "naira")}`
        : "--- ---",
      payment_date: stmt?.payment_date
        ? // ? moment(stmt.payment_date, "YYYY-MM-DD").format("DD/MM/YYYY")
          stmt.payment_date
        : "",
      start_date: stmt?.start_date ? stmt.start_date : "",
      end_date: stmt?.end_date ? stmt.end_date : "",
    })) || [];

  const transformRentToUnitItemProps = (
    rent: CurrentRent | PreviousRent
  ): UnitItemProps => ({
    propertyType: rent?.property_type || "",
    unitId: rent?.id?.toString() || "",
    unitImages: rent?.unit_image?.map((img) => img?.path || "") || [],
    unitDetails: `${rent?.unit_type || ""} - ${rent?.unit_sub_type || ""}`,
    unitStatus: rent?.unit_status as keyof typeof UnitStatusColors,
    unitName: rent?.unit_name || "",
    rent: rent?.rent_amount
      ? `${formatFee(parseFloat(rent.rent_amount), rent.currency || "naira")}`
      : "--- ---",
    serviceCharge: rent?.service_charge
      ? `${formatFee(
          parseFloat(rent.service_charge),
          rent.currency || "naira"
        )}`
      : "--- ---",
    cautionDeposit: rent?.caution_deposit
      ? `${formatFee(
          parseFloat(rent.caution_deposit),
          rent.currency || "naira"
        )}`
      : "--- ---",
    tenantName: data?.name || "",
    tenantBadgeColor: data?.tier_id ? tierColorMap[data.tier_id] : undefined,
    dueDate: rent?.due_date ? moment(rent.due_date).format("DD/MM/YYYY") : "",
  });

  const formattedCurrentRent =
    data?.current_rent?.map(transformRentToUnitItemProps) || [];
  const formattedPreviousRent =
    data?.previous_rent?.map(transformRentToUnitItemProps) || [];

  const IS_MOBILE = data?.agent?.toLowerCase() === "mobile";
  return {
    id: data?.id || "",
    picture: data?.picture || empty,
    name: data?.name || "--- ---",
    user_id: data?.user_id || "--- ---",
    email: data?.email || "--- ---",
    user_tag: data?.agent?.toLowerCase() === "mobile" ? "mobile" : "web",
    badge_color: data?.user_tier ? tierColorMap[data.user_tier] : undefined,
    phone_number: data?.phone || "--- ---",
    tenant_type: data?.tenant_type || "",
    gender: data?.gender || "--- ---",
    birthdate: data.birthday
      ? dayjs(data.birthday).format("MMM DD YYYY")
      : "--- ---",
    religion: data.religion || "--- ---",
    marital_status: data.marital_status || "--- ---",
    is_flagged: data.flag.is_flagged === 1,
    flag: data.flag,
    contact_address: {
      address: data?.address || "--- ---",
      city: data?.city || "--- ---",
      state: data?.state || "--- ---",
      local_govt: data?.local_government || "--- ---",
    },
    next_of_kin: data?.next_of_kin || {},
    others: {
      occupation: data?.Others?.occupation || "--- ---",
      ...(data?.Others?.occupation?.toLowerCase() === "employed" && {
        employment_type: data?.Others?.job_type || "--- ---",
      }),
      family_type: data?.Others?.family_type || "--- ---",
      tenant_type: data?.tenant_type || "--- ---",
      ...(!IS_MOBILE && {
        gender: data?.gender || "--- ---",
      }),
    },
    bank_details: data?.bank_details || [],
    notes: {
      last_updated: lastUpdated,
      write_up: data?.note?.note || "--- ---",
    },
    note: !!data?.note?.note,
    guarantor_1: data?.guarantor?.[0] || {},
    guarantor_2: data?.guarantor?.[1] || {},
    documents:
      data?.documents?.flatMap(
        (doc) =>
          doc?.files?.map((file, index) => {
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
                name: file?.name ?? `${doc.type} ${index + 1}`,
                date: file?.updated_at
                  ? moment(file.updated_at).format("DD/MM/YYYY")
                  : "",
                link: file?.url || "",
                document_type: doc.type,
              };
            }
          }) || []
      ) || [],
    current_rent: formattedCurrentRent,
    previous_rent: formattedPreviousRent,
    statement: formattedStatement,
    messageUserData: {
      id: Number(data.id),
      name: data?.name || "",
      position: "tenant",
      imageUrl: data.picture ?? empty,
      branch_id: 1, //TEST
    },
  };
};

export const updateTenantWithEmailOrID = async (data: any, id: number) => {
  try {
    const res = await api.post(`tenant-update/email/${id}`, data);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const flagTenant = async (id: number, data: FormData) => {
  try {
    const res = await api.post(`tenant/${id}/flag`, data);
    if (res.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
