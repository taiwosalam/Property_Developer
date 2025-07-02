// "use client";

// import React, { useEffect, useMemo, useState } from "react";

// // Imports
// import PropertyListingCard from "@/components/Listing/Property/property-listing-card";
// import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
// import { property_listing_status } from "@/components/Listing/Property/data";
// import { PropertyListingStatusItem } from "@/components/Listing/Property/property-listing-component";
// import FilterBar from "@/components/FIlterBar/FilterBar";
// import {
//   DraftPropertyFilterParams,
//   DraftPropertyState,
//   initialState,
//   listingPropertyFilter,
//   PropertyApiResponse,
//   PropertyPageState,
//   transformDraftUnitData,
// } from "./data";
// import { FilterResult } from "@/components/Management/Landlord/types";
// import { AxiosRequestConfig } from "axios";
// import dayjs from "dayjs";
// import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
// import useFetch from "@/hooks/useFetch";
// import CustomLoader from "@/components/Loader/CustomLoader";
// import NetworkError from "@/components/Error/NetworkError";
// import { AllBranchesResponse } from "@/components/Management/Properties/types";
// import { PropertyListResponse } from "../../tasks/inspections/type";
// import { IPropertyApi } from "../../settings/others/types";
// import SearchError from "@/components/SearchNotFound/SearchNotFound";
// import { hasActiveFilters } from "../../reports/data/utils";
// import EmptyList from "@/components/EmptyList/Empty-List";
// import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
// import { PropertyrequestSkeletonLoader } from "@/components/Loader/property-request-loader";

// const Property = () => {
//   const [pageData, setPageData] = useState<PropertyPageState>(initialState);

//   const [state, setState] = useState<DraftPropertyState>({
//     total_pages: 1,
//     current_page: 1,
//     last_page: 1,
//   });

//   const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
//     options: [],
//     menuOptions: {},
//     startDate: null,
//     endDate: null,
//   });

//   const { menuOptions, startDate, endDate } = appliedFilters;
//   const branchIdsArray = menuOptions["Branch"] || [];
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState<"asc" | "desc" | "">("");

//   const isFilterApplied = () => {
//     const { options, menuOptions, startDate, endDate } = appliedFilters;
//     return (
//       options.length > 0 ||
//       Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
//       startDate !== null ||
//       endDate !== null
//     );
//   };

//   const endpoint =
//     isFilterApplied() || search || sort
//       ? "/unit/vacant/list/filter"
//       : "/property/invite/lists";

//   const config: AxiosRequestConfig = useMemo(() => {
//     return {
//       params: {
//         page,
//         date_from: appliedFilters.startDate
//           ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
//           : undefined,
//         date_to: appliedFilters.endDate
//           ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
//           : undefined,
//         search: search,
//         branch_id: appliedFilters.menuOptions["Branch"] || [],
//         state: appliedFilters.menuOptions["State"] || [],
//         property_type: appliedFilters.menuOptions["Property Type"]?.[0],
//         sort_by: sort,
//       } as DraftPropertyFilterParams,
//     };
//   }, [appliedFilters, search, sort, page]);

//   const handleSort = (order: "asc" | "desc") => {
//     setSort(order);
//   };

//   const handleSearch = (query: string) => {
//     setSearch(query);
//   };

//   const handleFilterApply = (filters: FilterResult) => {
//     setAppliedFilters(filters);
//     setPage(1);
//   };

//   const { data: branchesData } =
//     useFetch<AllBranchesResponse>("/branches/select");

//   const branchOptions =
//     branchesData?.data.map((branch) => ({
//       label: branch.branch_name,
//       value: branch.id,
//     })) || [];

//   const {
//     data: apiData,
//     loading,
//     silentLoading,
//     isNetworkError,
//     error,
//     refetch,
//   } = useFetch<PropertyApiResponse | any>(endpoint, config);

//   const { data: propertiesData } = useFetch<IPropertyApi>(`/property/list`);

//   const propertyOptions = Array.isArray(propertiesData?.data.properties.data)
//     ? [
//         ...new Map(
//           propertiesData.data.properties.data
//             .filter(
//               (property: any) =>
//                 property.property_type === "rental" && property.units.length > 0
//             )
//             .map((property: any) => [
//               property.title, // Use property title as the unique key
//               {
//                 label: property.title,
//                 value: property.id.toString(),
//               },
//             ])
//         ).values(),
//       ]
//     : [];

