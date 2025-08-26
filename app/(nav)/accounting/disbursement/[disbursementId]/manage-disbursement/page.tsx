



"use client";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

/** PROPERTY MANAGER */
const PropertyManagerDisbursementVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/accounting/disbursement/[disbursementId]/manage-disbursement/manage-page"
    ),
  { ssr: false }
);
const PropertyManagerDisbursementVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/accounting/disbursement/[disbursementId]/manage-disbursement/manage-page"
    ),
  { ssr: false }
);
const PropertyManagerDisbursementVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/accounting/disbursement/[disbursementId]/manage-disbursement/manage-page"
    ),
  { ssr: false }
);

/** PROPERTY DEVELOPER */
const PropertyDeveloperDisbursementVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/accounting/disbursement/[disbursementId]/manage-disbursement/manage-page"
    ),
  { ssr: false }
);
const PropertyDeveloperDisbursementVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/accounting/disbursement/[disbursementId]/manage-disbursement/manage-page"
    ),
  { ssr: false }
);
const PropertyDeveloperDisbursementVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/accounting/disbursement/[disbursementId]/manage-disbursement/manage-page"
    ),
  { ssr: false }
);

/** HOSPITALITY MANAGEMENT */
const HospitalityManagementDisbursementVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/accounting/disbursement/[disbursementId]/manage-disbursement/manage-page"
    ),
  { ssr: false }
);
const HospitalityManagementDisbursementVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/accounting/disbursement/[disbursementId]/manage-disbursement/manage-page"
    ),
  { ssr: false }
);
const HospitalityManagementDisbursementVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/accounting/disbursement/[disbursementId]/manage-disbursement/manage-page"
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

  const InvoicePageComponent =
    {
      property_manager: {
        variant_a: PropertyManagerDisbursementVariantA,
        variant_b: PropertyManagerDisbursementVariantB,
        variant_c: PropertyManagerDisbursementVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperDisbursementVariantA,
        variant_b: PropertyDeveloperDisbursementVariantB,
        variant_c: PropertyDeveloperDisbursementVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagementDisbursementVariantA,
        variant_b: HospitalityManagementDisbursementVariantB,
        variant_c: HospitalityManagementDisbursementVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyManagerDisbursementVariantA;

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
              <InvoicePageComponent />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </Suspense>
    </>
  );
};

export default ApplicationPage;
