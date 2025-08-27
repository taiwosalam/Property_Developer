// "use client";
// import BackButton from "@/components/BackButton/back-button";
// import Signature from "@/components/Signature/signature";
// import ExportPageFooter from "@/components/reports/export-page-footer";
// import CustomTable from "@/components/Table/table";
// import ExportPageHeader from "@/components/reports/export-page-header";
// import { empty } from "@/app/config";
// import { trackingTableFields } from "../../data";
// import {
//   transformUserActivityData,
//   UserActivityResponse,
//   UserActivityTable,
// } from "../types";
// import { useParams } from "next/navigation";
// import useFetch from "@/hooks/useFetch";
// import { useEffect, useRef, useState } from "react";
// import CustomLoader from "@/components/Loader/CustomLoader";
// import NetworkError from "@/components/Error/NetworkError";

// import dayjs from "dayjs";
// import advancedFormat from "dayjs/plugin/advancedFormat";
// import ServerError from "@/components/Error/ServerError";
// import { useGlobalStore } from "@/store/general-store";

// dayjs.extend(advancedFormat);

// const UserActivitiesExportPage = () => {
//   const exportRef = useRef<HTMLDivElement>(null);
//   const [fullContent, setFullContent] = useState(false);

//   const [userActivity, setUserActivity] = useState<UserActivityTable>({
//     name: "",
//     activities: [],
//     pagination: { total: 0, current_page: 0, last_page: 0 },
//   });
//   const { userId } = useParams();
//   const {
//     data: activityData,
//     loading,
//     isNetworkError,
//     error,
//   } = useFetch<UserActivityResponse>(`report/activities/${userId}`);

//   const filteredActivities = useGlobalStore((s) => s.user_activities)

//   useEffect(() => {
//     if (activityData) {
//       setUserActivity(transformUserActivityData(activityData));
//     }
//   }, [activityData]);

//   const { name, activities } = userActivity;

//   if (loading)
//     return (
//       <CustomLoader layout="page" pageTitle="Tracking Report" view="table" />
//     );
//   if (isNetworkError) return <NetworkError />;
//   if (error) {
//     return <ServerError error={error} />;
//   }
//   return (
//     <div className="space-y-9 pb-[100px]">
//       <BackButton as="p">{name}</BackButton>
//       <div ref={exportRef}>
//         <ExportPageHeader />
//         <div className="space-y-3">
//           <h1 className="text-center text-black text-lg md:text-xl lg:text-2xl font-medium">
//             Summary{" "}
//             <span className="px-2">{`(${dayjs().format(
//               "Do MMMM YYYY"
//             )})`}</span>
//           </h1>
//         </div>
//         <CustomTable
//           fields={trackingTableFields}
//           data={filteredActivities || []}
//           className={`${fullContent && "max-h-none"}`}
//         />
//         <Signature />
//       </div>
//       <ExportPageFooter printRef={exportRef} setFullContent={setFullContent} fullContent={fullContent}/>
//     </div>
//   );
// };

// export default UserActivitiesExportPage;





"use client";

import PropertyManagerClientReportVariantC from "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/reports/client/client";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import dynamic from "next/dynamic";

import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { Suspense } from "react";

const PropertyManagerPropertiesReportVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/reports/tracking/export/export"
    ),
  { ssr: false }
);

const PropertyManagerPropertiesReportVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/reports/tracking/export/export"
    ),
  { ssr: false }
);

const PropertyManagerPropertiesReportVariantC = dynamic(
  () =>
    import(
        "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/reports/tracking/export/export"
    ),
  { ssr: false }
);

/* PROPERTY DEVELOPER */
const PropertyDeveloperPropertiesReportVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/reports/tracking/[userId]/export/export"
    ),
  { ssr: false }
);

const PropertyDeveloperPropertiesReportVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/reports/tracking/[userId]/export/export"
    ),
  { ssr: false }
);

const PropertyDeveloperPropertiesReportVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/reports/tracking/[userId]/export/export"
    ),
  { ssr: false }
);

/* HOSPITALITY MANAGER */
const HospitalityManagerPropertiesReportVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/reports/tracking/[userId]/export/export"
    ),
  { ssr: false }
);

const HospitalityManagerPropertiesReportVariantB = dynamic(
  () =>
    import(
    "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/reports/tracking/[userId]/export/export"
    ),
  { ssr: false }
);

const HospitalityManagerPropertiesReportVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/reports/tracking/[userId]/export/export"
    ),
  { ssr: false }
);

const ClientReportExportPage = () => {
  const { activeModule, designVariant } = useModule();
  const { role } = useRole();

  if (role !== "director") {
    return (
      <div className="p-4 text-red-500">
        Access Denied: Director role required.
      </div>
    );
  }

  const ClientReportComponent =
    {
      property_manager: {
        variant_a: PropertyManagerPropertiesReportVariantA,
        variant_b: PropertyManagerPropertiesReportVariantB,
        variant_c: PropertyManagerPropertiesReportVariantC,
      },
      hospitality_manager: {
        variant_a: HospitalityManagerPropertiesReportVariantA,
        variant_b: HospitalityManagerPropertiesReportVariantB,
        variant_c: HospitalityManagerPropertiesReportVariantC,
      },
      property_developer: {
        variant_a: PropertyDeveloperPropertiesReportVariantA,
        variant_b: PropertyDeveloperPropertiesReportVariantB,
        variant_c: PropertyDeveloperPropertiesReportVariantC,
      },
    }[activeModule.id]?.[designVariant] ||
    PropertyManagerPropertiesReportVariantA;

  return (
    <>
      <Suspense fallback={<PageCircleLoader />}>
        <LazyMotion features={domAnimation}>
          <AnimatePresence mode="wait">
            <m.div
              key={`${activeModule.id}-${designVariant}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <ClientReportComponent />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </Suspense>
    </>
  );
};

export default ClientReportExportPage;

