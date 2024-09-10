"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const Tenant = () => {
  const router = useRouter();
  const { tenantId } = useParams();

  useEffect(() => {
    router.replace(`/management/tenants/${tenantId}/manage`);
  }, [router, tenantId]);

  return null;
};

export default Tenant;
