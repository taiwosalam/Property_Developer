"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { AnimatePresence, motion } from "framer-motion";

// Dynamic imports for Property Developer Request Page variants
const PropertyDeveloperComplainVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/tasks/complain/complainPage"
    ),
  { ssr: false }
);

const PropertyDeveloperComplainVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/tasks/complain/complainPage"
    ),
  { ssr: false }
);

const PropertyDeveloperComplainVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/tasks/complain/complainPage"
    ),
  { ssr: false }
);

const ComplainPage = () => {
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
      variant_a: PropertyDeveloperComplainVariantA,
      variant_b: PropertyDeveloperComplainVariantB,
      variant_c: PropertyDeveloperComplainVariantC,
    },
  };

  // Check if the active module is supported
  if (activeModule.id !== "property_developer") {
    return (
      <div className="p-4 text-red-500">
        Request page is only available for Property Developer module.
      </div>
    );
  }

  // Map activeModule and designVariant to the appropriate Request component
  const RequestComponent =
    componentMap[activeModule.id]?.[designVariant] ||
    PropertyDeveloperComplainVariantA;

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
          <RequestComponent />
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export default ComplainPage;