//   useEffect(() => {
//     if (apiData) {
//       setPageData((x) => ({ ...x, ...transformDraftUnitData(apiData) }));
//       setState((prevState) => ({
//         ...prevState,
//       }));
//     }
//   }, [apiData]);

//   // Listen for the refetch event
//   useRefetchOnEvent("refetchPropertyDraft", () => refetch({ silent: true }));

//   if (loading)
//     return (
//       <CustomLoader
//         layout="page"
//         statsCardCount={3}
//         pageTitle="Property Draft & Request"
//       />
//     );

//   if (isNetworkError) return <NetworkError />;

//   if (error)
//     return <p className="text-base text-red-500 font-medium">{error}</p>;
//   return (
//     <div className="custom-flex-col gap-9">
//       <div className="hidden md:flex gap-5 flex-wrap">
//         <ManagementStatistcsCard
//           title="Total Property"
//           newData={pageData.current_month_property}
//           total={pageData.total_property}
//           className="w-[240px]"
//           colorScheme={1}
//         />
//         <ManagementStatistcsCard
//           title="Drafted"
//           newData={pageData.current_month_draft}
//           total={pageData.total_draft}
//           className="w-[240px]"
//           colorScheme={2}
//         />
//         <ManagementStatistcsCard
//           title="Request"
//           newData={pageData.current_month_invite}
//           total={pageData.total_invite}
//           className="w-[240px]"
//           colorScheme={3}
//         />
//       </div>
//       <FilterBar
//         azFilter
//         pageTitle="Property Draft & Request"
//         aboutPageModalData={{
//           title: "Moderating Property",
//           description:
//             "This page contains a list of Moderating Property on the platform.",
//           video: "",
//         }}
//         searchInputPlaceholder="Search"
//         handleFilterApply={handleFilterApply}
//         isDateTrue={false}
//         filterOptionsMenu={[
//           ...listingPropertyFilter,
//           ...(branchOptions.length > 0
//             ? [
//                 {
//                   label: "Branch",
//                   value: branchOptions,
//                 },
//               ]
//             : []),
//           ...(propertyOptions.length > 0
//             ? [
//                 {
//                   label: "Property",
//                   value: propertyOptions,
//                 },
//               ]
//             : []),
//         ]}
//         hasGridListToggle={false}
//       />

//       {loading || silentLoading ? (
//         <AutoResizingGrid gap={28} minWidth={400}>
//           <PropertyrequestSkeletonLoader length={10} />
//         </AutoResizingGrid>
//       ) : !pageData?.properties.length ? (
//         // Show empty state when no visitors exist
//         <EmptyList
//           noButton
//           title="Unpublished Properties & Incoming Transfer Requests"
//           body={
//             <p>
//               You currently have no unpublished properties or incoming property
//               transfer requests from other companies. Any property you create
//               without units will appear here.
//               <br />
//               You can choose to complete them from this page or delete them if
//               they&apos;re no longer needed.
//               <br />
//               <br />
//               If you intend to transfer any property and its units from your
//               company portfolio to another company, simply share the property ID
//               with them. Their transfer request will appear here for your
//               approval.
//               <br />
//             </p>
//           }
//         />
//       ) : !!config.params.search || hasActiveFilters(appliedFilters) ? (
//         // If we have data but search/filters return nothing, show search error
//         pageData.properties.length === 0 ? (
//           <SearchError />
//         ) : (
//           // Show filtered/searched results
//           <section>
//             <div className="custom-flex-col gap-8">
//               <div className="flex flex-wrap gap-4 justify-end">
//                 {Object.entries(property_listing_status).map(
//                   ([key, value], idx) => (
//                     <PropertyListingStatusItem
//                       key={`${key}(${idx})`}
//                       text={key}
//                       color={value}
//                     />
//                   )
//                 )}
//               </div>
//               {pageData.properties.map((property) => (
//                 <PropertyListingCard
//                   key={property.id}
//                   data={property as any}
//                   status={property.status}
//                   propertyType={property.property_type as "rental" | "gated"}
//                 />
//               ))}
//             </div>
//           </section>
//         )
//       ) : (
//         // Show all results when no search/filters active
//         <section>
//           <div className="custom-flex-col gap-8">
//             <div className="flex flex-wrap gap-4 justify-end">
//               {Object.entries(property_listing_status).map(
//                 ([key, value], idx) => (
//                   <PropertyListingStatusItem
//                     key={`${key}(${idx})`}
//                     text={key}
//                     color={value}
//                   />
//                 )
//               )}
//             </div>
//             {pageData.properties.map((property) => (
//               <PropertyListingCard
//                 key={property.id}
//                 data={property as any}
//                 status={property.status}
//                 propertyType={property.property_type as "rental" | "gated"}
//               />
//             ))}
//           </div>
//         </section>
//       )}

