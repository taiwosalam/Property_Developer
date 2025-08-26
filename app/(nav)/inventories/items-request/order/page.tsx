"use client";
import FilterBar from "@/components/FIlterBar/FilterBar";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";

/** PROPERTY DEVELOPER */
const PropertyDeveloperInventoriesOrderVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/inventories/Order"
    ),
  { ssr: false }
);
const PropertyDeveloperInventoriesOrderVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/inventories/Order"
    ),
  { ssr: false }
);
const PropertyDeveloperInventoriesOrderVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/inventories/Order"
    ),
  { ssr: false }
);

/** HOSPITALITY MANAGEMENT */
const HospitalityManagementInventoriesOrderVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/inventories/Order"
    ),
  { ssr: false }
);
const HospitalityManagementInventoriesOrderVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/inventories/Order"
    ),
  { ssr: false }
);
const HospitalityManagementInventoriesOrderVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/inventories/Order"
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
        variant_a: PropertyDeveloperInventoriesOrderVariantA,
        variant_b: PropertyDeveloperInventoriesOrderVariantB,
        variant_c: PropertyDeveloperInventoriesOrderVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperInventoriesOrderVariantA,
        variant_b: PropertyDeveloperInventoriesOrderVariantB,
        variant_c: PropertyDeveloperInventoriesOrderVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagementInventoriesOrderVariantA,
        variant_b: HospitalityManagementInventoriesOrderVariantB,
        variant_c: HospitalityManagementInventoriesOrderVariantC,
      },
    }[activeModule.id]?.[designVariant] ||
    HospitalityManagementInventoriesOrderVariantA;

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
