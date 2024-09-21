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

  const accessToken = useAuthStore((state) => state.access_token);

  const [tenant, setTenant] = useState<TenantData | null>(null);

  useEffect(() => {
    const fetchTenant = async () => {
      const data = await getOneTenant(
        tenantId as string,
        accessToken as string
      );

      if (!data) return router.push("/management/tenants");

      setTenant(data);
    };

    fetchTenant();
  }, [accessToken, tenantId, router]);

  return { tenant, tenantId };
};

export default useTenantData;
