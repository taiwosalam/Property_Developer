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
