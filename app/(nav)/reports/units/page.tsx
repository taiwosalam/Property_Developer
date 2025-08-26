// "use client";
// import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
// import CustomTable from "@/components/Table/table";
// import FilterBar from "@/components/FIlterBar/FilterBar";
// import {
//   reportsUnitsFilterOptionsWithDropdown,
//   unitsReportTableFields,
// } from "./data";
// import {
//   transformUnitListData,
//   UnitListResponse,
//   Units,
//   UnitsReportType,
// } from "./types";
// import { useCallback, useEffect, useState } from "react";
// import useFetch from "@/hooks/useFetch";
// import CustomLoader from "@/components/Loader/CustomLoader";
// import NetworkError from "@/components/Error/NetworkError";
// import { BranchStaff } from "../../(messages-reviews)/messages/types";
// import { FilterResult, BranchFilter, PropertyFilter } from "../tenants/types";
// import { AxiosRequestConfig } from "axios";
// import { ReportsRequestParams } from "../tenants/data";
// import dayjs from "dayjs";
// import SearchError from "@/components/SearchNotFound/SearchNotFound";
// import { hasActiveFilters } from "../data/utils";
// import EmptyList from "@/components/EmptyList/Empty-List";
// import ServerError from "@/components/Error/ServerError";
// import { useGlobalStore } from "@/store/general-store";
// import { useRouter } from "next/navigation";
// import { debounce } from "lodash";

// const UnitsReport = () => {
//   const router = useRouter();
//   const [pageData, setPageData] = useState<UnitsReportType>({
//     total_unit: 0,
//     monthly_unit: 0,
//     units: [],
//   });
//   const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
//   const filteredUnits = useGlobalStore((s) => s.units);

//   const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
//     options: [],
//     menuOptions: {},
//     startDate: null,
//     endDate: null,
//   });
//   const [branches, setBranches] = useState<BranchFilter[]>([]);
//   const [branchAccountOfficers, setBranchAccountOfficers] = useState<
//     BranchStaff[]
//   >([]);
//   const [propertyList, setPropertyList] = useState<PropertyFilter[]>([]);
//   const { data: apiData } = useFetch<any>("branches");
//   const { data: staff } = useFetch<any>(`report/staffs`);
//   const { data: property } = useFetch<any>(`property/all`);

//   useEffect(() => {
//     if (apiData) setBranches(apiData.data);
//     if (staff) {
//       const filterStaff = staff.data.filter(
//         (staff: any) => staff.staff_role === "account officer"
//       );
//       setBranchAccountOfficers(filterStaff);
//     }
//     if (property) setPropertyList(property.data);
//   }, [apiData, staff, property]);

//   const unitStatus = ["occupied", "relocate", "vacant", "expired"];
//   const reportTenantFilterOption = [
//     {
//       label: "Account Manager",
//       value: [
//         ...new Map(
//           branchAccountOfficers.map((staff: any) => [
//             staff.user.name.toLowerCase(), // Use lowercase for comparison
//             {
//               label: staff.user.name.toLowerCase(), // Keep original case for display
//               value: staff.user.id.toString(),
//             },
//           ])
//         ).values(),
//       ],
//     },
//     {
//       label: "Branch",
//       value: [
//         ...new Map(
//           branches.map((branch) => [
//             branch.branch_name.toLowerCase(),
//             {
//               label: branch.branch_name.toLowerCase(),
//               value: branch.id.toString(),
//             },
//           ])
//         ).values(),
//       ],
//     },
//     {
//       label: "Property",
//       value: [
//         ...new Map(
//           propertyList.filter((u) => u.units.length > 0).map((property: any) => [
//             property.title.toLowerCase(), // Use lowercase for comparison
//             {
//               label: property.title.toLowerCase(), // Keep original case for display
//               value: property.id.toString(),
//             },
//           ])
//         ).values(),
//       ],
//     },
//     {
//       label: "Status",
//       value: unitStatus.map((status) => ({
//         label: status,
//         value: status,
//       })),
//     },
//   ];

//   const [config, setConfig] = useState<AxiosRequestConfig>({
//     params: { page: 1, search: "" } as ReportsRequestParams,
//   });

//   const handleSearch = (query: string) => {
//     setConfig({ params: { ...config.params, search: query } });
//   };

