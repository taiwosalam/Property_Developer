// "use client";
// import { useEffect, useMemo, useRef, useState } from "react";
// import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
// import {
//   initialState,
//   RentAndUnitFilters,
//   RentAndUnitFiltersWithDropdown,
//   RentAndUnitState,
//   RentUnitFilterParams,
//   transformRentUnitApiResponse,
//   UnitApiResponse,
//   UnitFilterResponse,
//   UnitPageState,
// } from "./data";
// import StatusIndicator from "@/components/Management/status-indicator";
// import Pagination from "@/components/Pagination/pagination";
// import RentalPropertyCard from "@/components/Management/Rent And Unit/rental-property-card";
// import RentalPropertyListCard from "@/components/Management/Rent And Unit/rental-property-list";
// import FilterBar from "@/components/FIlterBar/FilterBar";
// import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
// import useView from "@/hooks/useView";
// import useSettingsStore from "@/store/settings";
// import useFetch from "@/hooks/useFetch";
// import { AxiosRequestConfig } from "axios";
// import { FilterResult } from "@/components/Management/Landlord/types";
// import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
// import dayjs from "dayjs";
// import CustomLoader from "@/components/Loader/CustomLoader";
// import NetworkError from "@/components/Error/NetworkError";
// import EmptyList from "@/components/EmptyList/Empty-List";
// import { ExclamationMark } from "@/public/icons/icons";
// import { AllBranchesResponse } from "@/components/Management/Properties/types";
// import SearchError from "@/components/SearchNotFound/SearchNotFound";
// import { useSearchParams } from "next/navigation";
// import useStaffRoles from "@/hooks/getStaffs";
// import { usePersonalInfoStore } from "@/store/personal-info-store";
// import { PropertyListResponse } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/type";
// import ServerError from "@/components/Error/ServerError";
// import CardsLoading from "@/components/Loader/CardsLoading";

// const RentAndUnit = () => {
//   const view = useView();
//   const searchParams = useSearchParams();
//   const { branch } = usePersonalInfoStore();
//   const BRANCH_ID = branch?.branch_id || 0;
//   const { selectedOptions, setSelectedOption } = useSettingsStore();
//   const {
//     getManagers,
//     getStaffs,
//     getAccountOfficers,
//     loading: loadingStaffs,
//     error: staffsError,
//   } = useStaffRoles();
//   const accountOfficers = getAccountOfficers();

//   // Initialize appliedFilters with is_active from URL
//   const initialFilters: FilterResult = {
//     options: [],
//     menuOptions: searchParams.get("is_active")
//       ? { Status: [searchParams.get("is_active")!] }
//       : {},
//     startDate: null,
//     endDate: null,
//   };

//   const [pageData, setPageData] = useState<UnitPageState>(initialState);

//   const [selectedView, setSelectedView] = useState<string | null>(
//     selectedOptions.view
//   );
//   const [state, setState] = useState<RentAndUnitState>(() => {
//     const savedPage = sessionStorage.getItem("rent_and_unit_page");
//     return {
//       gridView: view === "grid",
//       total_pages: 1,
//       current_page: savedPage ? parseInt(savedPage, 10) : 1,
//       last_page: 1,
//     };
//   });

//   const { gridView, total_pages, current_page, last_page } = state;

//   // Save page number to sessionStorage whenever it changes
//   useEffect(() => {
//     sessionStorage.setItem("rent_and_unit_page", current_page.toString());
//   }, [current_page]);

//   useEffect(() => {
//     const tenantIdFromUrl = searchParams.get("tenant_id");
//     if (tenantIdFromUrl && tenantIdFromUrl.trim() !== "") {
//       localStorage.setItem("selectedTenantId", tenantIdFromUrl);
//     } else {
//       localStorage.removeItem("selectedTenantId");
//     }
//   }, []);

//   const [appliedFilters, setAppliedFilters] =
//     useState<FilterResult>(initialFilters);
//   const isInitialMount = useRef(true);

//   const isFilterApplied = () => {
//     const { options, menuOptions, startDate, endDate } = appliedFilters;
//     return (
//       options.length > 0 ||
//       Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
//       startDate !== null ||
//       endDate !== null
//     );
//   };

//   const handleFilterApply = (filters: FilterResult) => {
//     setAppliedFilters((prev) => ({
//       ...filters,
//       menuOptions: {
//         ...prev.menuOptions, // Preserve existing filters like Status from URL
//         ...filters.menuOptions,
//       },
//     }));
//     // setPage(1);
//     setState((prev) => ({
//       ...prev,
//       current_page: 1,
//       unit: [],
//     }));
//     sessionStorage.setItem("rent_and_unit_page", "1");
//   };

