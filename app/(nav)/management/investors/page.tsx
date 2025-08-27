"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { AnimatePresence, motion } from "framer-motion";

// Dynamic imports for Property Developer Client Page variants
const PropertyDeveloperInvestorVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/management/investors/investorsPage"
    ),
  { ssr: false }
);

const PropertyDeveloperInvestorVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/management/investors/investorPage"
    ),
  { ssr: false }
);

const PropertyDeveloperInvestorVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/management/investors/investorPage"
    ),
  { ssr: false }
);

const ClientPage = () => {
  const { activeModule, designVariant } = useModule();
  const { role } = useRole();

  // Restrict access to director role
  if (role !== "director") {
    return (
      <div className="p-4 text-red-500">
        Access Denied: Director role required.
      </div>
    );
  }

  // Define component mapping for property_developer
  const componentMap: Record<string, Record<string, React.ComponentType>> = {
    property_developer: {
      variant_a: PropertyDeveloperInvestorVariantA,
      variant_b: PropertyDeveloperInvestorVariantB,
      variant_c: PropertyDeveloperInvestorVariantC,
    },
  };

  // Check if the active module is supported
  if (activeModule.id !== "property_developer") {
    return (
      <div className="p-4 text-red-500">
        Investor page is only available for Property Developer module.
      </div>
    );
  }

  // Map activeModule and designVariant to the appropriate Investor component
  const InvestorComponent =
    componentMap[activeModule.id]?.[designVariant] ||
    PropertyDeveloperInvestorVariantA;

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
          <InvestorComponent />
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export default ClientPage;
