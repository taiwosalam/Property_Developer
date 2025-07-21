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
import { useCallback, useEffect, useState } from "react";
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
import { usePersonalInfoStore } from "@/store/personal-info-store";

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
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;

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
      label: "Account Officer",
      value: branchAccountOfficers.map((staff: any) => ({
        label: staff.user.name,
        value: staff.user.id.toString(),
      })),
    },
    {
      label: "Property",
      value: propertyList.map((property: any) => ({
        label: property.title,
        value: property.id.toString(),
      })),
    },
  ];

  const setVisitorRequestStore = useGlobalStore((s) => s.setGlobalInfoStore);

  const [pageData, setPageData] = useState<IVisitorsReportPageData | null>(
    null
  );

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
  const fetchUrl =
    BRANCH_ID && BRANCH_ID !== 0
      ? `/report/visitor-request?branch_id=${BRANCH_ID}`
      : null;

  const {
    data: apiData,
    loading,
    silentLoading,
    error,
    isNetworkError,
  } = useFetch<VisitorRequestResponse>(fetchUrl, config);

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

    console.log("Transformed data:", visitorData); // Debug log

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
        xlsxData={useGlobalStore.getState().properties}
        fileLabel={"Properties Reports"}
      />
      <section>
        {pageData?.data.length === 0 && !loading ? (
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
          <CustomTable
            fields={visitorsRequestTableFields}
            data={pageData?.data || []}
            tableHeadClassName="h-[45px]"
            // handleSelect={handleTableItemClick}
          />
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
