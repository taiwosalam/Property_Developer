// import api from "@/services/api";
import axios from "axios";

let cachedAvatars: string[] = [];

export const getAvatarsList = async (): Promise<string[]> => {
  if (cachedAvatars.length > 0) {
    return cachedAvatars;
  }

  try {
    // const { data } = await api.get("/avatars");
    // cachedAvatars = data.avatars;
    // return cachedAvatars;
    const { data } = await axios.get(
      "https://staging.ourproperty.ng/api/files-list",
      {
        headers: {
          Authorization:
            "Bearer 798|Rl5sySkgjC1HLSI4BG5FJSVpzRIIgxLL7RuA67Apa88a543f",
        },
      }
    );
    cachedAvatars = [...data.avatars, ...data.avatars, ...data.avatars];
    return cachedAvatars;
  } catch (error) {
    console.error("Failed to fetch avatars:", error);
    return [];
  }
};