//   const handleSort = (order: "asc" | "desc") => {
//     setConfig({ params: { ...config.params, sort_order: order } });
//   };

//   const handleAppliedFilter = useCallback(
//     debounce((filters: FilterResult) => {
//       setAppliedFilters(filters);
//       const { menuOptions, startDate, endDate } = filters;
//       const accountOfficer = menuOptions["Account Manager"] || [];
//       const branch = menuOptions["Branch"] || [];
//       const property = menuOptions["Property"] || [];
//       const status = menuOptions["Status"] || [];

//       const queryParams: ReportsRequestParams = { page: 1, search: "" };
//       if (accountOfficer.length > 0)
//         queryParams.account_officer_id = accountOfficer.join(",");
//       if (branch.length > 0) queryParams.branch_id = branch.join(",");
//       if (property.length > 0) queryParams.property_id = property.join(",");
//       if (status.length > 0) queryParams.status = status.join(",");
//       if (startDate)
//         queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
//       if (endDate)
//         queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
//       setConfig({ params: queryParams });
//     }, 300),
//     []
//   );

//   const { data, loading, error, isNetworkError } = useFetch<UnitListResponse>(
//     "/report/units",
//     config
//   );

//   useEffect(() => {
//     if (!loading && data) {
//       const transformedData = transformUnitListData(data);
//       const newUnits = transformedData.units;
//       const currentUnits = useGlobalStore.getState().units;
//       if (JSON.stringify(currentUnits) !== JSON.stringify(newUnits)) {
//         setPageData(transformedData);
//         setGlobalStore("units", newUnits);
//       }
//     }
//   }, [data, loading, setGlobalStore]);

//   const handleExport = () => {
//     if (!data || loading) return;
//     setGlobalStore("units", pageData.units);
//     router.push("/reports/units/export");
//   };

//   if (loading)
//     return <CustomLoader layout="page" pageTitle="Units Report" view="table" />;
//   if (isNetworkError) return <NetworkError />;
//   if (error) return <ServerError error={error} />;

//   return (
//     <div className="space-y-9">
//       <div className="hidden md:flex gap-5 flex-wrap">
//         <ManagementStatistcsCard
//           title="Total Units"
//           newData={pageData.monthly_unit}
//           total={pageData.total_unit}
//           colorScheme={1}
//         />
//       </div>
//       <FilterBar
//         azFilter
//         exports
//         isDateTrue
//         pageTitle="Units"
//         aboutPageModalData={{
//           title: "Units",
//           description: "This page contains a list of Units on the platform.",
//         }}
//         searchInputPlaceholder="Search for Units"
//         handleFilterApply={handleAppliedFilter}
//         appliedFilters={appliedFilters}
//         onSort={handleSort}
//         handleSearch={handleSearch}
//         filterOptionsMenu={reportTenantFilterOption}
//         hasGridListToggle={false}
//         exportHref="/reports/units/export"
//         xlsxData={useGlobalStore.getState().units}
//         fileLabel={"Unit Reports"}
//       />
//       <section>
//         {pageData.units.length === 0 && !loading ? (
//           !!config.params.search.trim() || hasActiveFilters(appliedFilters) ? (
//             <SearchError />
//           ) : (
//             <EmptyList
//               noButton
//               title="No Unit Data Available Yet"
//               body={
//                 <p>
//                   There is currently no unit data available for export. Once
//                   unit records are added to the system, they will automatically
//                   appear here and be available for download or export.
//                   <br />
//                   <br />
//                   <p>
//                     This section will be updated in real-time as new unit
//                     profiles are created, allowing you to easily manage and
//                     export your data when needed.
//                   </p>
//                 </p>
//               }
//             />
//           )
//         ) : (
//           <CustomTable
//             fields={unitsReportTableFields}
//             data={pageData.units}
//             tableHeadClassName="h-[45px]"
//           />
//         )}
//       </section>
//     </div>
//   );
// };

// export default UnitsReport;

