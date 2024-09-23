import { toast } from "sonner";

export const addTenant = async (formData: any, accessToken: string | null) => {
  try {
    const errors: string[] = [];
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tenants`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      Object.values(data.errors).forEach((error, index) => {
        errors.push(error as string);
      });

      console.log(errors);

      toast.error(errors.join(", "));
    }

    console.log(response, data);
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
