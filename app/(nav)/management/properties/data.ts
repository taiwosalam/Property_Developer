import { getAllStates } from "@/utils/states";

const states = getAllStates();

export const propertyFilterOptionsWithDropdowns = [
  {
    label: "Branch",
    value: [
      { label: "Branch 1", value: "branch1" },
      { label: "Branch 2", value: "branch2" },
      { label: "Branch 3", value: "branch3" },
    ],
  },
  {
    label: "Account Officer",
    value: [
      { label: "Account Officer 1", value: "account_officer1" },
      { label: "Account Officer 2", value: "account_officer2" },
      { label: "Account Officer 3", value: "account_officer3" },
    ],
  },
  {
    label: "State",
    value: states.map((state) => ({
      label: state,
      value: state.toLowerCase(),
    })),
  },
];

export const propertyFilterOptionsRadio = [
  {
    label: "Property Type",
    value: [
      { label: "gated estate", value: "gated_estate" },
      { label: "single Property", value: "single_Property" },
      { label: "All properties", value: "all_properties" },
    ],
  },
];

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
export const getAllProperties = async (accessToken: string | null) => {
  try {
    const response = await fetch(`${baseURL}/properties`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createProperty = async (accessToken: string | null, data: any) => {
  try {
    const response = await fetch(`${baseURL}/properties`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
};
