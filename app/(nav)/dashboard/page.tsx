"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";

const PropertyManagerDashboardVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/dashboard/dashboard_variant_a"
    ),
  { ssr: false }
);

const PropertyManagerDashboardVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/dashboard/dashboard_variant_b"
    ),
  { ssr: false }
);

const PropertyManagerDashboardVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/dashboard/dashboard_variant_c"
    ),
  { ssr: false }
);

const HospitalityManagerDashboardVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/dashboard/dashboard_variant_a"
    ),
  { ssr: false }
);

const HospitalityManagerDashboardVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/dashboard/dashboard_variant_b"
    ),
  { ssr: false }
);

const HospitalityManagerDashboardVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/dashboard/dashboard_variant_c"
    ),
  { ssr: false }
);

const PropertyDeveloperDashboardVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/dashboard/dashboard_variant_a"
    ),
  { ssr: false }
);

const PropertyDeveloperDashboardVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/dashboard/dashboard_variant_b"
    ),
  { ssr: false }
);

const PropertyDeveloperDashboardVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/dashboard/dashboard_variant_c"
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
        variant_a: PropertyManagerDashboardVariantA,
        variant_b: PropertyManagerDashboardVariantB,
        variant_c: PropertyManagerDashboardVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagerDashboardVariantA,
        variant_b: HospitalityManagerDashboardVariantB,
        variant_c: HospitalityManagerDashboardVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperDashboardVariantA,
        variant_b: PropertyDeveloperDashboardVariantB,
        variant_c: PropertyDeveloperDashboardVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyManagerDashboardVariantA;

  return (
    <Suspense fallback={<PageCircleLoader />}>
      <DashboardComponent />
    </Suspense>
  );
};

export default DashboardPage;
