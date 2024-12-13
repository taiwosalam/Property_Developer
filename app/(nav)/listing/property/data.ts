import type { FilterOptionMenu } from "@/components/Management/Landlord/types";

export const listingPropertyFilter: FilterOptionMenu[] = [
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
    label: "Status",
    radio: true,
    value: [
      { label: "Draft", value: "draft" },
      { label: "Request", value: "request" },
      // { label: "Status 3", value: "Status3" },
      // { label: "Status 4", value: "Status4" },
    ],
  },
];
