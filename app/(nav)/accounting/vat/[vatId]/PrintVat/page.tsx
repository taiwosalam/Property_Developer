


"use client";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

/** PROPERTY MANAGER */
const PropertyManagerVATVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/accounting/vat/[vatId]/PrintVat/vat-id-page"
    ),
  { ssr: false }
);
const PropertyManagerVATVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/accounting/vat/[vatId]/PrintVat/vat-id-page"
    ),
  { ssr: false }
);
const PropertyManagerVATVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/accounting/vat/[vatId]/PrintVat/vat-id-page"
    ),
  { ssr: false }
);

/** PROPERTY DEVELOPER */
const PropertyDeveloperVATVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/accounting/vat/[vatId]/PrintVat/vat-id-page"
    ),
  { ssr: false }
);
const PropertyDeveloperVATVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/accounting/vat/[vatId]/PrintVat/vat-id-page"
    ),
  { ssr: false }
);
const PropertyDeveloperVATVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/accounting/vat/[vatId]/PrintVat/vat-id-page"
    ),
  { ssr: false }
);

/** HOSPITALITY MANAGEMENT */
const HospitalityManagementVATVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/accounting/vat/[vatId]/PrintVat/vat-id-page"
    ),
  { ssr: false }
);
const HospitalityManagementVATVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/accounting/vat/[vatId]/PrintVat/vat-id-page"
    ),
  { ssr: false }
);
const HospitalityManagementVATVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/accounting/vat/[vatId]/PrintVat/vat-id-page"
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
        variant_a: PropertyManagerVATVariantA,
        variant_b: PropertyManagerVATVariantB,
        variant_c: PropertyManagerVATVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperVATVariantA,
        variant_b: PropertyDeveloperVATVariantB,
        variant_c: PropertyDeveloperVATVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagementVATVariantA,
        variant_b: HospitalityManagementVATVariantB,
        variant_c: HospitalityManagementVATVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyManagerVATVariantA;

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