//   const { menuOptions, startDate, endDate } = appliedFilters;
//   const statesArray = menuOptions["State"] || [];
//   const agent = menuOptions["Landlord Type"]?.[0];
//   const branchIdsArray = menuOptions["Branch"] || [];
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState<"asc" | "desc" | "">("");

//   const endpoint = `/unit/list?branch_id[]=${BRANCH_ID}`;
//   const config: AxiosRequestConfig = useMemo(() => {
//     const params: RentUnitFilterParams = {
//       page: current_page,
//       date_from: appliedFilters.startDate
//         ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
//         : undefined,
//       date_to: appliedFilters.endDate
//         ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
//         : undefined,
//       search: search || undefined,
//       branch_id: appliedFilters.menuOptions["Branch"]?.length
//         ? appliedFilters.menuOptions["Branch"]
//         : undefined,
//       state: appliedFilters.menuOptions["State"]?.length
//         ? appliedFilters.menuOptions["State"]
//         : undefined,
//       property_type: appliedFilters.menuOptions["Property Type"]?.[0] as
//         | "rental"
//         | "facility"
//         | undefined,
//       // appliedFilters.menuOptions["Property Type"]?.[0] || undefined,
//       is_active: appliedFilters.menuOptions["Status"]?.[0] || undefined,
//       staff_id: appliedFilters.menuOptions["Account Officer"]?.length
//         ? appliedFilters.menuOptions["Account Officer"]
//         : undefined,
//       sort_by: sort || undefined,
//     };
//     // Clean undefined params
//     const cleanedParams = Object.fromEntries(
//       Object.entries(params).filter(([_, v]) => v !== undefined)
//     );
//     return { params: cleanedParams };
//   }, [appliedFilters, search, sort, current_page]);

//   // Added a ref to the top of the content section
//   const contentTopRef = useRef<HTMLDivElement>(null);
//   const handlePageChange = (page: number) => {
//     // setPage(page);
//     setState((prev) => ({
//       ...prev,
//       current_page: page,
//       // unit: view === "grid" ? [] : prev.unit,
//     }));
//     setPageData((prev) => ({
//       ...prev,
//       unit: view === "grid" ? [] : prev.unit,
//     }));
//     // Scroll to the top where cards start
//     if (contentTopRef.current) {
//       contentTopRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const handleSort = (order: "asc" | "desc") => {
//     setSort(order);
//     setState((prev) => ({
//       ...prev,
//       current_page: 1,
//       unit: [],
//     }));
//     setPageData((prev) => ({
//       ...prev,
//       unit: [],
//     }));
//     sessionStorage.setItem("rent_and_unit_page", "1");
//   };

//   const handleSearch = (query: string) => {
//     setSearch(query);
//     setState((prev) => ({
//       ...prev,
//       current_page: 1,
//       unit: [],
//     }));
//     setPageData((prev) => ({
//       ...prev,
//       unit: [],
//     }));
//     sessionStorage.setItem("rent_and_unit_page", "1");
//   };

//   // Remove redundant useEffect for is_active
//   // Moved to initialFilters
//   useEffect(() => {
//     const isActiveFromUrl = searchParams.get("is_active");
//     if (isActiveFromUrl && !appliedFilters.menuOptions["Status"]?.length) {
//       setAppliedFilters((prev) => ({
//         ...prev,
//         menuOptions: {
//           ...prev.menuOptions,
//           Status: [isActiveFromUrl],
//         },
//       }));
//     }
//     isInitialMount.current = false; // Mark initial mount complete
//   }, [searchParams]);

//   const {
//     data: propertyData,
//     error: propertyError,
//     loading: propertyLoading,
//   } = useFetch<PropertyListResponse>("/property/all");

//   const propertyOptions =
//     propertyData?.data.map((p) => ({
//       value: `${p.id}`,
//       label: p.title,
//     })) || [];

//   const {
//     data: apiData,
//     loading,
//     silentLoading,
//     isNetworkError,
//     error,
//     refetch,
//   } = useFetch<UnitApiResponse | UnitFilterResponse>(endpoint, config);

