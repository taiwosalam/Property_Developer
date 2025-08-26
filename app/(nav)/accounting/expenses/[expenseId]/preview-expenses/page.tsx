
"use client";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

/** PROPERTY MANAGER */
const PropertyManagerExpensesVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/accounting/expenses/[expenseId]/preview-expenses/preview-page"
    ),
  { ssr: false }
);
const PropertyManagerExpensesVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/accounting/expenses/[expenseId]/preview-expenses/preview-page"
    ),
  { ssr: false }
);
const PropertyManagerExpensesVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/accounting/expenses/[expenseId]/preview-expenses/preview-page"
    ),
  { ssr: false }
);

/** PROPERTY DEVELOPER */
const PropertyDeveloperExpensesVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/accounting/expenses/[expenseId]/preview-expenses/preview-page"
    ),
  { ssr: false }
);
const PropertyDeveloperExpensesVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/accounting/expenses/[expenseId]/preview-expenses/preview-page"
    ),
  { ssr: false }
);
const PropertyDeveloperExpensesVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/accounting/expenses/[expenseId]/preview-expenses/preview-page"
    ),
  { ssr: false }
);

/** HOSPITALITY MANAGEMENT */
const HospitalityManagementExpensesVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/accounting/expenses/[expenseId]/preview-expenses/preview-page"
    ),
  { ssr: false }
);
const HospitalityManagementExpensesVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/accounting/expenses/[expenseId]/preview-expenses/preview-page"
    ),
  { ssr: false }
);
const HospitalityManagementExpensesVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/accounting/expenses/[expenseId]/preview-expenses/preview-page"
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
        variant_a: PropertyManagerExpensesVariantA,
        variant_b: PropertyManagerExpensesVariantB,
        variant_c: PropertyManagerExpensesVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperExpensesVariantA,
        variant_b: PropertyDeveloperExpensesVariantB,
        variant_c: PropertyDeveloperExpensesVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagementExpensesVariantA,
        variant_b: HospitalityManagementExpensesVariantB,
        variant_c: HospitalityManagementExpensesVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyManagerExpensesVariantA;

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
