"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

const VehicleRecordPage = () => {
  const router = useRouter();
  const { recordId } = useParams();

  useEffect(() => {
    if (recordId) {
      router.replace(`//vehicles-record/${recordId}/record`);
    }
  }, [recordId, router]);

  return null;
};

export default VehicleRecordPage;
