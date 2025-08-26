"use client";
import FilterBar from "@/components/FIlterBar/FilterBar";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";

/** PROPERTY DEVELOPER */
const PropertyDeveloperItemsRequestVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/inventories/ItemsRequest"
    ),
  { ssr: false }
);
const PropertyDeveloperItemsRequestVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/inventories/ItemsRequest"
    ),
  { ssr: false }
);
const PropertyDeveloperItemsRequestVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/inventories/ItemsRequest"
    ),
  { ssr: false }
);

/** HOSPITALITY MANAGEMENT */
const HospitalityManagementItemsRequestVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/inventories/ItemsRequest"
    ),
  { ssr: false }
);
const HospitalityManagementItemsRequestVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/inventories/ItemsRequest"
    ),
  { ssr: false }
);
const HospitalityManagementItemsRequestVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/inventories/ItemsRequest"
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
        variant_a: PropertyDeveloperItemsRequestVariantA,
        variant_b: PropertyDeveloperItemsRequestVariantB,
        variant_c: PropertyDeveloperItemsRequestVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperItemsRequestVariantA,
        variant_b: PropertyDeveloperItemsRequestVariantB,
        variant_c: PropertyDeveloperItemsRequestVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagementItemsRequestVariantA,
        variant_b: HospitalityManagementItemsRequestVariantB,
        variant_c: HospitalityManagementItemsRequestVariantC,
      },
    }[activeModule.id]?.[designVariant] ||
    PropertyDeveloperItemsRequestVariantA;

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
