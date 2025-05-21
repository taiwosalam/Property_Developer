// Types
import {
  SponsoredListing,
  SponsorListingsResponse,
} from "@/components/Settings/types";
import type { SubscriptionTableType } from "./types";
import dayjs from "dayjs";
import { formatNumber } from "@/utils/number-formatter";
import api, { handleAxiosError } from "@/services/api";

export const enrollment_subscriptions: SubscriptionTableType = {
  fields: [
    {
      id: "0",
      label: "Subscription Type",
      accessor: "subscription_type",
    },
    {
      id: "1",
      label: "Duration",
      accessor: "duration",
    },
    {
      id: "2",
      label: "Discount(%)",
      accessor: "discount",
    },
    {
      id: "3",
      label: "Price",
      accessor: "price",
    },
    {
      id: "4",
      label: "Start Date",
      accessor: "start_date",
    },
    {
      id: "5",
      label: "Due Date",
      accessor: "due_date",
    },
    // {
    //   id: "6",
    //   label: "Status",
    //   accessor: "status",
    // },
  ],
  data: Array(5)
    .fill(null)
    .map((_, idx) => ({
      id: `${idx + 1}`,
      subscription_type: "Personalized Domain",
      duration: "1 month",
      discount: "1",
      price: "₦1,000",
      start_date: "12/12/12",
      due_date: "12/12/12",
      status: "Active",
    })),
};

export const current_subscriptions: SubscriptionTableType = {
  fields: [
    {
      id: "0",
      label: "Subscription Type",
      accessor: "subscription_type",
    },
    {
      id: "1",
      label: "Duration",
      accessor: "duration",
    },
    {
      id: "2",
      label: "Quantity",
      accessor: "quantity",
    },
    {
      id: "3",
      label: "Price",
      accessor: "price",
    },
    {
      id: "4",
      label: "Start Date",
      accessor: "start_date",
    },
    {
      id: "5",
      label: "Due Date",
      accessor: "due_date",
    },
    {
      id: "6",
      label: "Status",
      accessor: "status",
    },
  ],
  data: Array(5)
    .fill(null)
    .map((_, idx) => ({
      id: `${idx + 1}`,
      subscription_type: "Personalized Domain",
      duration: "1 month",
      quantity: "1",
      price: "₦1,000",
      start_date: "12/12/12",
      due_date: "12/12/12",
      status: "Active",
    })),
};

export const personalized_domain: SubscriptionTableType = {
  fields: [
    {
      id: "0",
      label: "URL",
      accessor: "domain",
    },
    {
      id: "1",
      label: "Status",
      accessor: "status",
    },
    {
      id: "2",
      label: "SSL",
      accessor: "ssl",
    },
    {
      id: "3",
      label: "Added Date",
      accessor: "updated_at",
    },

    {
      id: "5",
      // accessor: "more",
      accessor: "action",
    },
  ],
  data: [
    {
      url: "yourdomainname.com",
      status: "Inactive (Checking DNS)",
      http: "Not Secured",
      start_date: "12/02/2024",
      due_date: "11/02/2025",
    },
  ],
};

export interface SponsorDataTypes {
  sponsor_value: string | number;
  sponsor_listings: SponsorDataObjectTypes[];
  pagination: {
    current_page: number;
    total_pages: number;
    total: number;
  };
}

interface SponsorDataObjectTypes {
  unit_id: string;
  property_name: string;
  unit_description: string;
  status: string;
  annual_rent: string;
  date: string;
}

export const SponsorFields = [
  {
    id: "0",
    label: "Purchase ID",
    accessor: "transaction_id",
  },
  {
    id: "1",
    label: "Purchase Date",
    accessor: "date",
  },
  {
    id: "2",
    label: "Total Unit",
    accessor: "units",
  },
  {
    id: "3",
    label: "Price",
    accessor: "amount",
  },
  // {
  //   id: "6",
  //   label: "Total Package",
  //   accessor: "annual_rent",
  // },
  // {
  //   id: "3",
  //   label: "Date",
  //   accessor: "date",
  // },
];
export const DomainFields = [
  {
    id: "0",
    label: "Purchase ID",
    accessor: "domain",
  },
  {
    id: "1",
    label: "Duration",
    accessor: "activation_date",
  },
  {
    id: "2",
    label: "Amount",
    accessor: "start_date",
  },
  {
    id: "4",
    label: "Purchase Date",
    accessor: "due_date",
  },
  {
    id: "5",
    label: "Expire Date",
    accessor: "status",
  },
];

