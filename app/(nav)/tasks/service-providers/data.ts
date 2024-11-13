export const serviceProviderFilterOptionsWithDropdown = [
  {
    label: "Provider Name",
    value: [
      { label: "Provider Name 1", value: "Provider Name1" },
      { label: "Provider Name 2", value: "Provider Name2" },
      { label: "Provider Name 3", value: "Provider Name3" },
    ],
  },
  {
    label: "Account Type",
    value: [
      { label: "Account Type 1", value: "Account Type1" },
      { label: "Account Type 2", value: "Account Type2" },
      { label: "Account Type 3", value: "Account Type3" },
    ],
  },
];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getAllServiceProviders = async () => {};

export const getServiceProviderById = async (id: string) => {};

export const createServiceProvider = async (data: FormData) => {};
