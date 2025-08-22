"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsVisitorsFilterOptionsWithDropdown,
  visitorsRequestTableFields,
  VisitorsRequestTableData,
  IVisitorsReportPageData,
  transformVisitorsRequest,
} from "./data";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DataItem } from "@/components/Table/types";
import { Modal, ModalContent } from "@/components/Modal/modal";
import VisitorRequestModal from "@/components/tasks/visitors-requests/visitor-request-modal";
import type { VisitorRequestModalProps } from "@/components/tasks/visitors-requests/types";
import useFetch from "@/hooks/useFetch";
import { VisitorRequestResponse } from "./types";
import { useGlobalStore } from "@/store/general-store";
import { AxiosRequestConfig } from "axios";
import { ReportsRequestParams } from "../tenants/data";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { BranchStaff } from "@/app/(nav)/(messages-reviews)/messages/types";
import { debounce } from "lodash";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";
import { Loader2 } from "lucide-react";

interface TableRecord {
  id: number;
  status: string;
  profile_picture?: string;
  purpose: string;
  user_name: string;
  visitor_name: string;
  phone_number: string;
  created_at: string;
  secret_question: string;
  secret_answer: string;
  request_id: string;
  checked_status: string;
  checked_in_by: string | null;
  checked_out_by: string | null;
  check_out_companion?: string;
  check_in_companion?: string;
  check_in_inventory?: string;
  check_out_inventory?: string;
  check_in_date: string | null;
  check_out_date: string | null;
  check_in_time: string | null;
  check_out_time: string | null;
}