//   useEffect(() => {
//     if (apiData) {
//       setPageData((x) => ({ ...x, ...transformRentUnitApiResponse(apiData) }));
//       setState((prevState) => ({
//         ...prevState,
//         current_page: apiData.data.pagination?.current_page,
//         last_page: apiData.data.pagination?.total_pages,
//         // total_pages: apiData.data.pagination.
//       }));
//     }
//   }, [apiData]);
//   // Listen for the refetch event
//   useRefetchOnEvent("refetchRentUnit", () => refetch({ silent: true }));

//   useEffect(() => {
//     setState((prevState) => ({
//       ...prevState,
//       gridView: selectedView === "grid",
//     }));
//   }, [selectedView]);

//   const setGridView = () => {
//     setSelectedOption("view", "grid");
//     setSelectedView("grid");
//   };

//   const setListView = () => {
//     setSelectedOption("view", "list");
//     setSelectedView("list");
//   };

//   const accountOfficersOptions =
//     accountOfficers?.map((o) => ({
//       label: o.name,
//       value: `${o.id}`,
//     })) || [];

//   if (loading)
//     return (
//       <CustomLoader
//         layout="page"
//         statsCardCount={3}
//         pageTitle="Rent & Management"
//       />
//     );

//   if (isNetworkError) return <NetworkError />;
//   if (error) return <ServerError error={error} />;

//   return (
//     <div className="space-y-9">
//       <div className="hidden md:flex gap-5 flex-wrap">
//         <ManagementStatistcsCard
//           title="Total Units"
//           newData={pageData?.month_unit}
//           total={pageData?.total_unit}
//           className="w-[240px]"
//           colorScheme={1}
//         />
//         <ManagementStatistcsCard
//           title="Occupied Units"
//           newData={pageData?.month_occupied}
//           total={pageData?.total_occupied}
//           className="w-[240px]"
//           colorScheme={2}
//         />
//         <ManagementStatistcsCard
//           title="Vacannt Units"
//           newData={pageData?.month_vacant}
//           total={pageData?.total_vacant}
//           className="w-[240px]"
//           colorScheme={3}
//         />
//         <ManagementStatistcsCard
//           title="Expired Units"
//           newData={pageData?.month_expired}
//           total={pageData?.total_expired}
//           className="w-[240px]"
//           colorScheme={4}
//         />
//       </div>
//       <FilterBar
//         azFilter
//         gridView={view === "grid" || gridView}
//         setGridView={setGridView}
//         setListView={setListView}
//         pageTitle="Rent & Management"
//         aboutPageModalData={{
//           title: "Rent & Management",
//           description:
//             "This page contains a list of Rent & Management on the platform.",
//         }}
//         searchInputPlaceholder="Search for Rent and Management"
//         handleFilterApply={handleFilterApply}
//         handleSearch={handleSearch}
//         onSort={handleSort}
//         appliedFilters={appliedFilters}
//         isDateTrue
//         filterOptionsMenu={[
//           ...RentAndUnitFiltersWithDropdown,
//           ...(propertyOptions.length > 0
//             ? [
//                 {
//                   label: "Properties",
//                   value: propertyOptions,
//                 },
//               ]
//             : []),
//           ...(accountOfficersOptions.length > 0
//             ? [
//                 {
//                   label: "Account Officer",
//                   value: accountOfficersOptions,
//                 },
//               ]
//             : []),
//         ]}
//       />
//       <section className="capitalize">
//         {pageData?.unit.length === 0 && !silentLoading ? (
//           isFilterApplied() || search ? (
//             <SearchError />
//           ) : (
//             <EmptyList
//               buttonText="Create New Unit"
//               buttonLink="/management/rent-unit/create"
//               title="No Unit Found"
//               body={
//                 <p>
//                   You can create a Unit by clicking on the &quot;Add
//                   Property&quot; button. You can create two types of properties:
//                   rental and facility properties. Rental properties are mainly
//                   tailored for managing properties for rent, including landlord
//                   and tenant management processes. Facility properties are
//                   designed for managing occupants in gated estates, overseeing
//                   their due payments, visitor access, and vehicle records.{" "}
//                   <br />
//                   <br />
//                   Once a property is added to this page, this guide will
//                   disappear. To learn more about this page in the future, you
//                   can click on this icon{" "}
//                   <span className="inline-block text-brand-10 align-text-top">
//                     <ExclamationMark />
//                   </span>{" "}
//                   at the top left of the dashboard page.
//                   <br />
//                   <br />
//                   Property creation involves several segments: property
//                   settings, details, what to showcase on the dashboard or user
//                   app, unit creation, permissions, and assigning staff.
//                 </p>
//               }
//             />
//           )
//         ) : (
//           <>
//             <section className="capitalize space-y-4 px-4 w-full">
//               <div className="w-full flex items-center justify-end">
//                 <div className="flex gap-4 flex-wrap">
//                   <StatusIndicator statusTitle="vacant/pending" />
//                   <StatusIndicator statusTitle="occupied" />
//                   <StatusIndicator statusTitle="active" />
//                   <StatusIndicator statusTitle="expired" />
//                   <StatusIndicator statusTitle="relocate/move out" />
//                 </div>
//               </div>
//               {view === "grid" || gridView ? (
//                 <AutoResizingGrid minWidth={315}>
//                   {silentLoading ? (
//                     <CardsLoading />
//                   ) : (
//                     pageData?.unit?.map((unit, index) => (
//                       <RentalPropertyCard key={index} {...unit} />
//                     ))
//                   )}
//                 </AutoResizingGrid>
//               ) : (
//                 <div className="space-y-4">
//                   {silentLoading ? (
//                     <CardsLoading />
//                   ) : (
//                     pageData?.unit.map((unit, index) => (
//                       <RentalPropertyListCard key={index} {...unit} />
//                     ))
//                   )}
//                 </div>
//               )}
//             </section>
//             <Pagination
//               totalPages={last_page}
//               currentPage={current_page}
//               onPageChange={handlePageChange}
//             />
//           </>
//         )}
//       </section>
//     </div>
//   );
// };

