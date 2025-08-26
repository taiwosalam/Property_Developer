"use client";
import FilterBar from "@/components/FIlterBar/FilterBar";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";

/** PROPERTY DEVELOPER */
const PropertyDeveloperLogbookVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/hrm/Logbook"
    ),
  { ssr: false }
);
const PropertyDeveloperLogbookVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/hrm/Logbook"
    ),
  { ssr: false }
);
const PropertyDeveloperLogbookVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/hrm/Logbook"
    ),
  { ssr: false }
);

/** HOSPITALITY MANAGEMENT */
const HospitalityManagementLogbookVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/hrm/Logbook"
    ),
  { ssr: false }
);
const HospitalityManagementLogbookVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/hrm/Logbook"
    ),
  { ssr: false }
);
const HospitalityManagementLogbookVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/hrm/Logbook"
    ),
  { ssr: false }
);

const LogbookPage = () => {
  const { activeModule, designVariant } = useModule();
  const { role } = useRole();

  if (role !== "director") {
    return (
      <div className="p-4 text-red-500">
        Access Denied: Director role required.
      </div>
    );
  }

  const ApplicationComponent =
    {
      property_manager: {
        variant_a: PropertyDeveloperLogbookVariantA,
        variant_b: PropertyDeveloperLogbookVariantB,
        variant_c: PropertyDeveloperLogbookVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperLogbookVariantA,
        variant_b: PropertyDeveloperLogbookVariantB,
        variant_c: PropertyDeveloperLogbookVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagementLogbookVariantA,
        variant_b: HospitalityManagementLogbookVariantB,
        variant_c: HospitalityManagementLogbookVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyDeveloperLogbookVariantA;

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
              <ApplicationComponent />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </Suspense>
    </>
  );
};

export default LogbookPage;
