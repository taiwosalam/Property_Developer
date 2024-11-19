import { redirect } from "next/navigation";

const Redirect = () => {
  redirect("/auth/sign-in");
};

export default Redirect;
