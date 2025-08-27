"use client";
import FilterBar from "@/components/FIlterBar/FilterBar";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import HospitalityManagerApplicationVariantA from "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/application/application_variant_a";
import HospitalityManagerApplicationVariantB from "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/application/application_variant_b";
import HospitalityManagerApplicationVariantC from "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/application/application_variant_c";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";

/** PROPERTY DEVELOPER */
const PropertyDeveloperApplicationVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/application/application_variant_a"
    ),
  { ssr: false }
);
const PropertyDeveloperApplicationVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/application/application_variant_b"
    ),
  { ssr: false }
);
const PropertyDeveloperApplicationVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/application/application_variant_c"
    ),
  { ssr: false }
);

/** HOSPITALITY MANAGEMENT */
const HospitalityManagementApplicationVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/application/application_variant_a"
    ),
  { ssr: false }
);
const HospitalityManagementApplicationVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/application/application_variant_b"
    ),
  { ssr: false }
);
const HospitalityManagementApplicationVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/application/application_variant_c"
    ),
  { ssr: false }
);

const ApplicationPage = () => {
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
        variant_a: PropertyDeveloperApplicationVariantA,
        variant_b: PropertyDeveloperApplicationVariantB,
        variant_c: PropertyDeveloperApplicationVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperApplicationVariantA,
        variant_b: PropertyDeveloperApplicationVariantB,
        variant_c: PropertyDeveloperApplicationVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagerApplicationVariantA,
        variant_b: HospitalityManagerApplicationVariantB,
        variant_c: HospitalityManagerApplicationVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyDeveloperApplicationVariantA;

  return (
    <>
      <Suspense fallback={<PageCircleLoader />}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeModule.id}-${designVariant}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <ApplicationComponent />
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </>
  );
};

export default ApplicationPage;
