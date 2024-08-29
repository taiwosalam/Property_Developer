// utils/cookies.ts
import Cookies from "js-cookie";

export const storeToken = (token: string, rememberMe: boolean = false) => {
  const options = rememberMe
    ? { expires: 10 } // Token expires in 10 days
    : undefined; // Default behavior (session cookie)
  Cookies.set("authToken", token, options);
};

export const getToken = () => {
  return Cookies.get("authToken");
};

export const removeToken = () => {
  Cookies.remove("authToken");
};
