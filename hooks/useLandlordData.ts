import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authstrore";
import { getOneLandlord } from "@/app/(nav)/management/landlord/data";
import { LandlordPageData } from "@/app/(nav)/management/landlord/types";

const useLandlordData = () => {
  const router = useRouter();
  const { landlordId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const accessToken = useAuthStore((state) => state.access_token);

  const [landlord, setLandlord] = useState<LandlordPageData | null>(null);

  useEffect(() => {
    const fetchLandlord = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getOneLandlord(
          landlordId as string,
          accessToken as string
        );

        if (!data) return router.push("/management/landlord");

        setLandlord(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandlord();
  }, [accessToken, landlordId, router]);

  return { landlord, landlordId, loading, error };
};

export default useLandlordData;
