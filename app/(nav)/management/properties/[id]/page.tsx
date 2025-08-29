"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { AnimatePresence, motion } from "framer-motion";
import { PropertyPreviewProps } from "@/components/Management/Properties/previews/property-preview";
import { useSearchParams } from "next/navigation";

// Dynamic imports for Property Developer PropertyPreview variants
const PropertyDeveloperPropertyPreviewVariantA = dynamic(
  () => import("@/components/Management/Properties/previews/p_dev_p_preview_a"),
  { ssr: false }
);

const PropertyDeveloperPropertyPreviewVariantB = dynamic(
  () => import("@/components/Management/Properties/previews/p_dev_p_preview_b"),
  { ssr: false }
);

const PropertyDeveloperPropertyPreviewVariantC = dynamic(
  () => import("@/components/Management/Properties/previews/p_dev_p_preview_c"),
  { ssr: false }
);

// Dynamic imports for Property Manager PropertyPreview variants
const PropertyManagerPropertyPreviewVariantA = dynamic(
  () => import("@/components/Management/Properties/previews/property-preview"),
  { ssr: false }
);

const PropertyManagerPropertyPreviewVariantB = dynamic(
  () =>
    import("@/components/Management/Properties/previews/p_manager_p_preview_b"),
  { ssr: false }
);

const PropertyManagerPropertyPreviewVariantC = dynamic(
  () =>
    import("@/components/Management/Properties/previews/p_manager_p_preview_c"),
  { ssr: false }
);

const PropertyPreviewPage = ({ params }: { params: { id: string } }) => {
  const propertyType = useSearchParams().get("property_type");
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
  const componentMap: any = {
    property_developer: {
      variant_a: PropertyDeveloperPropertyPreviewVariantA,
      variant_b: PropertyDeveloperPropertyPreviewVariantB,
      variant_c: PropertyDeveloperPropertyPreviewVariantC,
    },
    property_manager: {
      variant_a: PropertyManagerPropertyPreviewVariantA,
      variant_b: PropertyManagerPropertyPreviewVariantB,
      variant_c: PropertyManagerPropertyPreviewVariantC,
    },
  };

  // Check if the active module is supported
  if (!["property_developer", "property_manager"].includes(activeModule.id)) {
    return (
      <div className="p-4 text-red-500">
        Property preview page is only available for Property Developer or
        Property Manager modules.
      </div>
    );
  }

  // Map activeModule and designVariant to the appropriate PropertyPreview component
  const PropertyPreviewComponent =
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
          <PropertyPreviewComponent
            id={params.id}
            propertyType={propertyType}
          />
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export default PropertyPreviewPage;
