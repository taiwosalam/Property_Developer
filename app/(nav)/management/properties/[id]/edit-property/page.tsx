
"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { AnimatePresence, motion } from "framer-motion";

// Define props interface for EditProperty components
interface EditPropertyProps {
  propertyId: string;
}

// Dynamic imports for Property Developer EditProperty variants
const PropertyDeveloperEditPropertyVariantA = dynamic(
  () => import("@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/management/properties/editProperty"),
  { ssr: false }
);

const PropertyDeveloperEditPropertyVariantB = dynamic(
  () => import("@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/management/properties/editProperty"),
  { ssr: false }
);

const PropertyDeveloperEditPropertyVariantC = dynamic(
  () => import("@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/management/properties/editProperty"),
  { ssr: false }
);

// Dynamic imports for Property Manager EditProperty variants
const PropertyManagerEditPropertyVariantA = dynamic(
  () =>
    import("@/components/PAGES/DIRECTOR/PropertyManager/variantA/management/properties/edit-property"),
  { ssr: false }
);

const PropertyManagerEditPropertyVariantB = dynamic(
  () =>
    import("@/components/PAGES/DIRECTOR/PropertyManager/VariantB/management/properties/editProperty"),
  { ssr: false }
);

const PropertyManagerEditPropertyVariantC = dynamic(
  () =>
    import("@/components/PAGES/DIRECTOR/PropertyManager/VariantC/management/properties/editProperty"),
  { ssr: false }
);

const EditPropertyPage = ({ params }: { params: { id: string } }) => {
  const { activeModule, designVariant } = useModule();
  const { role } = useRole();
  const propertyId = params.id;

  // Restrict access to director role
  if (role !== "director") {
    return (
      <div className="p-4 text-red-500">
        Access Denied: Director role required.
      </div>
    );
  }

  // Define component mapping for supported modules
  const componentMap: Record<
    string,
    Record<string, React.ComponentType<EditPropertyProps>>
  > = {
    property_developer: {
      variant_a: PropertyDeveloperEditPropertyVariantA,
      variant_b: PropertyDeveloperEditPropertyVariantB,
      variant_c: PropertyDeveloperEditPropertyVariantC,
    },
    property_manager: {
      variant_a: PropertyManagerEditPropertyVariantA,
      variant_b: PropertyManagerEditPropertyVariantB,
      variant_c: PropertyManagerEditPropertyVariantC,
    },
  };

  // Check if the active module is supported
  if (!["property_developer", "property_manager"].includes(activeModule.id)) {
    return (
      <div className="p-4 text-red-500">
        Edit Property page is only available for Property Developer or Property
        Manager modules.
      </div>
    );
  }

  // Map activeModule and designVariant to the appropriate EditProperty component
  const EditPropertyComponent =
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
          <EditPropertyComponent propertyId={propertyId} />
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export default EditPropertyPage;
