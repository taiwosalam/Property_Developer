export const saveRoleToCookie = async (role: string) => {
  try {
    const response = await fetch("/api/set-role-cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      throw new Error("Failed to set role cookie");
    }
  } catch (error) {
    console.error("Error saving role to cookie:", error);
  }
};

export const saveCompanyStatusToCookie = async (company_status: string) => {
  try {
    const response = await fetch("/api/setcompanystatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_status }),
    });

    if (!response.ok) {
      throw new Error("Failed to set company status cookie");
    }
  } catch (error) {
    console.error("Error saving company status to cookie:", error);
  }
};
