"use client";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
// import {
//   reportsListingsFilterOptionsWithDropdown,
//   trackingTableFields,
// } from "./data";
// import {
//   ActivityApiResponse,
//   ActivityTable,
//   transformActivityAData,
// } from "./[userId]/types";
import { useCallback, useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { ReportsRequestParams } from "../tenants/data";
import { AxiosRequestConfig } from "axios";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import ServerError from "@/components/Error/ServerError";
import useAddressFromCoords from "@/hooks/useGeoCoding";
import { useGlobalStore } from "@/store/general-store";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "@/utils/debounce";
import { Activity, Loader2 } from "lucide-react";
import {
  SponsorFields,
  SponsorUnitTable,
  transformSponsorResponse,
} from "../../settings/add-on/data";
import { SponsorListingsResponse } from "@/components/Settings/types";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

const AddsOnSponsorRecord = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("b");
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: { page: 1, search: "" } as ReportsRequestParams,
  });
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

  const [pageData, setPageData] = useState<SponsorUnitTable>({
    sponsor_listings: [],
    sponsor_value: "",
    pagination: { total: 0, current_page: 0, last_page: 0 },
  });

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const { data, error, loading, refetch, isNetworkError } =
    useFetch<SponsorListingsResponse>("/sponsor/listings", config);
  //useRefetchOnEvent("refetchRentSponsors", () => refetch({ silent: true }));

  // Handle data transformation and appending for infinite scroll
  useEffect(() => {
    if (data) {
      const transData = transformSponsorResponse(data);
      setPageData((prev) => ({
        ...transData,
        emails:
          config.params.page === 1
            ? transData.sponsor_listings
            : [...prev.sponsor_listings, ...transData.sponsor_listings],
      }));
      //setGlobalStore("emails", transData.emails);
      setIsFetchingMore(false);
    }
  }, [data, config.params.page, setGlobalStore]);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    if (
      loading ||
      isFetchingMore ||
      !pageData ||
      pageData.sponsor_listings.length === 0 ||
      pageData.pagination.current_page >= pageData.pagination.last_page
    ) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          console.log(
            "Last row visible, fetching page:",
            config.params.page + 1
          );
          setConfig((prev) => ({
            ...prev,
            params: { ...prev.params, page: prev.params.page + 1 },
          }));
          setIsFetchingMore(true);
        }
      },
      {
        root: tableContainerRef.current, // Use TableContainer as the scrollable root
        rootMargin: "20px", // Trigger slightly before the bottom
        threshold: 1.0, // Trigger when the last row is fully visible
      }
    );

    if (lastRowRef.current) {
      observerRef.current.observe(lastRowRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, isFetchingMore, pageData]);

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    if (data) {
      const transData = transformSponsorResponse(data);
      setPageData(transData);
    }
  }, [data]);

  useEffect(() => {
    if (!loading && data) {
      const transformedData = transformSponsorResponse(data);
      const currentSponsored = useGlobalStore.getState().sponsored_listing;
      if (
        JSON.stringify(currentSponsored) !== JSON.stringify(transformedData)
      ) {
        setGlobalStore("sponsored_listing", transformedData.sponsor_listings);
      }
      //setPageData(transformedData);
    }
  }, [data, loading, setGlobalStore]);

  const handleAppliedFilter = useCallback(
    debounce((filters: FilterResult) => {
      setAppliedFilters(filters);
      const { menuOptions, startDate, endDate } = filters;
      const accountOfficer = menuOptions["Account Officer"] || [];
      const branch = menuOptions["Branch"] || [];
      const property = menuOptions["Property"] || [];

      const queryParams: ReportsRequestParams = { page: 1, search: "" };
      if (accountOfficer.length > 0)
        queryParams.account_officer_id = accountOfficer.join(",");
      if (branch.length > 0) queryParams.branch_id = branch.join(",");
      if (property.length > 0) queryParams.property_id = property.join(",");
      if (startDate)
        queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
      if (endDate)
        queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
      setConfig({ params: queryParams });
    }, 300),
    []
  );

  const handleSearch = (query: string) => {
    setConfig({ params: { ...config.params, search: query } });
  };

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Add-On Sponsor" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <FilterBar
        exports
        isDateTrue
        onBack={search ? true : false}
        pageTitle="Adds-On Sponsor"
        aboutPageModalData={{
          title: "Adds-On Sponsor",
          description: "This page contains a list of listing sponsor history",
        }}
        searchInputPlaceholder="Search for audit trail"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        //={() => {}}
        onSort={() => {}}
        handleSearch={handleSearch}
        //filterOptionsMenu={() => {}}
        hasGridListToggle={false}
        exportHref="/reports/adds-on-sponsor/export"
        xlsxData={pageData?.sponsor_listings.map((activity) => ({
          ...activity,
        }))}
        fileLabel={"Activity Reports"}
      />
      <section>
        {pageData && pageData?.sponsor_listings.length === 0 && !loading ? (
          !!config.params.search ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Previous Add-On Record Found"
              body={
                <p>
                  You currently do not have any previous records for this
                  add-on. Once you activate or subscribe to this add-on, all
                  related history and usage details will be displayed here for
                  your reference.
                </p>
              }
            />
          )
        ) : (
          <div ref={tableContainerRef} className="py-4">
            <CustomTable
              fields={SponsorFields}
              data={pageData ? pageData.sponsor_listings : []}
              tableHeadClassName="h-[45px]"
            
            />

            {isFetchingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-brand-9" />
              </div>
            )}
            {pageData &&
              pageData.pagination.current_page >=
                pageData.pagination.last_page &&
              pageData.sponsor_listings.length > 0 && (
                <div className="text-center py-4 text-gray-500"></div>
              )}
          </div>
        )}
      </section>
    </div>
  );
};

export default AddsOnSponsorRecord;
