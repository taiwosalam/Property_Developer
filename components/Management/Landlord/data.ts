export const addLandlord = async (
  formData: any,
  acces_token: string | null
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/landlord/create`,
      { method: "POST", body: formData }
    ).then((res) => res.json());

    console.log(response);
  } catch (error) {
    console.error("Error adding landlord:", error);
  }
};
