// import { states } from "@/data";
import { getAllStates } from "@/utils/states";

export const inspectionFilterOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
  {
    label: "Tenant/Occupant",
    value: [
      { label: "Tenant/Occupant 1", value: "Tenant/Occupant1" },
      { label: "Tenant/Occupant 2", value: "Tenant/Occupant2" },
      { label: "Tenant/Occupant 3", value: "Tenant/Occupant3" },
      { label: "Tenant/Occupant 4", value: "Tenant/Occupant4" },
      { label: "Tenant/Occupant 5", value: "Tenant/Occupant5" },
    ],
  },
];

export const articleOptions = [
  { label: "All Articles", value: "all" },
  { label: "Trending Articles", value: "trending" },
  { label: "New Articles", value: "new" },
];

export const propertyRequestOptions = [
  { label: "All Property Request", value: "all" },
  { label: "Trending Property Request", value: "trending" },
  { label: "New Property Request", value: "new" },
];

const states = getAllStates();

export const stateOptions = [
  {
    label: "State",
    value: states.map((state) => ({ label: state, value: state })),
  },
];