//       <div className="custom-flex-col gap-8">
//         <div className="flex flex-wrap gap-4 justify-end">
//           {Object.entries(property_listing_status).map(([key, value], idx) => (
//             <PropertyListingStatusItem
//               key={`${key}(${idx})`}
//               text={key}
//               color={value}
//             />
//           ))}
//         </div>
//         {pageData.properties.map((property) => (
//           <PropertyListingCard
//             key={property.id}
//             data={property as any}
//             status={property.status}
//             propertyType={property.property_type as "rental" | "gated"}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Property;

"use client";

import React, { useEffect, useMemo, useState } from "react";

// Imports
import PropertyListingCard from "@/components/Listing/Property/property-listing-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { property_listing_status } from "@/components/Listing/Property/data";
import { PropertyListingStatusItem } from "@/components/Listing/Property/property-listing-component";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  DraftPropertyFilterParams,
  DraftPropertyState,
  initialState,
  listingPropertyFilter,
  PropertyApiResponse,
  PropertyPageState,
  transformDraftUnitData,
} from "./data";
import { FilterResult } from "@/components/Management/Landlord/types";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { AllBranchesResponse } from "@/components/Management/Properties/types";
import { PropertyListResponse } from "../../tasks/inspections/type";
import { IPropertyApi } from "../../settings/others/types";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../../reports/data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { PropertyrequestSkeletonLoader } from "@/components/Loader/property-request-loader";
import Pagination from "@/components/Pagination/pagination";

