"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authstrore";
import { useParams, useRouter } from "next/navigation";

// Types
import type { TenantData } from "@/app/(nav)/management/tenants/types";

// Imports
import { getOneTenant } from "@/app/(nav)/management/tenants/data";

const useTenantData = () => {
  const router = useRouter();

  const { tenantId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const accessToken = useAuthStore((state) => state.access_token);

  const [tenant, setTenant] = useState<TenantData | null>(null);

  useEffect(() => {
    const fetchTenant = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOneTenant(
          tenantId as string,
          accessToken as string
        );
        if (!data) {
          router.push("/management/tenants");
          return;
        }
        setTenant(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [accessToken, tenantId, router]);

  return { tenant, tenantId, loading, error };
};

export default useTenantData;
