// "use client";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import PropertyCard from "@/components/Management/Properties/property-card";
// import Pagination from "@/components/Pagination/pagination";
// import PropertyListItem from "@/components/Management/Properties/property-list-item";
// import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
// import FilterBar from "@/components/FIlterBar/FilterBar";
// import useView from "@/hooks/useView";
// import BackButton from "@/components/BackButton/back-button";
// import { ExclamationMark, LocationIcon } from "@/public/icons/icons";
// import useBranchStore from "@/store/branch-store";
// import LandlordCard from "@/components/Management/landlord-and-tenant-card";
// // import {
// //   initialState,
// //   PropertiesApiResponse,
// //   PropertiesFilterParams,
// //   PropertiesPageState,
// //   PropertyFilterResponse,
// //   transformPropertiesApiResponse,
// // } from "./data";
// import { FilterResult } from "@/components/Management/Landlord/types";
// import { AxiosRequestConfig } from "axios";
// import dayjs from "dayjs";
// import CustomLoader from "@/components/Loader/CustomLoader";
// import NetworkError from "@/components/Error/NetworkError";
// import useFetch from "@/hooks/useFetch";
// import EmptyList from "@/components/EmptyList/Empty-List";
// import AddPropertyModal from "@/components/Management/Properties/add-property-modal";
// import CardsLoading from "@/components/Loader/CardsLoading";
// import TableLoading from "@/components/Loader/TableLoading";
// import { useParams } from "next/navigation";
// import CustomTable from "@/components/Table/table";
// import { landlordTableFields } from "@/app/(nav)/management/landlord/data";
// import Link from "next/link";
// import { landlordMockData } from "./data";

// const StaffTenants = () => {
//   const storedView = useView();
//   const { branchId, staffId } = useParams();
//   const [view, setView] = useState<string | null>(storedView);
//   const { branch } = useBranchStore();
//   //   useEffect(() => {
//   //     setView(storedView);
//   //   }, [storedView]);

//   // //   const [pageData, setPageData] = useState<PropertiesPageState>(initialState);
//   //   const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
//   //     options: [],
//   //     menuOptions: {},
//   //     startDate: null,
//   //     endDate: null,
//   //   });

//   //   const {
//   //     total_pages,
//   //     current_page,
//   //     total_properties,
//   //     new_properties_count,
//   //     total_rental_properties,
//   //     new_rental_properties_count,
//   //     total_facility_properties,
//   //     new_facility_properties_count,
//   //     properties,
//   //   } = pageData;

//   //   const isFilterApplied = useCallback(() => {
//   //     const { options, menuOptions, startDate, endDate } = appliedFilters;
//   //     return (
//   //       options.length > 0 ||
//   //       Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
//   //       startDate !== null ||
//   //       endDate !== null
//   //     );
//   //   }, [appliedFilters]);

//   //   const [page, setPage] = useState(1);
//   //   const [search, setSearch] = useState("");
//   //   const [sort, setSort] = useState<"asc" | "desc" | "">("");

//   //   // /branch/8/properties
//   //   const endpoint =
//   //     isFilterApplied() || search || sort
//   //       ? "/property/filter"
//   //       : `/branch/${branch.branch_id}/properties`;
//   //   const config: AxiosRequestConfig = useMemo(() => {
//   //     return {
//   //       params: {
//   //         page,
//   //         date_from: appliedFilters.startDate
//   //           ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
//   //           : undefined,
//   //         date_to: appliedFilters.endDate
//   //           ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
//   //           : undefined,
//   //         search: search,
//   //         branch_id: appliedFilters.menuOptions["Branch"] || [],
//   //         state: appliedFilters.menuOptions["State"] || [],
//   //         ...(appliedFilters.menuOptions["Property Type"]?.[0] &&
//   //         appliedFilters.menuOptions["Property Type"]?.[0] !== "all"
//   //           ? { property_type: appliedFilters.menuOptions["Property Type"]?.[0] }
//   //           : {}),
//   //         sort_by: sort,
//   //       } as PropertiesFilterParams,
//   //     };
//   //   }, [appliedFilters, search, sort, page]);

//   //   const handlePageChange = (page: number) => {
//   //     setPage(page);
//   //   };

//   //   const handleSort = (order: "asc" | "desc") => {
//   //     setSort(order);
//   //   };

//   //   const handleSearch = (query: string) => {
//   //     setSearch(query);
//   //   };

//   //   const handleFilterApply = (filters: FilterResult) => {
//   //     setAppliedFilters(filters);
//   //     setPage(1);
//   //   };

