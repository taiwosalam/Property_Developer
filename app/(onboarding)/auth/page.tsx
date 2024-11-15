import { redirect } from "next/navigation";

const Auth = () => {
  redirect("/auth/sign-in");
};

export default Auth;
