// Types
import type { AvatarType } from "./types";

const avatars: Partial<Record<AvatarType, string[]>> = {};

export const getAvatarsList = async (
  type: AvatarType,
  access_token: string | null
): Promise<string[]> => {
  // Check if the avatars data already exists
  if (avatars[type]) {
    return avatars[type]!;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/files-list`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      }
    ).then((res) => res.json());

    // Ensure the response contains data for the requested type
    if (response[type] && Array.isArray(response[type])) {
      avatars[type] = response[type];
      return avatars[type]!;
    } else {
      console.error(`No data found for type: ${type}`);
      return [];
    }
  } catch (error) {
    console.error(error, "An error occurred while fetching avatars list.");
    return [];
  }
};
