// "use client";

// import CustomTable from "@/components/Table/table";
// import ExportPageHeader from "@/components/reports/export-page-header";
// import { empty } from "@/app/config";
// import BackButton from "@/components/BackButton/back-button";
// import {
//   propertiesReportTablefields,
//   PropertyApiResponse,
//   TransformedPropertyData,
//   transformPropertyData,
// } from "../data";
// import Signature from "@/components/Signature/signature";
// import ExportPageFooter from "@/components/reports/export-page-footer";
// import useFetch from "@/hooks/useFetch";
// import { useEffect, useRef, useState } from "react";
// import CustomLoader from "@/components/Loader/CustomLoader";
// import NetworkError from "@/components/Error/NetworkError";

// import dayjs from "dayjs";
// import advancedFormat from "dayjs/plugin/advancedFormat";
// import { useGlobalStore } from "@/store/general-store";

// dayjs.extend(advancedFormat);

// const ExportProperties = () => {
//   const exportRef = useRef<HTMLDivElement>(null);
//   const [fullContent, setFullContent] = useState(false);
//   const [pageData, setPageData] = useState<TransformedPropertyData>({
//     total_properties: 0,
//     monthly_properties: 0,
//     properties: [],
//   });

//   const filteredProperties = useGlobalStore((s) => s.properties);

//   const { data, loading, error, isNetworkError } =
//     useFetch<PropertyApiResponse>("/report/properties");

//   useEffect(() => {
//     if (data) {
//       const transformedData = transformPropertyData(data);
//       setPageData(transformedData);
//     }
//   }, [data]);

//   const { total_properties, monthly_properties, properties } = pageData;

//   if (loading)
//     return (
//       <CustomLoader layout="page" pageTitle="Properties Report" view="table" />
//     );
//   if (isNetworkError) return <NetworkError />;
//   if (error)
//     return <p className="text-base text-red-500 font-medium">{error}</p>;

//   return (
//     <div className="space-y-9 pb-[100px]">
//       <BackButton as="p">Back</BackButton>
//       <div ref={exportRef} className="space-y-9">
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
//           className={`${fullContent && "max-h-none"}`}
//           fields={propertiesReportTablefields}
//           data={filteredProperties || []}
//           tableHeadClassName="h-[45px]"
//         />
//         <Signature />
//       </div>
//       <ExportPageFooter printRef={exportRef} setFullContent={setFullContent} />
//     </div>
//   );
// };

// export default ExportProperties;

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
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/reports/properties/export"
    ),
  { ssr: false }
);

const PropertyManagerPropertiesReportVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/reports/properties/export"
    ),
  { ssr: false }
);

const PropertyManagerPropertiesReportVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/reports/properties/export"
    ),
  { ssr: false }
);

/* PROPERTY DEVELOPER */
const PropertyDeveloperPropertiesReportVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/reports/properties/export"
    ),
  { ssr: false }
);

const PropertyDeveloperPropertiesReportVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/reports/properties/export"
    ),
  { ssr: false }
);

const PropertyDeveloperPropertiesReportVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/reports/properties/export"
    ),
  { ssr: false }
);

/* HOSPITALITY MANAGER */
const HospitalityManagerPropertiesReportVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/reports/properties/export"
    ),
  { ssr: false }
);

const HospitalityManagerPropertiesReportVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/reports/properties/export"
    ),
  { ssr: false }
);

const HospitalityManagerPropertiesReportVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/reports/properties/export"
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
