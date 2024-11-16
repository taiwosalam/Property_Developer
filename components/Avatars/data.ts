// // import api from "@/services/api";
// import axios from "axios";

// let cachedAvatars: string[] = [];

// export const getAvatarsList = async (): Promise<string[]> => {
//   if (cachedAvatars.length > 0) {
//     return cachedAvatars;
//   }

//   try {
//     // const { data } = await api.get("/avatars");
//     // cachedAvatars = data.avatars;
//     // return cachedAvatars;
//     const { data } = await axios.get(
//       "https://staging.ourproperty.ng/api/files-list",
//       {
//         headers: {
//           Authorization:
//             "Bearer 798|Rl5sySkgjC1HLSI4BG5FJSVpzRIIgxLL7RuA67Apa88a543f",
//         },
//       }
//     );
//     cachedAvatars = [...data.avatars, ...data.avatars, ...data.avatars];
//     return cachedAvatars;
//   } catch (error) {
//     console.error("Failed to fetch avatars:", error);
//     return [];
//   }
// };

const avatarLinks = [
  "https://pubassets.ourproperty.ng/uploads/gBTaZYUXOch2qrKq5k5F2EdShRihQjYGuxDwOuu6.png",
  "https://pubassets.ourproperty.ng/uploads/7M10IKK6OGULqivpfmJ7AMYWNb1BAzpboSLtHffM.png",
  "https://pubassets.ourproperty.ng/uploads/es2Oy2BoX9CmUjhJMfXS2ILNRkrelzY8aGIKddz1.png",
  "https://pubassets.ourproperty.ng/uploads/oZCKiu5n4yzoiSDoDkRDBQQxOZi57snQXvd8rJHC.png",
  "https://pubassets.ourproperty.ng/uploads/yZlXfgqcoIV4SSDpvTrbV2M5udRiusWXunoiC9hz.png",
  "https://pubassets.ourproperty.ng/uploads/YhSZNRte5NqAu8uNOmNwOPyQIZvKxSGRy4JKF5DO.png",
  "https://pubassets.ourproperty.ng/uploads/VDtHgwc2C6MwrdjFfjf6X0StiabEj2fRllraBsOT.png",
  "https://pubassets.ourproperty.ng/uploads/l8GSUMmMDVhK8kQxdJH1DEMQcdxYSpeOGEa9JHSV.png",
  "https://pubassets.ourproperty.ng/uploads/BTNKJxqAzAHjP1vDKUeJKQNkiI8CsLJNbqOJfKzk.png",
  "https://pubassets.ourproperty.ng/uploads/UIczCGlVxjMMmJZtwkY3BgxoUSNTqbY9stCcX6Wi.png",
  "https://pubassets.ourproperty.ng/uploads/Bedc5t1a83qOb1Au3dl3N8RKkn7WNrgZpmg8yCER.png",
  "https://pubassets.ourproperty.ng/uploads/YhSZNRte5NqAu8uNOmNwOPyQIZvKxSGRy4JKF5DO.png",
];

let cachedAvatars: string[] = [];

export const getAvatarsList = async (): Promise<string[]> => {
  if (cachedAvatars.length > 0) {
    return cachedAvatars;
  }

  try {
    // Initialize cache with static avatar links
    cachedAvatars = [...avatarLinks, ...avatarLinks, ...avatarLinks];
    return cachedAvatars;
  } catch (error) {
    console.error("Failed to load avatars:", error);
    return [];
  }
};
