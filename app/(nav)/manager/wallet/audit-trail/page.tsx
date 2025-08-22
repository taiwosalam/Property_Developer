"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuditTrail = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/wallet/audit-trail/export");
  }, [router]);

  return null;
};

export default AuditTrail;
