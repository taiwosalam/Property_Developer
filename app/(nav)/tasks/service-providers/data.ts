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

export const getAllServiceProviders = async (accessToken: string | null) => {
  try {
    const response = await fetch(`${BASE_URL}/services`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
};

export const getServiceProviderById = async (
  accessToken: string | null,
  id: string
) => {
  try {
    const response = await fetch(`${BASE_URL}/services/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
};

export const createServiceProvider = async (
  accessToken: string | null,
  data: any
) => {
  try {
    const response = await fetch(`${BASE_URL}/services`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
    }).then((res) => res.json());
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
};
