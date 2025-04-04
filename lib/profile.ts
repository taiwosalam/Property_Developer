import { cookies } from "next/headers";

export interface ProfileResponse {
  data: {
    company?: {
      company_name?: string;
      company_logo?: string;
    };
  };
}

export async function fetchProfile(): Promise<ProfileResponse> {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/v1/user/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "force-cache",
        next: { revalidate: 86400 },
      }
    );

    if (!response.ok) {
      console.log(`fetchProfile failed with status ${response.status}`, {
        statusText: response.statusText,
      });
      return {
        data: {
          company: {
            company_name: "Our Property",
            company_logo: "/default-favicon.ico",
          },
        },
      };
    }

    const data = await response.json();
    // console.log("fetchProfile response:", data); // Log the full response
    return data;
  } catch (error) {
    // console.log("fetchProfile error:", error);
    return {
      data: {
        company: {
          company_name: "Our Property",
          company_logo: "/default-favicon.ico",
        },
      },
    };
  }
}
