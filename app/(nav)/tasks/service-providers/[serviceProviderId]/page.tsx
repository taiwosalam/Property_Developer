"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const Landlord = () => {
  const router = useRouter();
  const { serviceProviderId } = useParams();

  useEffect(() => {
    router.replace(`/tasks/service-providers/${serviceProviderId}/manage`);
  }, [router, serviceProviderId]);

  return null;
};

export default Landlord;
