"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { AnimatePresence, motion } from "framer-motion";

// Dynamic imports for Property Developer Properties Page variants
const PropertyDeveloperPropertiesVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/management/properties/propertiesPage"
    ),
  { ssr: false }
);

const PropertyDeveloperPropertiesVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/management/properties/propertiesPage"
    ),
  { ssr: false }
);

const PropertyDeveloperPropertiesVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/management/properties/propertiesPage"
    ),
  { ssr: false }
);

// Dynamic imports for Property Manager Properties Page variants
const PropertyManagerPropertiesVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/management/properties/propertiesPage"
    ),
  { ssr: false }
);

const PropertyManagerPropertiesVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/management/properties/propertiesPage"
    ),
  { ssr: false }
);

const PropertyManagerPropertiesVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/management/properties/propertiesPage"
    ),
  { ssr: false }
);

const PropertiesPage = () => {
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

  // Define component mapping for supported modules
  const componentMap: Record<string, Record<string, React.ComponentType>> = {
    property_developer: {
      variant_a: PropertyDeveloperPropertiesVariantA,
      variant_b: PropertyDeveloperPropertiesVariantB,
      variant_c: PropertyDeveloperPropertiesVariantC,
    },
    property_manager: {
      variant_a: PropertyManagerPropertiesVariantA,
      variant_b: PropertyManagerPropertiesVariantB,
      variant_c: PropertyManagerPropertiesVariantC,
    },
  };

  // Check if the active module is supported
  if (!["property_developer", "property_manager"].includes(activeModule.id)) {
    return (
      <div className="p-4 text-red-500">
        Properties page is only available for Property Developer or Property
        Manager modules.
      </div>
    );
  }

  // Map activeModule and designVariant to the appropriate Properties component
  const PropertiesComponent =
    componentMap[activeModule.id]?.[designVariant] ||
    componentMap.property_developer.variant_a;

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
          <PropertiesComponent />
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export default PropertiesPage;
