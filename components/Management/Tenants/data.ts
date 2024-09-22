export const addTenant = async (formData: any, accessToken: string | null) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tenants`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json());

    console.log(response);
  } catch (error) {
    console.error("Error adding tenant:", error);
  }
};
export const addMultipleTenants = async (formData: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tenants/import`,
      { method: "POST", body: formData }
    ).then((res) => res.json());

    console.log(response);
  } catch (error) {
    console.error("Error adding multiple tenants:", error);
  }
};
