const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
export const getAllAnnouncements = async (accessToken: string | null) => {
  try {
    const response = await fetch(`${baseURL}/announcements`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createAnnouncement = async (
  accessToken: string | null,
  data: FormData
) => {
  try {
    console.log(accessToken);
    const response = await fetch(`${baseURL}/announcements`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: data,
      mode: "no-cors"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};