// export default RentAndUnit;

"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import {
  initialState,
  RentAndUnitFilters,
  RentAndUnitFiltersWithDropdown,
  RentAndUnitState,
  RentUnitFilterParams,
  transformRentUnitApiResponse,
  UnitApiResponse,
  UnitFilterResponse,
  UnitPageState,
} from "./data";
import StatusIndicator from "@/components/Management/status-indicator";
import Pagination from "@/components/Pagination/pagination";
import RentalPropertyCard from "@/components/Management/Rent And Unit/rental-property-card";
import RentalPropertyListCard from "@/components/Management/Rent And Unit/rental-property-list";
import FilterBar from "@/components/FIlterBar/FilterBar";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import useView from "@/hooks/useView";
import useSettingsStore from "@/store/settings";
import useFetch from "@/hooks/useFetch";
import { AxiosRequestConfig } from "axios";
import { FilterResult } from "@/components/Management/Landlord/types";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { ExclamationMark } from "@/public/icons/icons";
import { AllBranchesResponse } from "@/components/Management/Properties/types";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { useSearchParams } from "next/navigation";
import useStaffRoles from "@/hooks/getStaffs";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { PropertyListResponse } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/type";
import ServerError from "@/components/Error/ServerError";
import CardsLoading from "@/components/Loader/CardsLoading";

