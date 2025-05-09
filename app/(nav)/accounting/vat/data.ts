import type { Field } from "@/components/Table/types";
import { Currency, formatNumber } from "@/utils/number-formatter";
import { formatFee } from "../../management/rent-unit/data";
import { BadgeIconColors, tierColorMap } from "@/components/BadgeIcon/badge-icon";

export const accountingVatOptionsWithDropdown = [
  {
    label: "Account Officer",
    value: [
      { label: "Account Officer 1", value: "Account Officer1" },
      { label: "Account Officer 2", value: "Account Officer2" },
      { label: "Account Officer 3", value: "Account Officer3" },
    ],
  },
];

export const vatTableFields: Field[] = [
  { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  { id: "2", label: "Name", accessor: "name" },
  { id: "3", label: "VAT ID", accessor: "vat_id" },
  {
    id: "4",
    label: "Payment Description",
    accessor: "payment_reason",
    cellStyle: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      maxWidth: "350px",
    },
  },
  { id: "5", label: "VAT Amount", accessor: "total_vat" },
  { id: "6", label: "Date", accessor: "date" },
];

const generateTableData = (numItems: number) => {
  const names = [
    "Samuel Fiyinfoluwa",
    "Dada Teniola Emmanuel",
    "Abdulrafiu Mubi",
  ];
  const getRandomValue = () => {
    return Math.random() > 0.5
      ? `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`
      : null;
  };
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    picture: "/empty/SampleLandlord.jpeg",
    name: names[index % names.length],
    vat_id: `VAT-${index + 1}`,
    payment_reason:
      "Rent cost: Start date: Sept 22, 2023 - Expiry tomorrow eveing. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    total_vat: getRandomValue(),
    date: "12/12/2034",
  }));
};

export const vatTableData = generateTableData(15);

export interface Vat {
  id: number;
  vat_id: string;
  name: string;
  picture: string;
  payment_reason: string;
  total_vat: string;
  date: string;
  badge_color?: BadgeIconColors;
  currency?: Currency;
}

export interface VATPageState {
  total_vat_created: number | string;
  total_paid_vat: number | string;
  total_pending_vat: number;
  percentage_change_total: number;
  percentage_change_paid: number;
  percentage_change_pending: number;
  vats: Vat[];
}

export const initialVATPageState: VATPageState = {
  total_vat_created: 0,
  total_paid_vat: 0,
  total_pending_vat: 0,
  percentage_change_total: 0,
  percentage_change_paid: 0,
  percentage_change_pending: 0,
  vats: [],
};

export interface VATFilterParams {
  from_date?: string;
  to_date?: string;
  property_ids?: string[];
  account_officer?: string[];
  search?: string;
}

export interface VatRaw {
  id: number;
  vat_id: string;
  client_name: string;
  client_picture: string;
  description: string;
  currency: Currency;
  amount: string;
  tier: string | number;
  date: string;
}

export interface VATAPIResponse {
  status: string;
  message: string;
  data: {
    statistics: {
      total_vat_created: string;
      total_paid_vat: string;
      total_pending_vat: number;
      percentage_change_total: number;
      percentage_change_paid: number;
      percentage_change_pending: number;
    };
    vats: VatRaw[];
  };
}

export const transformVATAPIResponse = (
  response: VATAPIResponse
): VATPageState => {
  const { statistics, vats } = response.data;

  return {
    total_vat_created: parseFloat(statistics.total_vat_created),
    total_paid_vat: parseFloat(statistics.total_paid_vat),
    total_pending_vat: statistics.total_pending_vat,
    percentage_change_total: statistics.percentage_change_total,
    percentage_change_paid: statistics.percentage_change_paid,
    percentage_change_pending: statistics.percentage_change_pending,
    vats: vats.map((vat) => ({
      id: vat.id,
      vat_id: vat.vat_id,
      name: vat.client_name,
      picture: vat.client_picture,
      payment_reason: vat.description,
      total_vat: `${formatFee(Number(vat.amount), vat.currency || "naira")}`,
      date: vat.date,
      badge_color: vat.tier
        ? tierColorMap[vat.tier as keyof typeof tierColorMap]
        : undefined,
    })),
  };
};




// Helper to determine otherCurrency based on vats
export const getOtherCurrencyFromVats = (
  vats: { currency: string | null }[]
): string => {
  const currencies = new Set(
    vats
      .map((vat) => vat.currency)
      .filter(
        (currency): currency is "dollar" | "pound" =>
          !!currency && currency !== "naira"
      )
  );

  const hasDollar = currencies.has("dollar");
  const hasPound = currencies.has("pound");

  if (hasDollar && hasPound) return "$£";
  if (hasDollar) return "$";
  if (hasPound) return "£";
  return "";
};