const Visitors = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<VisitorRequestModalProps | null>(null);
  const [selectedVisitor, setSelectedVisitor] = useState<
    VisitorRequestModalProps["props"] | null
  >(null);
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: { page: 1, search: "" } as ReportsRequestParams,
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });
  const [branches, setBranches] = useState<BranchFilter[]>([]);
  const [branchAccountOfficers, setBranchAccountOfficers] = useState<
    BranchStaff[]
  >([]);
  const [propertyList, setPropertyList] = useState<PropertyFilter[]>([]);
  const { data: apiDataBranch } = useFetch<any>("branches");
  const { data: staff } = useFetch<any>(`report/staffs`);
  const { data: property } = useFetch<any>(`property/all`);

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (apiDataBranch) setBranches(apiDataBranch.data);
    if (staff) {
      const filterStaff = staff.data.filter(
        (staff: any) => staff.staff_role === "account officer"
      );
      setBranchAccountOfficers(filterStaff);
    }
    if (property) setPropertyList(property.data);
  }, [apiDataBranch, staff, property]);

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
          propertyList
            .filter((u) => u.units.length > 0)
            .map((property: any) => [
              property.title.toLowerCase(), // Use lowercase for comparison
              {
                label: property.title.toLowerCase(), // Keep original case for display
                value: property.id.toString(),
              },
            ])
        ).values(),
      ],
    },
  ];

  const setVisitorRequestStore = useGlobalStore((s) => s.setGlobalInfoStore);

  const [pageData, setPageData] = useState<IVisitorsReportPageData>({
    request_total: 0,
    request_month: 0,
    checked_in_total: 0,
    checked_in_month: 0,
    checked_out_total: 0,
    checked_out_month: 0,
    visitors: [],
    pagination: { total: 0, current_page: 0, last_page: 0 },
  });

  const handleSearch = (query: string) => {
    setConfig({ params: { ...config.params, search: query } });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({ params: { ...config.params, sort_order: order } });
  };

  // const handleAppliedFilter = useCallback(
  //   debounce((filters: FilterResult) => {
  //     setAppliedFilters(filters);
  //     const { menuOptions, startDate, endDate } = filters;
  //     const accountOfficer = menuOptions["Account Officer"] || [];
  //     const branch = menuOptions["Branch"] || [];
  //     const property = menuOptions["Property"] || [];

  //     const queryParams: ReportsRequestParams = { page: 1, search: "" };
  //     if (accountOfficer.length > 0)
  //       queryParams.account_officer_id = accountOfficer.join(",");
  //     if (branch.length > 0) queryParams.branch_id = branch.join(",");
  //     if (property.length > 0) queryParams.property_id = property.join(",");
  //     if (startDate)
  //       queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
  //     if (endDate)
  //       queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
  //     setConfig({ params: queryParams });
  //   }, 300),
  //   []
  // );

  const handleAppliedFilter = useCallback(
    (filters: FilterResult) => {
      const debouncedFilter = debounce((filters: FilterResult) => {
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
          queryParams.start_date = dayjs(startDate).format(
            "YYYY-MM-DD:hh:mm:ss"
          );
        if (endDate)
          queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
        setConfig({ params: queryParams });
      }, 300);

      debouncedFilter(filters);
    },
    [setAppliedFilters, setConfig]
  );

  const {
    data: apiData,
    loading,
    silentLoading,
    error,
    isNetworkError,
  } = useFetch<VisitorRequestResponse>(`/report/visitor-request`, config);

  // Handle data transformation and appending for infinite scroll
  useEffect(() => {
    if (apiData) {
      const transData = transformVisitorsRequest(apiData);
      setPageData((prev) => ({
        ...transData,
        emails:
          config.params.page === 1
            ? transData.visitors
            : [...prev.visitors, ...transData.visitors],
      }));
      //setGlobalStore("emails", transData.emails);
      setIsFetchingMore(false);
    }
  }, [apiData, config.params.page]);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    if (
      loading ||
      isFetchingMore ||
      !pageData ||
      pageData.visitors.length === 0 ||
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
  }, [loading, isFetchingMore, pageData, config.params.page]);

  useEffect(() => {
    if (!loading && apiData) {
      const transformedData = transformVisitorsRequest(apiData);
      const newProperties = transformedData;
      const currentProperties = useGlobalStore.getState().visitorsRequest;
      if (JSON.stringify(currentProperties) !== JSON.stringify(newProperties)) {
        setPageData(transformedData);
        setVisitorRequestStore("visitorsRequest", newProperties);
      }
    }
  }, [apiData, loading, setVisitorRequestStore]);

  useEffect(() => {
    if (apiData) {
      const transData = transformVisitorsRequest(apiData);
      setPageData(transData);
    }
  }, [apiData]);

  const handleTableItemClick = (record: TableRecord) => {
    console.log("Received record:", record); // Debug log

    const visitorData: VisitorRequestModalProps["props"] = {
      id: record.id,
      status: record.status as VisitorRequestModalProps["props"]["status"],
      pictureSrc: record.profile_picture || "/empty/SampleLandlord.jpeg",
      purpose: record.purpose || "",
      userName: record.user_name || "",
      visitorName: record.visitor_name || "",
      visitorPhoneNumber: record.phone_number || "",
      requestDate: record.created_at || "",
      secretQuestion: record.secret_question || "",
      secretAnswer: record.secret_answer || "",
      requestId: record.request_id || "",
      checked_status: record.checked_status || "",
      checked_in_by: record.checked_in_by,
      checked_out_by: record.checked_out_by,
      check_out_companion: record.check_out_companion || "",
      check_in_companion: record.check_in_companion || "",
      check_in_inventory: record.check_in_inventory || "",
      check_out_inventory: record.check_out_inventory || "",
      check_in_date: record.check_in_date,
      check_out_date: record.check_out_date,
      check_in_time: record.check_in_time,
      check_out_time: record.check_out_time,
      decline_by: (record as any).decline_by ?? null,
      decline_date: (record as any).decline_date ?? null,
      decline_time: (record as any).decline_time ?? null,
      reason: (record as any).reason ?? "",
    };

    setSelectedVisitor(visitorData);
    setModalOpen(true);
  };

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Properties Report" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Visitors Request"
          newData={pageData?.request_month || 0}
          total={pageData?.request_total || 0}
          colorScheme={1}
        />
        {/* <ManagementStatistcsCard
          title="Checked In Visitors"
          newData={pageData?.checked_in_month || 0}
          total={pageData?.checked_in_total || 0}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Check Out Visitors"
          newData={pageData?.checked_out_month || 0}
          total={pageData?.checked_out_total || 0}
          colorScheme={3}
        /> */}
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="visitors request"
        aboutPageModalData={{
          title: "visitors request",
          description:
            "This page contains a list of visitors request on the platform.",
        }}
        searchInputPlaceholder="Search for visitors request"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        onSort={handleSort}
        handleSearch={handleSearch}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exportHref="/reports/visitors/export"
        xlsxData={useGlobalStore.getState().visitorsRequest}
        fileLabel={"Properties Reports"}
      />
      <section>
        {pageData?.visitors.length === 0 && !loading ? (
          !!config.params.search || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Visitor Requests Available Yet"
              body={
                <p>
                  There are currently no visitor requests to export. This
                  section will automatically populate once visitors submit
                  requests through the platform. As new visitor records are
                  added, they will appear here for your review and action.
                </p>
              }
            />
          )
        ) : (
          <div ref={tableContainerRef} className="py-4">
            <CustomTable
              fields={visitorsRequestTableFields}
              data={pageData?.visitors || []}
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
              pageData.visitors.length > 0 && (
                <div className="text-center py-4 text-gray-500"></div>
              )}
          </div>
        )}
      </section>

      {/* <Modal
        state={{
          isOpen: modalOpen,
          setIsOpen: setModalOpen,
        }}
      >
        <ModalContent>
          {selectedVisitor && (
            <VisitorRequestModal
              props={selectedVisitor}
              closeModal={() => setModalOpen(false)}
            />
          )}
        </ModalContent>
      </Modal> */}
    </div>
  );
};

export default Visitors;
