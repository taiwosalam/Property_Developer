"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { AnimatePresence, motion } from "framer-motion";

const PropertyManagerStaffBranchA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/management/staff-branch/staffBranchPage"
    ),
  { ssr: false }
);

const PropertyManagerStaffBranchB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/management/staff-branch/staffBranchPage"
    ),
  { ssr: false }
);

const PropertyManagerStaffBranchC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/management/staff-branch/staffBranchPage"
    ),
  { ssr: false }
);

// const HospitalityManagerStaffBranchA = dynamic(
//   () =>
//     import(
//       "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/management/staff-branch/staffBranchPage"
//     ),
//   { ssr: false }
// );

// const HospitalityManagerStaffBranchB = dynamic(
//   () =>
//     import(
//       "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/management/staff-branch/staffBranchPage"
//     ),
//   { ssr: false }
// );

// const HospitalityManagerStaffBranchC = dynamic(
//   () =>
//     import(
//       "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/management/staff-branch/staffBranchPage"
//     ),
//   { ssr: false }
// );

const PropertyDeveloperStaffBranchA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/management/staff-branch/staffBranchPage"
    ),
  { ssr: false }
);

const PropertyDeveloperStaffBranchB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/management/staff-branch/staffBranchPage"
    ),
  { ssr: false }
);

const PropertyDeveloperStaffBranchC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/management/staff-branch/staffBranchPage"
    ),
  { ssr: false }
);

const StaffBranchPage = () => {
  const { activeModule, designVariant } = useModule();
  const { role } = useRole();

  if (role !== "director") {
    return (
      <div className="p-4 text-red-500">
        Access Denied: Director role required.
      </div>
    );
  }

  const StaffBranchComponent =
    {
      property_manager: {
        variant_a: PropertyManagerStaffBranchA,
        variant_b: PropertyManagerStaffBranchB,
        variant_c: PropertyManagerStaffBranchC,
      },
      hospitality_manager: {
        // variant_a: HospitalityManagerStaffBranchA,
        // variant_b: HospitalityManagerStaffBranchB,
        // variant_c: HospitalityManagerStaffBranchC,
      },
      property_developer: {
        variant_a: PropertyDeveloperStaffBranchA,
        variant_b: PropertyDeveloperStaffBranchB,
        variant_c: PropertyDeveloperStaffBranchC,
      },
    }[activeModule.id]?.[designVariant] || PropertyManagerStaffBranchA;

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
          <StaffBranchComponent />
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export default StaffBranchPage;
