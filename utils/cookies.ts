import Cookies from "js-cookie";

// Function to get the token from cookies
export const getToken = (): string | undefined => {
  return Cookies.get("token");
};

// Function to store the token in cookies
export const storeToken = (token: string) => {
  Cookies.set("token", token, { expires: 7 }); // Set token with a 7-day expiration
};

// Function to remove the token from cookies
export const removeToken = () => {
  Cookies.remove("token");
};
