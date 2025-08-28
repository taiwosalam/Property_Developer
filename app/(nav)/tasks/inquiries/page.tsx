"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { AnimatePresence, motion } from "framer-motion";

const PropertyManagerInquiryVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/tasks/inquiries/inquiriesPage"
    ),
  { ssr: false }
);

const PropertyManagerInquiryVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/tasks/inquiries/inquiriesPage"
    ),
  { ssr: false }
);

const PropertyManagerInquiryVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/tasks/inquiries/inquiriesPage"
    ),
  { ssr: false }
);

const PropertyDeveloperInquiryVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/tasks/inquiries/inquiriesPage"
    ),
  { ssr: false }
);

const PropertyDeveloperInquiryVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/tasks/inquiries/inquiriesPage"
    ),
  { ssr: false }
);

const PropertyDeveloperInquiryVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/tasks/inquiries/inquiriesPage"
    ),
  { ssr: false }
);

const InquiryPage = () => {
  const { activeModule, designVariant } = useModule();
  const { role } = useRole();

  if (role !== "director") {
    return (
      <div className="p-4 text-red-500">
        Access Denied: Director role required.
      </div>
    );
  }

  const CalendarComponent =
    {
      property_manager: {
        variant_a: PropertyManagerInquiryVariantA,
        variant_b: PropertyManagerInquiryVariantB,
        variant_c: PropertyManagerInquiryVariantC,
      },
      hospitality_manager: {
      },
      property_developer: {
        variant_a: PropertyDeveloperInquiryVariantA,
        variant_b: PropertyDeveloperInquiryVariantB,
        variant_c: PropertyDeveloperInquiryVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyManagerInquiryVariantA;

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
          <CalendarComponent />
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export default InquiryPage;