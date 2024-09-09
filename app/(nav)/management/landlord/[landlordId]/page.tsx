"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const Landlord = () => {
  const router = useRouter();
  const { landlordId } = useParams();

  useEffect(() => {
    router.replace(`/management/landlord/${landlordId}/manage`);
  }, [router, landlordId]);

  return null;
};

export default Landlord;