// "use client";
// import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
// import CustomTable from "@/components/Table/table";
// import FilterBar from "@/components/FIlterBar/FilterBar";
// import {
//   reportsPropertiessFilterOptions,
//   propertiesReportTablefields,
//   TransformedPropertyData,
//   PropertyApiResponse,
//   transformPropertyData,
// } from "./data";
// import { useEffect, useState, useCallback } from "react";
// import useFetch from "@/hooks/useFetch";
// import CustomLoader from "@/components/Loader/CustomLoader";
// import NetworkError from "@/components/Error/NetworkError";
// import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
// import { BranchStaff } from "../../(messages-reviews)/messages/types";
// import { AxiosRequestConfig } from "axios";
// import { ReportsRequestParams } from "../tenants/data";
// import dayjs from "dayjs";
// import SearchError from "@/components/SearchNotFound/SearchNotFound";
// import { hasActiveFilters } from "../data/utils";
// import EmptyList from "@/components/EmptyList/Empty-List";
// import ServerError from "@/components/Error/ServerError";
// import { useGlobalStore } from "@/store/general-store";
// import { useRouter } from "next/navigation";
// import { debounce } from "lodash";

// const PropertiesReport = () => {
//   const router = useRouter();
//   const [pageData, setPageData] = useState<TransformedPropertyData>({
//     total_properties: 0,
//     monthly_properties: 0,
//     properties: [],
//   });
//   const setPropertiesStore = useGlobalStore((s) => s.setGlobalInfoStore);

//   const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
//     options: [],
//     menuOptions: {},
//     startDate: null,
//     endDate: null,
//   });

//   const [branches, setBranches] = useState<BranchFilter[]>([]);
//   const [branchAccountOfficers, setBranchAccountOfficers] = useState<
//     BranchStaff[]
//   >([]);
//   const [propertyList, setPropertyList] = useState<PropertyFilter[]>([]);

//   const { data: apiData } = useFetch<any>("branches");
//   const { data: staff } = useFetch<any>(`report/staffs`);
//   const { data: property } = useFetch<any>(`property/all`);

//   useEffect(() => {
//     if (apiData) setBranches(apiData.data);
//     if (staff) {
//       const filterStaff = staff.data.filter(
//         (staff: any) => staff.staff_role === "account officer"
//       );
//       setBranchAccountOfficers(filterStaff);
//     }
//     if (property) setPropertyList(property.data);
//   }, [apiData, staff, property]);

//   // ...existing code...

//   const reportTenantFilterOption = [
//     {
//       label: "Account Manager",
//       value: [
//         ...new Map(
//           branchAccountOfficers.map((staff: any) => [
//             staff.user.name.toLowerCase(), // Use lowercase for comparison
//             {
//               label: staff.user.name, // Keep original case for display
//               value: staff.user.id.toString(),
//             },
//           ])
//         ).values(),
//       ],
//     },
//     {
//       label: "Branch",
//       value: [
//         ...new Map(
//           branches.map((branch) => [
//             branch.branch_name.toLowerCase(),
//             {
//               label: branch.branch_name,
//               value: branch.id.toString(),
//             },
//           ])
//         ).values(),
//       ],
//     },
//     {
//       label: "Property",
//       value: [
//         ...new Map(
//           propertyList.map((property: any) => [
//             property.title.toLowerCase(), // Use lowercase for comparison
//             {
//               label: property.title, // Keep original case for display
//               value: property.id.toString(),
//             },
//           ])
//         ).values(),
//       ],
//     },
//   ];

//   // ...existing code...

//   const [config, setConfig] = useState<AxiosRequestConfig>({
//     params: { page: 1, search: "" } as ReportsRequestParams,
//   });

//   const handleSearch = (query: string) => {
//     setConfig({ params: { ...config.params, search: query } });
//   };

//   const handleSort = (order: "asc" | "desc") => {
//     setConfig({ params: { ...config.params, sort_order: order } });
//   };

//   const handleAppliedFilter = useCallback(
//     debounce((filters: FilterResult) => {
//       setAppliedFilters(filters);
//       const { menuOptions, startDate, endDate } = filters;
//       const accountOfficer = menuOptions["Account Manager"] || [];
//       const branch = menuOptions["Branch"] || [];
//       const property = menuOptions["Property"] || [];

//       const queryParams: ReportsRequestParams = { page: 1, search: "" };
//       if (accountOfficer.length > 0)
//         queryParams.account_officer_id = accountOfficer.join(",");
//       if (branch.length > 0) queryParams.branch_id = branch.join(",");
//       if (property.length > 0) queryParams.property_id = property.join(",");
//       if (startDate)
//         queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
//       if (endDate)
//         queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
//       setConfig({ params: queryParams });
//     }, 300),
//     []
//   );

