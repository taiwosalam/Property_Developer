export const examineFilterOptionsWithDropdown = [
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

export const getAllExamine = async (access_token: string | null) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/examine`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching examines:", error);
    throw new Error(`Error: ${error}`);
  }
};
