import { useMemo } from "react";
import dayjs from "dayjs";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { DynamicMarqueeConfig } from "./types";

export const useMarqueeConfig = (): DynamicMarqueeConfig => {
  const currentPlan = usePersonalInfoStore((state) => state.currentPlan);
  const currentExpiryDate = usePersonalInfoStore(
    (state) => state.currentExpiryDate
  );

  //   // TODO : UNCOMMENT THE COUNT BELOW WHEN READY IN /USER/PROFILE AND SET TO STORE
  //   //   const propertyCount = usePersonalInfoStore((state) => state.remainingPropertyCount);
  //   //   const unitCount = usePersonalInfoStore((state) => state.remainingUnitCount);
  //   //   const tenantCount = usePersonalInfoStore((state) => state.remainingTenantCount);
  const propertyCount = 200;
  const unitCount = 2300;
  const tenantCount = 23450;

  const expiryDays = useMemo(() => {
    if (!currentExpiryDate) return undefined;
    const expiry = dayjs(currentExpiryDate);
    const now = dayjs();
    const diffDays = expiry.diff(now, "day");
    return diffDays > 0 ? diffDays : 0;
  }, [currentExpiryDate]);

  // ✅ Memoize the entire config
  return useMemo(
    () => ({
      currentPlan,
      expiryDays,
      propertyCount,
      unitCount,
      tenantCount,
    }),
    [currentPlan, expiryDays, propertyCount, unitCount, tenantCount]
  );
};
