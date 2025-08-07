"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  ReportsRequestParams,
  reportsTenantsFilterOptionsWithDropdown,
  TenantListResponse,
  TenantReport,
  tenantsReportTableFields,
  transformTenantData,
} from "./data";
import { useCallback, useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { AxiosRequestConfig } from "axios";
import { BranchFilter, FilterResult, PropertyFilter } from "./types";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { BranchStaff } from "@/app/(nav)/(messages-reviews)/messages/types";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { Loader2 } from "lucide-react";

const TenantsReport = () => {
  const router = useRouter();
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const [pageData, setPageData] = useState<TenantReport>({
    total_tenants: 0,
    monthly_tenants: 0,
    tenants: [],
    pagination: { total: 0, last_page: 0, current_page: 0 },
  });
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });
  const [branchAccountOfficers, setBranchAccountOfficers] = useState<
    BranchStaff[]
  >([]);
  const [propertyList, setPropertyList] = useState<PropertyFilter[]>([]);
  const { data: staff } = useFetch<any>(`report/staffs`);
  const { data: property } = useFetch<any>(`property/all`);

  useEffect(() => {
    if (staff) {
      const filterStaff = staff.data.filter(
        (staff: any) => staff.staff_role === "account officer"
      );
      setBranchAccountOfficers(filterStaff);
    }
    if (property) setPropertyList(property.data);
  }, [staff, property]);

  const reportTenantFilterOption = [
    {
      label: "Account Manager",
      value: [
        ...new Map(
          branchAccountOfficers.map((staff: any) => [
            staff.user.name.toLowerCase(), // Use lowercase for comparison
            {
              label: staff.user.name.toLowerCase(), // Keep original case for display
              value: staff.user.id.toString(),
            },
          ])
        ).values(),
      ],
    },
    {
      label: "Property",
      value: [
        ...new Map(
          propertyList.map((property: any) => [
            property.title.toLowerCase(), // Use lowercase for comparison
            {
              label: property.title, // Keep original case for display
              value: property.id.toString(),
            },
          ])
        ).values(),
      ],
    },
  ];

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: { page: 1, search: "" } as ReportsRequestParams,
  });

  const handleSearch = (query: string) => {
    setConfig({ params: { ...config.params, search: query } });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({ params: { ...config.params, sort_order: order } });
  };

  const handleAppliedFilter = useCallback(
    debounce((filters: FilterResult) => {
      setAppliedFilters(filters);
      const { menuOptions, startDate, endDate } = filters;
      const accountOfficer = menuOptions["Account Officer"] || [];
      const property = menuOptions["Property"] || [];

      const queryParams: ReportsRequestParams = { page: 1, search: "" };
      if (accountOfficer.length > 0)
        queryParams.account_officer_id = accountOfficer.join(",");
      if (property.length > 0) queryParams.property_id = property.join(",");
      if (startDate)
        queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
      if (endDate)
        queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
      setConfig({ params: queryParams });
    }, 300),
    []
  );

  // Conditionally set the URL only if BRANCH_ID is valid
  const fetchUrl = BRANCH_ID && BRANCH_ID !== 0 ? `/report/tenants` : null;
  // FETCH
  const { data, loading, error, isNetworkError } = useFetch<TenantListResponse>(
    `/report/tenants`,
    config
  );

  useEffect(() => {
    if (!loading && data) {
      const transformedData = transformTenantData(data);
      const newTenants = transformedData.tenants;
      const currentTenants = useGlobalStore.getState().tenants;
      if (JSON.stringify(currentTenants) !== JSON.stringify(newTenants)) {
        setPageData(transformedData);
        setGlobalStore("tenants", newTenants);
      }
    }
  }, [data, loading, setGlobalStore]);

  // Handle data transformation and appending for infinite scroll
  useEffect(() => {
    if (data && !loading) {
      const transData = transformTenantData(data);
      setPageData((prev) => ({
        ...transData,
        emails:
          config.params.page === 1
            ? transData.tenants
            : [...(prev?.tenants ?? []), ...transData.tenants],
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
      pageData.tenants.length === 0 ||
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

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Tenants/Occupants" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Tenants"
          newData={pageData.monthly_tenants}
          total={pageData.total_tenants}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="Tenants/Occupants"
        aboutPageModalData={{
          title: "Tenants/Occupants",
          description:
            "This page contains a list of Tenants/Occupants on the platform.",
        }}
        searchInputPlaceholder="Search for Tenants/Occupants"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        onSort={handleSort}
        handleSearch={handleSearch}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exportHref="/manager/reports/tenants/export"
        xlsxData={useGlobalStore.getState().properties}
        fileLabel={"Tenants Reports"}
      />
      <section>
        {pageData.tenants.length === 0 && !loading ? (
          !!config.params.search.trim() || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Tenant or Occupant Profiles Available Yet"
              body={
                <p>
                  At the moment, there are no tenant/occupant profiles available
                  for export. Once profile records are added to the system, they
                  will appear here and be available for download or export.
                  <br />
                  <br />
                  <p>
                    This section will automatically populate with all available
                    data as soon as new tenant or occupant profiles are created
                    or imported into the platform.
                  </p>
                </p>
              }
            />
          )
        ) : (
          <div ref={tableContainerRef} className="py-4">
            <CustomTable
              fields={tenantsReportTableFields}
              data={pageData?.tenants || []}
              tableHeadClassName="h-[45px]"
              tableBodyCellSx={{ color: "#3F4247" }}
            />

            {isFetchingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-brand-9" />
              </div>
            )}
            {pageData &&
              pageData.pagination.current_page >=
                pageData.pagination.last_page &&
              pageData.tenants.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                  {/* No more emails to load */}
                </div>
              )}
          </div>
        )}
      </section>
    </div>
  );
};

export default TenantsReport;