export const FeatureFields = [
  {
    id: "0",
    label: "Payment ID",
    accessor: "purchase_id",
  },
  {
    id: "1",
    label: "Purchase Date",
    accessor: "payment_date",
  },
  {
    id: "2",
    label: "Display Page",
    accessor: "display_pages",
  },
  {
    id: "3",
    label: "Amount Paid",
    accessor: "amount_paid",
  },
  {
    id: "4",
    label: "Period",
    accessor: "period",
  },
  {
    id: "5",
    label: "Start Date",
    accessor: "start_date",
  },
  {
    id: "5",
    label: "Expire date",
    accessor: "expired_date",
  },
];
export const CampaignFields = [
  {
    id: "0",
    label: "Payment ID",
    accessor: "payment_id",
  },
  {
    id: "1",
    label: "Campaign Type",
    accessor: "campaign_type",
  },
  {
    id: "1",
    label: "Campaign Name",
    accessor: "campaign_name",
  },
  {
    id: "2",
    label: "Link",
    accessor: "link",
  },
  {
    id: "3",
    label: "Uploaded",
    accessor: "uploaded",
  },
  {
    id: "4",
    label: "Period",
    accessor: "period",
  },
  {
    id: "5",
    label: "Amount",
    accessor: "amount",
  },
  {
    id: "5",
    label: "Expire date",
    accessor: "expired_date",
  },
];
export const SMSFields = [
  {
    id: "0",
    label: "Purchase ID",
    accessor: "id",
  },
  {
    id: "1",
    label: "Quantity / Units",
    accessor: "units",
  },
  {
    id: "2",
    label: "Price",
    accessor: "price",
  },
  // {
  //   id: "3",
  //   label: "Status",
  //   accessor: "status",
  // },
  {
    id: "4",
    label: "Purchase Date",
    accessor: "date",
  },
  // {
  //   id: "5",
  //   label: "Date",
  //   accessor: "date",
  // },
];

function formatToNGN(value: string) {
  const numericValue =
    typeof value === "string" ? Number(value.replace(/,/g, "")) : value;

  if (isNaN(numericValue)) return "Invalid value";

  return numericValue.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export interface SponsorUnitTable {
  sponsor_value: string;
  sponsor_listings: {
    transaction_id: number;
    date: string;
    units: number;
    amount: string;
  }[];
}

export const transformSponsorResponse = (
  response: SponsorListingsResponse
): SponsorUnitTable => {
  return {
    sponsor_value: response.data?.value || "0",
    sponsor_listings: response.data.listings.data.map(
      (listing: SponsoredListing) => ({
        transaction_id: listing.id,
        date: dayjs(listing.created_at).format("MMM DD YYYY"),
        units: listing.units,
        amount: formatToNGN(listing.amount),
      })
    ),
  };
};

// export const transformSponsorResponse = (
//   response: SponsorListingsResponse
// ): SponsorDataTypes => {
//   return {
//     sponsor_value: response.data?.value || "0",
//     sponsor_listings: response.data.listings.data.map(
//       (listing: SponsoredListing) => ({
//         unit_id: listing.id,
//         property_name: listing.property_name,
//         unit_name: listing.unit_name,
//         unit_description: listing.unit_description,
//         status: listing.status,
//         annual_rent: `₦${formatNumber(Number(listing.annual_rent))}`,
//         date: dayjs(listing.created_at).format("MMM DD YYYY"),
//       })
//     ),
//     pagination: {
//       current_page: response.data.listings.current_page,
//       total_pages: response.data.listings.last_page,
//       total: response.data.listings.total,
//     },
//   };
// };

export const SponsorData = [
  {
    unit_id: "12345678990",
    property_name: "Alabata Road 3 Room 7",
    unit_name: "Room 04",
    unit_description: "Bodija Branch",
    status: "vacant",
    annual_rent: "₦13,600,000",
    date: "12/02/2024",
  },
];

export const added_units: SubscriptionTableType = {
  fields: [
    {
      id: "0",
      label: "Unit ID",
      accessor: "unit_id",
    },
    {
      id: "1",
      label: "Property Name",
      accessor: "property_name",
    },
    {
      id: "2",
      label: "Unit Name",
      accessor: "unit_name",
    },
    {
      id: "5",
      label: "Status",
      accessor: "status",
    },
    {
      id: "6",
      label: "Total Package",
      accessor: "annual_rent",
    },
    {
      id: "3",
      label: "Date",
      accessor: "date",
    },
  ],
  data: [
    {
      unit_id: "12345678990",
      property_name: "Alabata Road 3 Room 7",
      unit_name: "Room 04",
      unit_description: "Bodija Branch",
      status: "vacant",
      annual_rent: "₦13,600,000",
      date: "12/02/2024",
    },
  ],
};

export const buySMS = async (payload: any) => {
  try {
    const data = await api.post(`/sms/buy`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (data.status === 200 || data.status === 201) {
      window.dispatchEvent(new Event("buySMS"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const requestCompanyFeature = async (
  payload: any,
  companyId: string
) => {
  try {
    const data = await api.post(`brands/${companyId}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (data.status === 200 || data.status === 201) {
      window.dispatchEvent(new Event("companyFeature"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const postCampaign = async (payload: FormData, companyId: string) => {
  try {
    const data = await api.post(`campaigns/${companyId}`, payload);

    if (data.status === 200 || data.status === 201) {
      window.dispatchEvent(new Event("companyCampaign"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
