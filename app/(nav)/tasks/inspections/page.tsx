"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { AnimatePresence, motion } from "framer-motion";

const PropertyManagerCalendarVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/tasks/calendar/calendarPage"
    ),
  { ssr: false }
);

const PropertyManagerCalendarVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/tasks/calendar/calendarPage"
    ),
  { ssr: false }
);

const PropertyManagerCalendarVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/tasks/calendar/calendarPage"
    ),
  { ssr: false }
);

const PropertyDeveloperCalendarVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/tasks/calendar/calendarPage"
    ),
  { ssr: false }
);

const PropertyDeveloperCalendarVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/tasks/calendar/calendarPage"
    ),
  { ssr: false }
);

const PropertyDeveloperCalendarVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/tasks/calendar/calendarPage"
    ),
  { ssr: false }
);

const DashboardPage = () => {
  const { activeModule, designVariant } = useModule();
  const { role } = useRole();

  if (role !== "director") {
    return (
      <div className="p-4 text-red-500">
        Access Denied: Director role required.
      </div>
    );
  }

  const DashboardComponent =
    {
      property_manager: {
        variant_a: PropertyManagerCalendarVariantA,
        variant_b: PropertyManagerCalendarVariantB,
        variant_c: PropertyManagerCalendarVariantC,
      },
      hospitality_manager: {
      },
      property_developer: {
        variant_a: PropertyDeveloperCalendarVariantA,
        variant_b: PropertyDeveloperCalendarVariantB,
        variant_c: PropertyDeveloperCalendarVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyManagerCalendarVariantA;

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
          <DashboardComponent />
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export default DashboardPage;