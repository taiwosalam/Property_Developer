import { toast } from "sonner";

export const addTenant = async (
  formData: FormData
): Promise<boolean | any> => {
  
  if(!(formData instanceof FormData)) {
    console.error('Invalid input: data must be a FormData instance');
    return false;
  }
  console.log('Form Data -',formData instanceof FormData);

  const image = formData.get('picture') as File | null;
  const avatar = formData.get('avatar') as string | null;

  console.log('Image -',image);
  console.log('Avatar -',avatar);
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
