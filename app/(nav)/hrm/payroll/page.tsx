"use client";
import FilterBar from "@/components/FIlterBar/FilterBar";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";

/** PROPERTY DEVELOPER */
const PropertyDeveloperLogbookUserVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/hrm/Payroll"
    ),
  { ssr: false }
);
const PropertyDeveloperLogbookUserVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/hrm/Payroll"
    ),
  { ssr: false }
);
const PropertyDeveloperLogbookUserVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/hrm/Payroll"
    ),
  { ssr: false }
);

/** HOSPITALITY MANAGEMENT */
const HospitalityManagementLogbookUserVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/hrm/Payroll"
    ),
  { ssr: false }
);
const HospitalityManagementLogbookUserVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/hrm/Payroll"
    ),
  { ssr: false }
);
const HospitalityManagementLogbookUserVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/hrm/Payroll"
    ),
  { ssr: false }
);

const LogbookUserPage = () => {
  const { activeModule, designVariant } = useModule();
  const { role } = useRole();

  if (role !== "director") {
    return (
      <div className="p-4 text-red-500">
        Access Denied: Director role required.
      </div>
    );
  }

  const Component =
    {
      property_manager: {
        variant_a: PropertyDeveloperLogbookUserVariantA,
        variant_b: PropertyDeveloperLogbookUserVariantB,
        variant_c: PropertyDeveloperLogbookUserVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperLogbookUserVariantA,
        variant_b: PropertyDeveloperLogbookUserVariantB,
        variant_c: PropertyDeveloperLogbookUserVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagementLogbookUserVariantA,
        variant_b: HospitalityManagementLogbookUserVariantB,
        variant_c: HospitalityManagementLogbookUserVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyDeveloperLogbookUserVariantA;

  return (
    <>
      <Suspense fallback={<PageCircleLoader />}>
        <LazyMotion features={domAnimation}>
          <AnimatePresence mode="wait">
            <m.div
              key={`${activeModule.id}-${designVariant}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Component />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </Suspense>
    </>
  );
};

export default LogbookUserPage;
