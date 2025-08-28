"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { AnimatePresence, motion } from "framer-motion";

const PropertyManagerAnnouncementVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/tasks/announcements/announcementPage"
    ),
  { ssr: false }
);

const PropertyManagerAnnouncementVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/tasks/announcements/announcementPage"
    ),
  { ssr: false }
);

const PropertyManagerAnnouncementVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/tasks/announcements/announcementPage"
    ),
  { ssr: false }
);

const PropertyDeveloperAnnouncementVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/tasks/announcements/announcementPage"
    ),
  { ssr: false }
);

const PropertyDeveloperAnnouncementVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/tasks/announcements/announcementPage"
    ),
  { ssr: false }
);

const PropertyDeveloperAnnouncementVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/tasks/announcements/announcementPage"
    ),
  { ssr: false }
);

const AnnouncementPage = () => {
  const { activeModule, designVariant } = useModule();
  const { role } = useRole();

  if (role !== "director") {
    return (
      <div className="p-4 text-red-500">
        Access Denied: Director role required.
      </div>
    );
  }
  
  const AnnouncementComponent =
    {
      property_manager: {
        variant_a: PropertyManagerAnnouncementVariantA,
        variant_b: PropertyManagerAnnouncementVariantB,
        variant_c: PropertyManagerAnnouncementVariantC,
      },
      hospitality_manager: {
      },
      property_developer: {
        variant_a: PropertyDeveloperAnnouncementVariantA,
        variant_b: PropertyDeveloperAnnouncementVariantB,
        variant_c: PropertyDeveloperAnnouncementVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyManagerAnnouncementVariantA;

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
          <AnnouncementComponent />
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export default AnnouncementPage;
