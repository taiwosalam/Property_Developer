"use client";

import PropertyManagerClientReportVariantC from "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/reports/client/client";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import dynamic from "next/dynamic";

import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { Suspense } from "react";

const PropertyDeveloperClientReportVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/reports/investors/export"
    ),
  { ssr: false }
);

const PropertyDeveloperClientReportVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/reports/investors/export"
    ),
  { ssr: false }
);

const PropertyDeveloperClientReportVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/reports/investors/export"
    ),
  { ssr: false }
);

const HospitalityManagerClientReportVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/reports/investors/export"
    ),
  { ssr: false }
);

const HospitalityManagerClientReportVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/reports/investors/export"
    ),
  { ssr: false }
);

const HospitalityManagerClientReportVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/reports/investors/export"
    ),
  { ssr: false }
);

const ClientReportExportPage = () => {
  const { activeModule, designVariant } = useModule();
  const { role } = useRole();

  if (role !== "director") {
    return (
      <div className="p-4 text-red-500">
        Access Denied: Director role required.
      </div>
    );
  }

  const ClientReportComponent =
    {
      property_manager: {
        variant_a: PropertyDeveloperClientReportVariantA,
        variant_b: PropertyDeveloperClientReportVariantB,
        variant_c: PropertyDeveloperClientReportVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagerClientReportVariantA,
        variant_b: HospitalityManagerClientReportVariantB,
        variant_c: HospitalityManagerClientReportVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperClientReportVariantA,
        variant_b: PropertyDeveloperClientReportVariantB,
        variant_c: PropertyDeveloperClientReportVariantC,
      },
    }[activeModule.id]?.[designVariant] ||
    PropertyDeveloperClientReportVariantA;

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
              <ClientReportComponent />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </Suspense>
    </>
  );
};

export default ClientReportExportPage;