const RentAndUnit = () => {
  const view = useView();
  const searchParams = useSearchParams();
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const { selectedOptions, setSelectedOption } = useSettingsStore();
  const {
    getManagers,
    getStaffs,
    getAccountOfficers,
    loading: loadingStaffs,
    error: staffsError,
  } = useStaffRoles();
  const accountOfficers = getAccountOfficers();

  // Initialize appliedFilters with is_active from URL
  const initialFilters: FilterResult = {
    options: [],
    menuOptions: searchParams.get("is_active")
      ? { Status: [searchParams.get("is_active")!] }
      : {},
    startDate: null,
    endDate: null,
  };

  const [pageData, setPageData] = useState<UnitPageState>(initialState);

  const [selectedView, setSelectedView] = useState<string | null>(
    selectedOptions.view
  );
  const [state, setState] = useState<RentAndUnitState>(() => {
    const savedPage = sessionStorage.getItem("rent_and_unit_page");
    return {
      gridView: view === "grid",
      total_pages: 1,
      current_page: savedPage ? parseInt(savedPage, 10) : 1,
      last_page: 1,
    };
  });

  const { gridView, total_pages, current_page, last_page } = state;

  // Save page number to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("rent_and_unit_page", current_page.toString());
  }, [current_page]);

  useEffect(() => {
    const tenantIdFromUrl = searchParams.get("tenant_id");
    if (tenantIdFromUrl && tenantIdFromUrl.trim() !== "") {
      localStorage.setItem("selectedTenantId", tenantIdFromUrl);
    } else {
      localStorage.removeItem("selectedTenantId");
    }
  }, []);

  const [appliedFilters, setAppliedFilters] =
    useState<FilterResult>(initialFilters);
  const isInitialMount = useRef(true);

  const isFilterApplied = () => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters((prev) => ({
      ...filters,
      menuOptions: {
        ...prev.menuOptions, // Preserve existing filters like Status from URL
        ...filters.menuOptions,
      },
    }));
    setState((prev) => ({
      ...prev,
      current_page: 1,
      unit: [],
    }));
    sessionStorage.setItem("rent_and_unit_page", "1");
  };

  const { menuOptions, startDate, endDate } = appliedFilters;
  const statesArray = menuOptions["State"] || [];
  const agent = menuOptions["Landlord Type"]?.[0];
  const branchIdsArray = menuOptions["Branch"] || [];
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");

  // Conditionally set the URL only if BRANCH_ID is valid
  const fetchUrl =
    BRANCH_ID && BRANCH_ID !== 0 ? `/unit/list?branch_id[]=${BRANCH_ID}` : null;

  const config: AxiosRequestConfig = useMemo(() => {
    const params: RentUnitFilterParams = {
      page: current_page,
      date_from: appliedFilters.startDate
        ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
        : undefined,
      date_to: appliedFilters.endDate
        ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
        : undefined,
      search: search || undefined,
      branch_id: appliedFilters.menuOptions["Branch"]?.length
        ? appliedFilters.menuOptions["Branch"]
        : undefined,
      state: appliedFilters.menuOptions["State"]?.length
        ? appliedFilters.menuOptions["State"]
        : undefined,
      property_type: appliedFilters.menuOptions["Property Type"]?.[0] as
        | "rental"
        | "facility"
        | undefined,
      is_active: appliedFilters.menuOptions["Status"]?.[0] || undefined,
      staff_id: appliedFilters.menuOptions["Account Officer"]?.length
        ? appliedFilters.menuOptions["Account Officer"]
        : undefined,
      sort_by: sort || undefined,
    };
    // Clean undefined params
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );
    return { params: cleanedParams };
  }, [appliedFilters, search, sort, current_page]);

  // Added a ref to the top of the content section
  const contentTopRef = useRef<HTMLDivElement>(null);
  const handlePageChange = (page: number) => {
    setState((prev) => ({
      ...prev,
      current_page: page,
    }));
    setPageData((prev) => ({
      ...prev,
      unit: view === "grid" ? [] : prev.unit,
    }));
    // Scroll/top where cards start
    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSort = (order: "asc" | "desc") => {
    setSort(order);
    setState((prev) => ({
      ...prev,
      current_page: 1,
      unit: [],
    }));
    setPageData((prev) => ({
      ...prev,
      unit: [],
    }));
    sessionStorage.setItem("rent_and_unit_page", "1");
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    setState((prev) => ({
      ...prev,
      current_page: 1,
      unit: [],
    }));
    setPageData((prev) => ({
      ...prev,
      unit: [],
    }));
    sessionStorage.setItem("rent_and_unit_page", "1");
  };

  // Remove redundant useEffect for is_active
  // Moved to initialFilters
  useEffect(() => {
    const isActiveFromUrl = searchParams.get("is_active");
    if (isActiveFromUrl && !appliedFilters.menuOptions["Status"]?.length) {
      setAppliedFilters((prev) => ({
        ...prev,
        menuOptions: {
          ...prev.menuOptions,
          Status: [isActiveFromUrl],
        },
      }));
    }
    isInitialMount.current = false; // Mark initial mount complete
  }, [searchParams]);

  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/all");

  const propertyOptions =
    propertyData?.data.map((p) => ({
      value: `${p.id}`,
      label: p.title,
    })) || [];

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<UnitApiResponse | UnitFilterResponse>(fetchUrl, config);

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({ ...x, ...transformRentUnitApiResponse(apiData) }));
      setState((prevState) => ({
        ...prevState,
        current_page: apiData.data.pagination?.current_page,
        last_page: apiData.data.pagination?.total_pages,
      }));
    }
  }, [apiData]);
  // Listen for the refetch event
  useRefetchOnEvent("refetchRentUnit", () => refetch({ silent: true }));

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      gridView: selectedView === "grid",
    }));
  }, [selectedView]);

  const setGridView = () => {
    setSelectedOption("view", "grid");
    setSelectedView("grid");
  };

  const setListView = () => {
    setSelectedOption("view", "list");
    setSelectedView("list");
  };

  const accountOfficersOptions =
    accountOfficers?.map((o) => ({
      label: o.name,
      value: `${o.id}`,
    })) || [];

  // Render an error message if BRANCH_ID is invalid
  if (!BRANCH_ID || BRANCH_ID === 0) {
    return (
      <div className="text-base text-red-500 font-medium">
        Invalid branch ID. Please select a valid branch.
      </div>
    );
  }

  if (loading)
    return (
      <CustomLoader
        layout="page"
        statsCardCount={3}
        pageTitle="Rent & Management"
      />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Units"
          newData={pageData?.month_unit}
          total={pageData?.total_unit}
          className="w-[240px]"
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Occupied Units"
          newData={pageData?.month_occupied}
          total={pageData?.total_occupied}
          className="w-[240px]"
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Vacant Units"
          newData={pageData?.month_vacant}
          total={pageData?.total_vacant}
          className="w-[240px]"
          colorScheme={3}
        />
        <ManagementStatistcsCard
          title="Expired Units"
          newData={pageData?.month_expired}
          total={pageData?.total_expired}
          className="w-[240px]"
          colorScheme={4}
        />
      </div>
      <FilterBar
        azFilter
        gridView={view === "grid" || gridView}
        setGridView={setGridView}
        setListView={setListView}
        pageTitle="Rent & Management"
        aboutPageModalData={{
          title: "Rent & Management",
          description:
            "This page contains a list of Rent & Management on the platform.",
        }}
        searchInputPlaceholder="Search for Rent and Management"
        handleFilterApply={handleFilterApply}
        handleSearch={handleSearch}
        onSort={handleSort}
        appliedFilters={appliedFilters}
        isDateTrue
        filterOptionsMenu={[
          ...RentAndUnitFiltersWithDropdown,
          ...(propertyOptions.length > 0
            ? [
                {
                  label: "Properties",
                  value: propertyOptions,
                },
              ]
            : []),
          ...(accountOfficersOptions.length > 0
            ? [
                {
                  label: "Account Officer",
                  value: accountOfficersOptions,
                },
              ]
            : []),
        ]}
      />
      <section className="capitalize">
        {pageData?.unit.length === 0 && !silentLoading ? (
          isFilterApplied() || search ? (
            <SearchError />
          ) : (
            <EmptyList
              buttonText="Create New Unit"
              buttonLink="/management/rent-unit/create"
              title="No Unit Found"
              body={
                <p>
                  You can create a Unit by clicking on the &apos;Add Property&apos;
                  button. You can create two types of properties: rental and
                  facility properties. Rental properties are mainly tailored for
                  managing properties for rent, including landlord and tenant
                  management processes. Facility properties are designed for
                  managing occupants in gated estates, overseeing their due
                  payments, visitor access, and vehicle records. <br />
                  <br />
                  Once a property is added to this page, this guide will
                  disappear. To learn more about this page in the future, you
                  can click on this icon{" "}
                  <span className="inline-block text-brand-10 align-text-top">
                    <ExclamationMark />
                  </span>{" "}
                  at the top left of the dashboard page.
                  <br />
                  <br />
                  Property creation involves several segments: property
                  settings, details, what to showcase on the dashboard or user
                  app, unit creation, permissions, and assigning staff.
                </p>
              }
            />
          )
        ) : (
          <>
            <section className="capitalize space-y-4 px-4 w-full">
              <div className="w-full flex items-center justify-end">
                <div className="flex gap-4 flex-wrap">
                  <StatusIndicator statusTitle="vacant/pending" />
                  <StatusIndicator statusTitle="occupied" />
                  <StatusIndicator statusTitle="active" />
                  <StatusIndicator statusTitle="expired" />
                  <StatusIndicator statusTitle="relocate/move out" />
                </div>
              </div>
              {view === "grid" || gridView ? (
                <AutoResizingGrid minWidth={315}>
                  {silentLoading ? (
                    <CardsLoading />
                  ) : (
                    pageData?.unit?.map((unit, index) => (
                      <RentalPropertyCard page="manager" key={index} {...unit} />
                    ))
                  )}
                </AutoResizingGrid>
              ) : (
                <div className="space-y-4">
                  {silentLoading ? (
                    <CardsLoading />
                  ) : (
                    pageData?.unit.map((unit, index) => (
                      <RentalPropertyListCard page="manager" key={index} {...unit} />
                    ))
                  )}
                </div>
              )}
            </section>
            <Pagination
              totalPages={last_page}
              currentPage={current_page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default RentAndUnit;
