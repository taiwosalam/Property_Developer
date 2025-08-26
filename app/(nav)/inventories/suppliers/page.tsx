"use client";
import FilterBar from "@/components/FIlterBar/FilterBar";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";

/** PROPERTY DEVELOPER */
const PropertyDeveloperCategoryVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/inventories/Suppliers"
    ),
  { ssr: false }
);
const PropertyDeveloperCategoryVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/inventories/Suppliers"
    ),
  { ssr: false }
);
const PropertyDeveloperCategoryVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/inventories/Suppliers"
    ),
  { ssr: false }
);

/** HOSPITALITY MANAGEMENT */
const HospitalityManagementCategoryVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/inventories/Suppliers"
    ),
  { ssr: false }
);
const HospitalityManagementCategoryVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/inventories/Suppliers"
    ),
  { ssr: false }
);
const HospitalityManagementCategoryVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/inventories/Suppliers"
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
        variant_a: PropertyDeveloperCategoryVariantA,
        variant_b: PropertyDeveloperCategoryVariantB,
        variant_c: PropertyDeveloperCategoryVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperCategoryVariantA,
        variant_b: PropertyDeveloperCategoryVariantB,
        variant_c: PropertyDeveloperCategoryVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagementCategoryVariantA,
        variant_b: HospitalityManagementCategoryVariantB,
        variant_c: HospitalityManagementCategoryVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyDeveloperCategoryVariantA;

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
