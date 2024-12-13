import type { FilterOptionMenu } from "@/components/Management/Landlord/types";

export const listingUnitFilter: FilterOptionMenu[] = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
  {
    label: "branch",
    value: [
      { label: "branch 1", value: "branch1" },
      { label: "branch 2", value: "branch2" },
      { label: "branch 3", value: "branch3" },
    ],
  },
  {
    radio: true,
    label: "Status",
    value: [
      { label: "Published", value: "published" },
      { label: "Unpublished", value: "unpublished" },
      { label: "Under Moderation", value: "under_moderation" },
      { label: "Rejected", value: "rejected" },
    ],
  },
];


export const unit_listing_status = {
  published: "#01BA4C",
  unpublished: "#FFBB53",
  "under moderation": "#702AC8",
  rejected: '#FB1818'
} as const;