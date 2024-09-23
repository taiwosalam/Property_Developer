export const createNewBranch = async (
  data: any,
  access_token: string | null
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/branches`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    return { error: true, message: "An error occurred" };
  }
};