//   //   const {
//   //     data: apiData,
//   //     loading,
//   //     silentLoading,
//   //     isNetworkError,
//   //     error,
//   //   } = useFetch<PropertiesApiResponse | PropertyFilterResponse>(
//   //     endpoint,
//   //     config
//   //   );

//   //   useEffect(() => {
//   //     if (apiData) {
//   //       setPageData((x) => ({
//   //         ...x,
//   //         ...transformPropertiesApiResponse(apiData),
//   //       }));
//   //     }
//   //   }, [apiData]);
//   //   // console.log("Data gotten", pageData)

//   //   if (loading)
//   //     return (
//   //       <CustomLoader layout="page" pageTitle="Properties" statsCardCount={3} />
//   //     );

//   //   if (isNetworkError) return <NetworkError />;

//   //   if (error)
//   //     return <p className="text-base text-red-500 font-medium">{error}</p>;

//   return (
//     <div className="space-y-9">
//       <div className="w-full gap-2 flex items-center justify-between flex-wrap">
//         <BackButton reducePaddingTop as="div" className="items-start">
//           <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
//             Prince Taiwo Salam
//           </h1>
//           <div className="text-text-disabled flex items-center space-x-1">
//             <p className="text-sm font-medium">Branch Manager</p>
//           </div>
//         </BackButton>
//       </div>
//       <FilterBar
//         azFilter
//         gridView={view === "grid"}
//         setGridView={() => setView("grid")}
//         setListView={() => setView("list")}
//         pageTitle="Properties"
//         aboutPageModalData={{
//           title: "Properties",
//           description:
//             "This page contains a list of properties on the platform.",
//         }}
//         searchInputPlaceholder="Search for Properties"
//         handleFilterApply={() => {}}
//         isDateTrue
//         noExclamationMark
//       />

//       {/* Card / List View */}
//       <section>
//         {view === "grid" ? (
//           <AutoResizingGrid minWidth={284} gap={16}>
//             {landlordMockData.map((l) => (
//               <Link
//                 // href={`/management/landlord/${l.id}/manage`}
//                 href={{
//                   pathname: `/management/landlord/${l.id}/manage`,
//                   query: { user_tag: l.user_tag },
//                 }}
//                 key={l.id}
//               >
//                 <LandlordCard
//                   picture_url={l.picture_url || l.avatar}
//                   name={`${l.first_name} ${l.last_name}`}
//                   user_tag={l.user_tag}
//                   badge_color="red"
//                   email={l.email}
//                   phone_number={l.phone_number}
//                 />
//               </Link>
//             ))}
//           </AutoResizingGrid>
//         ) : (
//           <CustomTable
//             displayTableHead={false}
//             fields={landlordTableFields}
//             data={[]}
//             tableBodyCellSx={{ color: "#3F4247" }}
//           />
//         )}
//         <Pagination totalPages={10} currentPage={1} onPageChange={() => {}} />
//       </section>
//     </div>
//   );
// };

// export default StaffTenants;

"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Form/Button/button";
import TenantCard from "@/components/Management/landlord-and-tenant-card";
import BackButton from "@/components/BackButton/back-button";
import CustomTable from "@/components/Table/table";
import Pagination from "@/components/Pagination/pagination";
import UserTag from "@/components/Tags/user-tag";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import AddTenantModal from "@/components/Management/Tenants/add-tenant-modal";
import EmptyList from "@/components/EmptyList/Empty-List";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomLoader from "@/components/Loader/CustomLoader";
import useView from "@/hooks/useView";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import TableLoading from "@/components/Loader/TableLoading";
import CardsLoading from "@/components/Loader/CardsLoading";
import { useParams } from "next/navigation";
import { NoteBlinkingIcon } from "@/public/icons/dashboard-cards/icons";
import ServerError from "@/components/Error/ServerError";
import Link from "next/link";
import { tenantTableFields } from "@/app/(nav)/management/tenants/data";
import { StaffTenantPageData } from "./types";
import { transformStaffTenantsApiResponse } from "./data";

