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



export const teamChatOptions = [
  { label: "Moniya Branch", value: "moniya" },
  { label: "Germany Branch", value: "germany" },
  { label: "Tokyo Branch", value: "tokyo" },
  { label: "Ontario Branch", value: "ontario" },
  { label: "Australia Branch", value: "australia" },
];
