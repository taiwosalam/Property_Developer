"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const Property = () => {
  const router = useRouter();
  const { branchId } = useParams();

  useEffect(() => {
    router.replace(`/management/staff-branch/${branchId}`);
  }, [router, branchId]);

  return null;
};

export default Property;
