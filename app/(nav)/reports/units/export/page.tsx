// "use client";

// import CustomTable from "@/components/Table/table";
// import ExportPageHeader from "@/components/reports/export-page-header";
// import { empty } from "@/app/config";
// import BackButton from "@/components/BackButton/back-button";
// import Signature from "@/components/Signature/signature";
// import ExportPageFooter from "@/components/reports/export-page-footer";
// import { unitsReportTableFields } from "../data";
// import CustomLoader from "@/components/Loader/CustomLoader";
// import NetworkError from "@/components/Error/NetworkError";
// import useFetch from "@/hooks/useFetch";
// import { useState, useEffect, useRef } from "react";
// import {
//   UnitsReportType,
//   UnitListResponse,
//   transformUnitListData,
// } from "../types";

// import dayjs from "dayjs";
// import advancedFormat from "dayjs/plugin/advancedFormat";

// import { CompanySignaturesResponse } from "@/components/Signature/signature";
// import ServerError from "@/components/Error/ServerError";
// import { useGlobalStore } from "@/store/general-store";

// dayjs.extend(advancedFormat);

// const ExportUnits = () => {
//   const exportRef = useRef<HTMLDivElement>(null);
//   const [fullContent, setFullContent] = useState(false);
//   const [unitData, setUnitData] = useState<UnitsReportType>({
//     total_unit: 0,
//     monthly_unit: 0,
//     units: [],
//   });
//   const { data, loading, error, isNetworkError } =
//     useFetch<UnitListResponse>("/report/units");

//     const filteredUnits = useGlobalStore((s) => s.units);

//   const {
//     data: signatureData,
//     loading: sigLoading,
//     error: sigError,
//   } = useFetch<CompanySignaturesResponse>("/company-signatures");

//   useEffect(() => {
//     if (data) {
//       setUnitData(transformUnitListData(data));
//     }
//   }, [data]);

//   const { units } = unitData;

//   if (loading)
//     return (
//       <CustomLoader layout="page" pageTitle="Export Report" view="table" />
//     );
//   if (isNetworkError) return <NetworkError />;
//   if (error) return <ServerError error={error} />

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
//           fields={unitsReportTableFields}
//           data={filteredUnits || []}
//           tableHeadClassName="h-[45px]"
//         />
//         <Signature />
//         {/* {signatureData && signatureData?.signatures.length > 0 && <Signature /> } */}
//       </div>
//       <ExportPageFooter
//         printRef={exportRef}
//         setFullContent={setFullContent}
//         fullContent={fullContent}
//       />
//     </div>
//   );
// };

// export default ExportUnits;



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
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/reports/units/export/export"
    ),
  { ssr: false }
);

const PropertyManagerPropertiesReportVariantB = dynamic(
  () =>
    import(
     "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/reports/units/export/export"
    ),
  { ssr: false }
);

const PropertyManagerPropertiesReportVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/reports/units/export/export"
    ),
  { ssr: false }
);

/* PROPERTY DEVELOPER */
const PropertyDeveloperPropertiesReportVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/reports/units/export/export"
    ),
  { ssr: false }
);

const PropertyDeveloperPropertiesReportVariantB = dynamic(
  () =>
    import(
     "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/reports/units/export/export"
    ),
  { ssr: false }
);

const PropertyDeveloperPropertiesReportVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/reports/units/export/export"
    ),
  { ssr: false }
);

/* HOSPITALITY MANAGER */
const HospitalityManagerPropertiesReportVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/reports/units/export/export"
    ),
  { ssr: false }
);

const HospitalityManagerPropertiesReportVariantB = dynamic(
  () =>
    import(
     "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/reports/units/export/export"
    ),
  { ssr: false }
);

const HospitalityManagerPropertiesReportVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/reports/units/export/units"
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
