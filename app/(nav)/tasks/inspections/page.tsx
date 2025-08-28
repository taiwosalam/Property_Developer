"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { AnimatePresence, motion } from "framer-motion";

const PropertyManagerInspectionVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/tasks/inspections/inspectionPage"
    ),
  { ssr: false }
);

const PropertyManagerInspectionVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/tasks/inspections/inspectionPage"
    ),
  { ssr: false }
);

const PropertyManagerInspectionVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/tasks/inspections/inspectionPage"
    ),
  { ssr: false }
);

const PropertyDeveloperInspectionVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/tasks/inspections/inspectionPage"
    ),
  { ssr: false }
);

const PropertyDeveloperInspectionVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/tasks/inspections/inspectionPage"
    ),
  { ssr: false }
);

const PropertyDeveloperInspectionVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/tasks/inspections/inspectionPage"
    ),
  { ssr: false }
);

const InspectionPage = () => {
  const { activeModule, designVariant } = useModule();
  const { role } = useRole();

  if (role !== "director") {
    return (
      <div className="p-4 text-red-500">
        Access Denied: Director role required.
      </div>
    );
  }

  const InspectionComponent =
    {
      property_manager: {
        variant_a: PropertyManagerInspectionVariantA,
        variant_b: PropertyManagerInspectionVariantB,
        variant_c: PropertyManagerInspectionVariantC,
      },
      hospitality_manager: {
      },
      property_developer: {
        variant_a: PropertyDeveloperInspectionVariantA,
        variant_b: PropertyDeveloperInspectionVariantB,
        variant_c: PropertyDeveloperInspectionVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyManagerInspectionVariantA;

  return (
    <Suspense fallback={<PageCircleLoader />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeModule.id}-${designVariant}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <InspectionComponent />
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export default InspectionPage;