const Property = () => {
  const [pageData, setPageData] = useState<PropertyPageState>(initialState);

  const [state, setState] = useState<DraftPropertyState>({
    total_pages: 1,
    current_page: 1,
    last_page: 1,
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const { menuOptions, startDate, endDate } = appliedFilters;
  const branchIdsArray = menuOptions["Branch"] || [];
  const [page, setPage] = useState(
    parseInt(sessionStorage.getItem("property_page") || "1", 10)
  );
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");

  // Save page number to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("property_page", page.toString());
  }, [page]);

  const isFilterApplied = () => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  };

  const endpoint =
    isFilterApplied() || search || sort
      ? "/unit/vacant/list/filter"
      : "/property/invite/lists";

  const config: AxiosRequestConfig = useMemo(() => {
    return {
      params: {
        page,
        date_from: appliedFilters.startDate
          ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
          : undefined,
        date_to: appliedFilters.endDate
          ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
          : undefined,
        search: search,
        branch_id: appliedFilters.menuOptions["Branch"] || [],
        state: appliedFilters.menuOptions["State"] || [],
        property_type: appliedFilters.menuOptions["Property Type"]?.[0],
        sort_by: sort,
      } as DraftPropertyFilterParams,
    };
  }, [appliedFilters, search, sort, page]);

  const handleSort = (order: "asc" | "desc") => {
    setSort(order);
    setPage(1);
    sessionStorage.setItem("property_page", "1");
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
    sessionStorage.setItem("property_page", "1");
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    setPage(1);
    sessionStorage.setItem("property_page", "1");
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    sessionStorage.setItem("property_page", pageNumber.toString());
  };

  const { data: branchesData } =
    useFetch<AllBranchesResponse>("/branches/select");

  const branchOptions =
    branchesData?.data.map((branch) => ({
      label: branch.branch_name,
      value: branch.id,
    })) || [];

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<PropertyApiResponse | any>(endpoint, config);

  const { data: propertiesData } = useFetch<IPropertyApi>(`/property/list`);

  const propertyOptions = Array.isArray(propertiesData?.data.properties.data)
    ? [
        ...new Map(
          propertiesData.data.properties.data
            .filter(
              (property: any) =>
                property.property_type === "rental" && property.units.length > 0
            )
            .map((property: any) => [
              property.title,
              {
                label: property.title,
                value: property.id.toString(),
              },
            ])
        ).values(),
      ]
    : [];

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({ ...x, ...transformDraftUnitData(apiData) }));
      setState((prevState) => ({
        ...prevState,
        total_pages: apiData.meta?.total_pages || prevState.total_pages,
        last_page: apiData.meta?.last_page || prevState.last_page,
        current_page: page,
      }));
    }
  }, [apiData, page]);

  // Listen for the refetch event
  useRefetchOnEvent("refetchPropertyDraft", () => refetch({ silent: true }));

  if (loading)
    return (
      <CustomLoader
        layout="page"
        statsCardCount={3}
        pageTitle="Property Draft & Request"
      />
    );

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="custom-flex-col gap-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Property"
          newData={pageData.current_month_property}
          total={pageData.total_property}
          className="w-[240px]"
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Drafted"
          newData={pageData.current_month_draft}
          total={pageData.total_draft}
          className="w-[240px]"
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Request"
          newData={pageData.current_month_invite}
          total={pageData.total_invite}
          className="w-[240px]"
          colorScheme={3}
        />
      </div>
      <FilterBar
        azFilter
        pageTitle="Property Draft & Request"
        aboutPageModalData={{
          title: "Moderating Property",
          description:
            "This page contains a list of Moderating Property on the platform.",
          video: "",
        }}
        searchInputPlaceholder="Search"
        handleFilterApply={handleFilterApply}
        handleSearch={handleSearch}
        onSort={handleSort}
        isDateTrue
        filterOptionsMenu={[
          ...listingPropertyFilter,
          ...(branchOptions.length > 0
            ? [
                {
                  label: "Branch",
                  value: branchOptions,
                },
              ]
            : []),
          ...(propertyOptions.length > 0
            ? [
                {
                  label: "Property",
                  value: propertyOptions,
                },
              ]
            : []),
        ]}
        hasGridListToggle={false}
      />

      {loading || silentLoading ? (
        <AutoResizingGrid gap={28} minWidth={400}>
          <PropertyrequestSkeletonLoader length={10} />
        </AutoResizingGrid>
      ) : !pageData?.properties.length ? (
        // Show empty state when no visitors exist
        <EmptyList
          noButton
          title="Unpublished Properties & Incoming Transfer Requests"
          body={
            <p>
              You currently have no unpublished properties or incoming property
              transfer requests from other companies. Any property you create
              without units will appear here.
              <br />
              You can choose to complete them from this page or delete them if
              they&apos;re no longer needed.
              <br />
              <br />
              If you intend to transfer any property and its units from your
              company portfolio to another company, simply share the property ID
              with them. Their transfer request will appear here for your
              approval.
              <br />
            </p>
          }
        />
      ) : !!config.params.search || hasActiveFilters(appliedFilters) ? (
        // If we have data but search/filters return nothing, show search error
        pageData.properties.length === 0 ? (
          <SearchError />
        ) : (
          // Show filtered/searched results
          <section>
            <div className="custom-flex-col gap-8">
              <div className="flex flex-wrap gap-4 justify-end">
                {Object.entries(property_listing_status).map(
                  ([key, value], idx) => (
                    <PropertyListingStatusItem
                      key={`${key}(${idx})`}
                      text={key}
                      color={value}
                    />
                  )
                )}
              </div>
              {pageData.properties.map((property) => (
                <PropertyListingCard
                  key={property.id}
                  data={property as any}
                  status={property.status}
                  propertyType={property.property_type as "rental" | "gated"}
                />
              ))}
            </div>
          </section>
        )
      ) : (
        // Show all results when no search/filters active
        <section>
          <div className="custom-flex-col gap-8">
            <div className="flex flex-wrap gap-4 justify-end">
              {Object.entries(property_listing_status).map(
                ([key, value], idx) => (
                  <PropertyListingStatusItem
                    key={`${key}(${idx})`}
                    text={key}
                    color={value}
                  />
                )
              )}
            </div>
            {pageData.properties.map((property) => (
              <PropertyListingCard
                key={property.id}
                data={property as any}
                status={property.status}
                propertyType={property.property_type as "rental" | "gated"}
              />
            ))}
          </div>
        </section>
      )}

      <div className="custom-flex-col gap-8">
        <div className="flex flex-wrap gap-4 justify-end">
          {Object.entries(property_listing_status).map(([key, value], idx) => (
            <PropertyListingStatusItem
              key={`${key}(${idx})`}
              text={key}
              color={value}
            />
          ))}
        </div>
        {pageData.properties.map((property) => (
          <PropertyListingCard
            key={property.id}
            data={property as any}
            status={property.status}
            propertyType={property.property_type as "rental" | "gated"}
          />
        ))}
      </div>

      {/* Pagination component */}
      <Pagination
        totalPages={state.last_page}
        currentPage={state.current_page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Property;