const StaffTenants = () => {
  const storedView = useView();
  const { staffId } = useParams();
  const [view, setView] = useState<string | null>(storedView);
  const [pageData, setPageData] = useState<StaffTenantPageData>({
    pagination: {
      current_page: 1,
      total_page: 1,
    },
    staff: {
      name: "",
      role: "",
    },
    tenants: [],
  });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [silentLoading, setSilentLoading] = useState(false);
  const contentTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  const config = useMemo(
    () => ({
      params: { page, search },
    }),
    [page, search]
  );

  const {
    data: apiData,
    loading,
    isNetworkError,
    error,
  } = useFetch<any>(`/staff/${staffId}`, config);

  // Infinite scroll observer
  const observer = useRef<IntersectionObserver | null>(null);
  const { tenants, pagination, staff } = pageData;
  const current_page = pagination.current_page;
  const total_pages = pagination.total_page;

  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          current_page < total_pages &&
          !silentLoading
        ) {
          setSilentLoading(true);
          setPage((p) => p + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [current_page, total_pages, silentLoading]
  );

  useEffect(() => {
    if (apiData) {
      setPageData((prevData) => {
        const newData = transformStaffTenantsApiResponse(apiData);
        const updatedTenants =
          view === "grid" || newData.pagination.current_page === 1
            ? newData.tenants
            : [...prevData.tenants, ...newData.tenants];
        setSilentLoading(false);
        return { ...newData, tenants: updatedTenants };
      });
    }
  }, [apiData, view]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSilentLoading(false);
    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const transformedTenants = tenants.map((t, index) => ({
    ...t,
    full_name: (
      <p className="flex items-center whitespace-nowrap">
        <span>{t.name}</span>
        <div className="flex gap-2 items-center">
          {t.badge_color && <BadgeIcon color={t.badge_color} />}
          {t.note && <NoteBlinkingIcon size={20} className="blink-color" />}
        </div>
      </p>
    ),
    user_tag: (
      <>
        <div className="flex gap-2 mb-2 items-center">
          <UserTag type={t.user_tag} />
        </div>
      </>
    ),
    "manage/chat": (
      <div className="flex gap-x-[4%] items-center justify-end w-full">
        {t.user_tag === "mobile" && (
          <Button
            variant="sky_blue"
            size="sm_medium"
            className="px-8 py-2 border-[1px] border-brand-9 bg-brand-tertiary bg-opacity-50 text-white"
          >
            Chat
          </Button>
        )}
        <Button
          href={`/management/tenants/${t.id}/manage`}
          size="sm_medium"
          className="px-8 py-2"
        >
          Manage
        </Button>
      </div>
    ),
    ref:
      index === tenants.length - 1 && current_page < total_pages
        ? lastRowRef
        : undefined,
  }));

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Tenants" statsCardCount={3} />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div
        className="w-full gap-2 flex items-center justify-between flex-wrap"
        ref={contentTopRef}
      >
        <BackButton reducePaddingTop as="div" className="items-start">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
            {staff?.name}
          </h1>
          <div className="text-text-disabled flex items-center space-x-1">
            <p className="text-sm font-medium capitalize">{staff?.role}</p>
          </div>
        </BackButton>
      </div>
      <FilterBar
        azFilter
        gridView={view === "grid"}
        setGridView={() => setView("grid")}
        setListView={() => setView("list")}
        pageTitle="Tenants"
        aboutPageModalData={{
          title: "Tenants",
          description:
            "This page contains a list of tenants assigned to this staff.",
        }}
        searchInputPlaceholder="Search for Tenants"
        handleFilterApply={() => {}}
        isDateTrue
        noExclamationMark
      />

      <section>
        {tenants.length === 0 && !silentLoading ? (
          <EmptyList
            buttonText="+ Add Tenant"
            modalContent={<AddTenantModal />}
            title="No tenants have been assigned to this staff yet."
            body={
              <p>
                To add a tenant to this staff, use the system&apos;s tenant
                assignment workflow.
              </p>
            }
          />
        ) : (
          <>
            {view === "grid" ? (
              <AutoResizingGrid minWidth={284} gap={16}>
                {silentLoading ? (
                  <CardsLoading />
                ) : (
                  tenants.map((t) => (
                    <Link
                      href={`/management/tenants/${t.id}/manage`}
                      key={t.id}
                    >
                      <TenantCard
                        key={t.id}
                        picture_url={t.picture_url}
                        name={t.name}
                        title={t.title}
                        user_tag={t.user_tag}
                        badge_color={t.badge_color}
                        email={t.email}
                        phone_number={t.phone_number}
                        // note={t.note}
                        is_flagged={t.flagged}
                      />
                    </Link>
                  ))
                )}
              </AutoResizingGrid>
            ) : (
              <>
                <CustomTable
                  displayTableHead={false}
                  fields={tenantTableFields}
                  data={transformedTenants}
                  tableBodyCellSx={{ color: "#3F4247" }}
                />
                {silentLoading && current_page > 1 && (
                  <div className="flex items-center justify-center py-4">
                    <div className="loader" />
                  </div>
                )}
              </>
            )}
            <Pagination
              totalPages={total_pages}
              currentPage={current_page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default StaffTenants;
