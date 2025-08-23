"use client";

import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const PropertyDeveloperApplicationDetailsVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/application/application_details_variant_a"
    ),
  { ssr: false }
);

const PropertyDeveloperApplicationDetailsVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/application/application_details_variant_b"
    ),
  { ssr: false }
);

const PropertyDeveloperApplicationDetailsVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/application/application_details_variant_c"
    ),
  { ssr: false }
);

const PropertyManagerApplicationDetailsVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/application/application_details_variant_a"
    ),
  { ssr: false }
);

const PropertyManagerApplicationDetailsVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/application/application_details_variant_b"
    ),
  { ssr: false }
);

const PropertyManagerApplicationDetailsVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/application/application_details_variant_c"
    ),
  { ssr: false }
);

const HospitalityManagerApplicationDetailsVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/application/application_details_variant_a"
    ),
  { ssr: false }
);

const HospitalityManagerApplicationDetailsVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/application/application_details_variant_b"
    ),
  { ssr: false }
);

const HospitalityManagerApplicationDetailsVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/application/application_details_variant_c"
    ),
  { ssr: false }
);

const ApplicationDetailsPage = () => {
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
        variant_a: PropertyManagerApplicationDetailsVariantA,
        variant_b: PropertyManagerApplicationDetailsVariantB,
        variant_c: PropertyManagerApplicationDetailsVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperApplicationDetailsVariantA,
        variant_b: PropertyDeveloperApplicationDetailsVariantB,
        variant_c: PropertyDeveloperApplicationDetailsVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagerApplicationDetailsVariantA,
        variant_b: HospitalityManagerApplicationDetailsVariantB,
        variant_c: HospitalityManagerApplicationDetailsVariantC,
      },
    }[activeModule.id]?.[designVariant] ||
    PropertyDeveloperApplicationDetailsVariantA;

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

export default ApplicationDetailsPage;
