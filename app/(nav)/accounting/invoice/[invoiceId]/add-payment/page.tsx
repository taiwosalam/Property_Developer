
"use client";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

/** PROPERTY MANAGER */
const PropertyManagerInvoiceVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/accounting/invoice/[invoiceId]/add-payment/add-payment-page"
    ),
  { ssr: false }
);
const PropertyManagerInvoiceVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/accounting/invoice/[invoiceId]/add-payment/add-payment-page"
    ),
  { ssr: false }
);
const PropertyManagerInvoiceVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/accounting/invoice/[invoiceId]/add-payment/add-payment-page"
    ),
  { ssr: false }
);

/** PROPERTY DEVELOPER */
const PropertyDeveloperInvoiceVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/accounting/invoice/[invoiceId]/add-payment/add-payment-page"
    ),
  { ssr: false }
);
const PropertyDeveloperInvoiceVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/accounting/invoice/[invoiceId]/add-payment/add-payment-page"
    ),
  { ssr: false }
);
const PropertyDeveloperInvoiceVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/accounting/invoice/[invoiceId]/add-payment/add-payment-page"
    ),
  { ssr: false }
);

/** HOSPITALITY MANAGEMENT */
const HospitalityManagementInvoiceVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/accounting/invoice/[invoiceId]/add-payment/add-payment-page"
    ),
  { ssr: false }
);
const HospitalityManagementInvoiceVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/accounting/invoice/[invoiceId]/add-payment/add-payment-page"
    ),
  { ssr: false }
);
const HospitalityManagementInvoiceVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/accounting/invoice/[invoiceId]/add-payment/add-payment-page"
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
        variant_a: PropertyManagerInvoiceVariantA,
        variant_b: PropertyManagerInvoiceVariantB,
        variant_c: PropertyManagerInvoiceVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperInvoiceVariantA,
        variant_b: PropertyDeveloperInvoiceVariantB,
        variant_c: PropertyDeveloperInvoiceVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagementInvoiceVariantA,
        variant_b: HospitalityManagementInvoiceVariantB,
        variant_c: HospitalityManagementInvoiceVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyManagerInvoiceVariantA;

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
