import { cookies } from "next/headers";
import MessagesPage from "./MessagesClient";
import axios from "axios";
import { base_url } from "@/app/(onboarding)/auth/data";

const Page = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    console.log("No token found in cookies");
    return <div>Please log in</div>;
  }

  try {
    // Fetch messages and users data with Authorization header
    const [messagesRes, usersRes] = await Promise.all([
      axios.get(`${base_url}messages`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${base_url}company/users`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const messagesData = messagesRes.data;
    const usersData = usersRes.data;

    return <MessagesPage serverData={{ messagesData, usersData }} />;
  } catch (err) {
    console.error("Error fetching data:", err);
    return <div>Failed to fetch data</div>;
  }
};

export default Page;
