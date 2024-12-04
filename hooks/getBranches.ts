// hooks/useBranches.ts
import api from "@/services/api";
import { useEffect, useState } from "react";

const getBranches = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/branches/select");
        if (!data) {
          throw new Error("Network response was not ok");
        }
        setBranches(data.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return { branches, loading, error };
};

export default getBranches;