//   const { data, loading, error, isNetworkError } =
//     useFetch<PropertyApiResponse>("/report/properties", config);

//   useEffect(() => {
//     if (!loading && data) {
//       const transformedData = transformPropertyData(data);
//       const newProperties = transformedData.properties;
//       const currentProperties = useGlobalStore.getState().properties;
//       if (JSON.stringify(currentProperties) !== JSON.stringify(newProperties)) {
//         setPageData(transformedData);
//         setPropertiesStore("properties", newProperties);
//       }
//     }
//   }, [data, loading, setPropertiesStore]);

//   const { properties, monthly_properties, total_properties } = pageData;

//   if (loading)
//     return (
//       <CustomLoader layout="page" pageTitle="Properties Report" view="table" />
//     );
//   if (isNetworkError) return <NetworkError />;
//   if (error) return <ServerError error={error} />;

//   return (
//     <div className="space-y-9">
//       <div className="hidden md:flex gap-5 flex-wrap">
//         <ManagementStatistcsCard
//           title="Total"
//           newData={monthly_properties}
//           total={total_properties}
//           colorScheme={1}
//         />
//       </div>
//       <FilterBar
//         azFilter
//         exports
//         isDateTrue
//         pageTitle="Properties Report"
//         aboutPageModalData={{
//           title: "Properties Report",
//           description:
//             "This page contains a list of Properties Report on the platform.",
//         }}
//         searchInputPlaceholder="Search for Properties Report"
//         handleFilterApply={handleAppliedFilter}
//         appliedFilters={appliedFilters}
//         onSort={handleSort}
//         handleSearch={handleSearch}
//         filterOptionsMenu={reportTenantFilterOption}
//         hasGridListToggle={false}
//         exportHref="/reports/properties/export"
//         xlsxData={useGlobalStore.getState().properties}
//         fileLabel={"Properties Reports"}
//       />
//       <section>
//         {pageData.properties.length === 0 && !loading ? (
//           !!config.params.search || hasActiveFilters(appliedFilters) ? (
//             <SearchError />
//           ) : (
//             <EmptyList
//               noButton
//               title="No Property Data Available Yet"
//               body={
//                 <p>
//                   Currently, there is no property data available for export.
//                   Once data is added to the system, they will be displayed here
//                   and ready for download or export.
//                   <br />
//                   <br />
//                   <p>
//                     This section will automatically update to show all available
//                     property records as they are created or imported into the
//                     platform.
//                   </p>
//                 </p>
//               }
//             />
//           )
//         ) : (
//           <CustomTable
//             fields={propertiesReportTablefields}
//             data={pageData.properties || []}
//             tableHeadClassName="h-[45px]"
//           />
//         )}
//       </section>
//     </div>
//   );
// };

// export default PropertiesReport;

"use client";

import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import dynamic from "next/dynamic";

import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { Suspense } from "react";

/* PROPERTY MANAGER */
const PropertyManagerPropertiesReportVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/reports/units/units"
    ),
  { ssr: false }
);

const PropertyManagerPropertiesReportVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/reports/units/units"
    ),
  { ssr: false }
);

const PropertyManagerPropertiesReportVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/reports/units/units"
    ),
  { ssr: false }
);

/* PROPERTY DEVELOPER */
const PropertyDeveloperPropertiesReportVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/reports/units/units"
    ),
  { ssr: false }
);

const PropertyDeveloperPropertiesReportVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/reports/units/units"
    ),
  { ssr: false }
);

const PropertyDeveloperPropertiesReportVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/reports/units/units"
    ),
  { ssr: false }
);

/* HOSPITALITY MANAGER */
const HospitalityManagerPropertiesReportVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantA/reports/units/units"
    ),
  { ssr: false }
);

const HospitalityManagerPropertiesReportVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantB/reports/units/units"
    ),
  { ssr: false }
);

const HospitalityManagerPropertiesReportVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/HospitalityManager/VariantC/reports/units/units"
    ),
  { ssr: false }
);

const ClientReportPage = () => {
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

export default ClientReportPage;
