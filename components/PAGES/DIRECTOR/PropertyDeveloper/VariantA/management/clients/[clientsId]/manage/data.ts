import type { Field } from "@/components/Table/types";
import { IndividualClientData } from "../../types";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { formatFee } from "@/app/(nav)/management/rent-unit/data";
import { empty } from "@/app/config";
import { capitalizeWords } from "@/hooks/capitalize-words";

export const statementTableFields: Field[] = [
  { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  {
    id: "2",
    label: "Tenants/Occupants",
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
  { id: "5", label: "Rent Amount", accessor: "credit" },
  { id: "6", label: "Unit Name", accessor: "unit_name" },
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

export interface IndividualClientAPIResponse {
  data: {
    id: string;
    // first_name: string;
    // last_name: string;
    name: string;
    title: string;
    email: string;
    // phone: string;
    phone: {
      profile_phone: string | null;
      user_phone: string | null;
    };
    user_id: string;
    tier_id?: 1 | 2 | 3 | 4 | 5;
    user_tier?: 1 | 2 | 3 | 4 | 5;
    picture?: string;
    gender: string;
    agent: string;
    owner_type: string;
    state: string;
    local_government: string;
    city: string;
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
    statement: any[];
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

export const transformIndividualClientAPIResponse = ({
  data,
}: IndividualClientAPIResponse): IndividualClientData => {
  const lastUpdated = data.note.last_updated_at
    ? moment(data.note.last_updated_at).format("DD/MM/YYYY")
    : "";

  // Map propertyOptions from properties and previous_properties
  const propertyOptions = [
    ...(data?.properties?.map((p) => ({
      label: p.properties?.title || "",
      value: p.properties?.id?.toString() || "",
    })) || []),
    ...(data?.previous_properties?.map((p) => ({
      label: p.properties?.title || "",
      value: p.properties?.id?.toString() || "",
    })) || []),
  ].filter(
    (property, index, self) =>
      property.label &&
      property.value &&
      index === self.findIndex((p) => p.value === property.value)
  );

  return {
    id: data.id,
    picture_url: data.picture || "",
    name: capitalizeWords(data.name),
    title: data.title || "",
    email: data.email,
    phone_number: `${data.phone.profile_phone ?? ""}${data.phone.user_phone && data.phone.profile_phone
      ? " / " + data.phone.user_phone
      : ""
      }`,
    gender: data?.gender ?? "",
    birthday: "",
    religion: "",
    marital_status: "",
    notes: {
      write_up: data?.note?.note ?? "",
      last_updated: lastUpdated,
    },
    note: data?.note?.note ?? "",
    owner_type: data?.owner_type ?? "",
    user_id: data?.user_id ?? "",
    badge_color: data?.user_tier ? tierColorMap[data?.user_tier] : undefined,
    user_tag: data?.agent?.toLowerCase() === "mobile" ? "mobile" : "web",
    contact_address: {
      address: data?.address ?? "",
      city: data?.city ?? "",
      state: data?.state ?? "",
      local_govt: data?.local_government ?? "",
    },
    next_of_kin: {
      name: data?.next_of_kin?.name ?? "",
      address: data?.next_of_kin?.address ?? "",
      phone: data?.next_of_kin?.phone ?? "",
      relationship: data?.next_of_kin?.relationship ?? "",
    },
    bank_details: {
      bank_name: data?.bank_details?.bank_name ?? "",
      account_name: data?.bank_details?.account_name ?? "",
      account_number: data?.bank_details?.account_number ?? "",
      wallet_id: "",
    },
    others: {
      employment: data?.Others?.occupation ?? "",
      employment_type: data?.Others?.job_type ?? "",
      family_type: data?.Others?.family_type ?? "",
    },
    employment: data?.Others?.occupation ?? "",
    employment_type: data?.Others?.job_type ?? "",
    family_type: data?.Others?.family_type ?? "",
    documents: data?.documents?.flatMap((doc) => {
      return doc.files.map((file, index) => {
        if (typeof file === "string") {
          return {
            id: uuidv4(),
            name: `${doc?.type ?? ""} ${index + 1}`,
            link: file,
            document_type: doc?.type ?? "",
          };
        } else {
          return {
            id: uuidv4(),
            name: `${doc?.type ?? ""} ${index + 1}`,
            date: moment(file.updated_at).format("DD/MM/YYYY"),
            link: file.url,
            document_type: doc.type,
          };
        }
      });
    }),
    properties_managed: data?.properties?.map((p) => {
      const properties = p?.properties;
      const units = properties?.units;
      const totalReturns = units?.reduce(
        (sum: number, unit: any) => sum + parseFloat(unit.fee_amount || 0),
        0
      );
      const feePercentage =
        properties?.property_type === "rental"
          ? properties?.agency_fee
          : properties?.management_fee;
      const imageObjects = properties?.images || [];
      const images = imageObjects.map((image: any) => image.path);
      const defaultImage =
        imageObjects.find((image: any) => image.is_default)?.path || images[0];

      return {
        id: properties?.id?.toString(),
        property_name: properties?.title,
        images,
        default_image: defaultImage,
        address: `${properties?.full_address}, ${properties?.city_area}, ${properties?.local_government}, ${properties?.state}`,
        total_units: units?.length || 0,
        total_income: (totalReturns * feePercentage) / 100,
        total_returns: totalReturns,
        property_type: properties?.property_type || "rental",
        total_unit_pictures: 2,
        hasVideo: true,
        currency: properties?.currency || "naira",
        mobile_tenants: 0,
        web_tenants: 0,
        owing_units: 0,
        available_units: 0,
        viewOnly: false,
        isClickable: true,
        branch: properties?.branch?.branch_name || "",
        last_updated: moment(properties?.updated_at).format("DD/MM/YYYY") ?? "",
        accountOfficer: "",
        documents: p?.document?.flatMap((doc: any) =>
          doc.files.map((file: any, index: number) => ({
            id: uuidv4(),
            name: `${doc.type} ${index + 1}`,
            date: moment(file.updated_at).format("DD/MM/YYYY"),
            link: file.url,
            document_type: doc.type,
          }))
        ) || [],
      };
    }),
    previous_properties: data?.previous_properties?.map((p) => {
      const properties = p?.properties || [];
      const units = properties?.units || [];
      const totalReturns = units?.reduce(
        (sum: number, unit: any) => sum + parseFloat(unit?.fee_amount || 0),
        0
      );
      const feePercentage =
        properties.property_type === "rental"
          ? properties.agency_fee
          : properties.management_fee;
      const imageObjects = properties.images || [];
      const images = imageObjects.map((image: any) => image.path);
      const defaultImage =
        imageObjects.find((image: any) => image.is_default)?.path || images[0];

      return {
        id: properties.id.toString(),
        property_name: properties.title,
        images,
        default_image: defaultImage,
        address: `${properties?.full_address || ""}, ${properties?.city_area || ""
          }, ${properties?.local_government || ""}, ${properties?.state || ""}`,
        total_units: units.length,
        total_income: (totalReturns * feePercentage) / 100,
        total_returns: totalReturns,
        property_type: properties.property_type,
        total_unit_pictures: 2,
        hasVideo: true,
        currency: "naira",
        mobile_tenants: 0,
        web_tenants: 0,
        owing_units: 0,
        available_units: 0,
        viewOnly: false,
        isClickable: false,
        branch: properties?.branch?.branch_name || "",
        last_updated: moment(properties?.updated_at).format("DD/MM/YYYY"),
        accountOfficer: "",
        documents: p?.document?.flatMap((doc: any) =>
          doc.files.map((file: any, index: number) => ({
            id: uuidv4(),
            name: `${doc.type} ${index + 1}`,
            date: moment(file.updated_at).format("DD/MM/YYYY"),
            link: file.url,
            document_type: doc.type,
          }))
        ) || [],
      };
    }),
    statement: data?.statement?.map((s) => {
      const amount = parseFloat(s?.amount_paid || 0);
      return {
        id: s?.id || 0,
        picture: s?.payer_picture || empty,
        name: s?.payer_name || "",
        payment_id: s?.payment_id || "",
        details: s?.details || "",
        unit_name: s?.unit_name || "",
        credit:
          amount > 0 ? formatFee(amount, s?.currency || "naira") || "" : null,
        debit:
          amount < 0 ? formatFee(amount, s?.currency || "naira") || "" : null,
        date: s?.date ? s?.date : "--- ---",
        badge_color: s?.payer_tier
          ? tierColorMap[s?.payer_tier as keyof typeof tierColorMap]
          : null,
      };
    }),
    messageUserData: {
      id: Number(data?.user_id) || 0,
      name: data?.name || "",
      position: "client",
      imageUrl: data?.picture ?? empty,
      branch_id: 1,
    },
  };
};

export const generateDummyIndividualClientAPIResponse = (id: string): IndividualClientAPIResponse => {
  const name = "John Smith";
  const picture = "/empty/SampleLandlord.jpeg";
  const now = dayjs();
  return {
    data: {
      id,
      name,
      title: "Mr",
      email: "john.smith@email.com",
      phone: {
        profile_phone: "08012345678",
        user_phone: "08087654321",
      },
      user_id: "1001",
      user_tier: 3,
      picture,
      gender: "male",
      agent: "web",
      owner_type: "client",
      state: "Lagos",
      local_government: "Ikeja",
      city: "Ikeja",
      address: "12 Adekunle Street",
      note: {
        last_updated_at: now.toDate(),
        note: "VIP client with multiple properties",
      },
      bank_details: {
        bank_name: "GTBank",
        account_name: name,
        account_number: "0123456789",
      },
      Others: {
        occupation: "Engineer",
        job_type: "Full-time",
        family_type: "Nuclear",
      },
      next_of_kin: {
        name: "Mary Smith",
        phone: "08022223333",
        email: "mary@example.com",
        address: "12 Adekunle Street, Ikeja",
        relationship: "Spouse",
      },
      properties: [],
      previous_properties: [],
      statement: [
        {
          id: 1,
          payer_picture: picture,
          payer_name: "Tenant A",
          payment_id: "PMT-001",
          details: "Rent payment",
          unit_name: "Unit 1A",
          amount_paid: "150000",
          currency: "naira",
          date: now.format("DD/MM/YYYY"),
          payer_tier: 2,
        },
      ],
      documents: [
        {
          type: "identification",
          files: [
            {
              url: "/document-thumbnails/identification.png",
              updated_at: now.toISOString(),
            },
          ],
        },
      ],
    },
  };
};

export const transformCardData = (data: any) => {
  if (!data) return null;

  return {
    id: data.id || "",
    name: data.name || "",
    title: data.title || "",
    email: data.email || "",
    phone_number: data.phone?.profile_phone || data.phone?.user_phone || "",
    picture_url: data.picture || "",
    user_tag: data.agent || "web",
    badge_color: data.tier_id && data.tier_id in tierColorMap ? tierColorMap[data.tier_id as keyof typeof tierColorMap] : undefined,
    note: data.note?.note || "",
    gender: data.gender || "",
    birthday: data.birthday || "",
    religion: data.religion || "",
    marital_status: data.marital_status || "",
    employment: data.Others?.occupation || "",
    employment_type: data.Others?.job_type || "",
    family_type: data.Others?.family_type || "",
    owner_type: data.owner_type || "",
    contact_address: {
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      local_govt: data.local_government || "",
    },
    bank_details: {
      bank_name: data.bank_details?.bank_name || "",
      account_name: data.bank_details?.account_name || "",
      account_number: data.bank_details?.account_number || "",
      wallet_id: data.bank_details?.wallet_id || "",
    },
    next_of_kin: {
      name: data.next_of_kin?.name || "",
      address: data.next_of_kin?.address || "",
      phone: data.next_of_kin?.phone || "",
      relationship: data.next_of_kin?.relationship || "",
    },
    others: {
      employment: data.Others?.occupation || "",
      employment_type: data.Others?.job_type || "",
      family_type: data.Others?.family_type || "",
    },
    notes: {
      write_up: data.note?.note || "",
    },
    properties_managed: data.properties || [],
    previous_properties: data.previous_properties || [],
    statement: data.statement || [],
    documents: data.documents || [],
    user_id: data.user_id || "",
    messageUserData: {
      id: Number(data?.user_id) || 0,
      name: data?.name || "",
      position: "client",
      imageUrl: data?.picture ?? empty,
      branch_id: 1,
    },
  };
};


// API function removed - using dummy data for now
export const updateClientWithEmailOrID = async (data: any, id: number) => {
  // TODO: Implement when API is ready
  console.log('Update client with email/ID:', { data, id });
  return true;
};
