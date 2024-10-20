import { useState, useEffect } from "react";
import { getDashboardData } from "@/app/(nav)/dashboard/data";
import { useAuthStore } from "@/store/authstrore";

interface UserData {
  user_id: number;
  email: string;
  stage: number;
  role: string;
  company_name: string;
  company_type: string;
  company_industry: string | null;
  cac_certificate: string;
  membership_certificate: string;
  cac_date: string;
  company_phone: string;
  logo: string;
  profile_pic: string;
  director_name: string;
  director_title: string;
  director_experience: string;
  director_email: string;
  director_about: string;
  director_phone: string;
  verification: string;
}

export const useDashboardData = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const accessToken = useAuthStore((state) => state.access_token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData(accessToken);
        setData(dashboardData);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  return { data, loading, error };
};
