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
