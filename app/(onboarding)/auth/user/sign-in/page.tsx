import SignInClient from "./signInClient";

export const generateMetadata = async () => {
  return {
    title: "Login",
    description: "Log in to your account",
  };
};

export default function SignInPage() {
  return <SignInClient />;
}
