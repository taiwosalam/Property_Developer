"use client";
import { Modal, ModalContent } from "@/components/Modal/modal";
import { useCallback, useEffect, useRef, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import EmailModal, { type EmailRecord } from "@/components/reports/email-modal";
import type { DataItem } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsEmailFilterOptionsWithDropdown,
  emailTablefields,
  transformEmailReport,
  IEmailReportResponse,
  EmailPageData,
  transformEmailById,
  IEmailByIdResponse,
} from "./data";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { BranchStaff } from "@/app/(nav)/(messages-reviews)/messages/types";
import { AxiosRequestConfig } from "axios";
import { ReportsRequestParams } from "../tenants/data";
import debounce from "lodash/debounce";
import dayjs from "dayjs";
import EmptyList from "@/components/EmptyList/Empty-List";
import { hasActiveFilters } from "../data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { Loader2 } from "lucide-react";
import TableMenu from "@/components/Table/table-menu";
import { MenuItem } from "@mui/material";
import { EmailModalSkeleton } from "@/components/reports/email-modal-skeleton";
import { usePersonalInfoStore } from "@/store/personal-info-store";

const EmailReport = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { branch } = usePersonalInfoStore();

  const BRANCH_ID = branch?.branch_id || 0;
  const [selectedSMS, setSelectedSMS] = useState<EmailRecord | null>(null);
  const [pageData, setPageData] = useState<EmailPageData>({
    emails: [],
    pagination: { total: 0, current_page: 0, last_page: 0 },
  });
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: { page: 1, search: "" } as ReportsRequestParams,
  });
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const { data: staff } = useFetch<any>(`report/staffs`);
  const { data: property } = useFetch<any>(`property/all`);

  // Conditionally set the URL only if BRANCH_ID is valid
  const fetchUrl =
    BRANCH_ID && BRANCH_ID !== 0
      ? `/report/emails?branch_id=${BRANCH_ID}`
      : null;

  const {
    data: emailData,
    loading,
    isNetworkError,
    error,
  } = useFetch<IEmailReportResponse>(fetchUrl, config);

  // Handle data transformation and appending for infinite scroll
  useEffect(() => {
    if (emailData) {
      const transData = transformEmailReport(emailData);
      setPageData((prev) => ({
        ...transData,
        emails:
          config.params.page === 1
            ? transData.emails
            : [...prev.emails, ...transData.emails],
      }));
      //setGlobalStore("emails", transData.emails);
      setIsFetchingMore(false);
    }
  }, [emailData, config.params.page, setGlobalStore]);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    if (
      loading ||
      isFetchingMore ||
      !pageData ||
      pageData.emails.length === 0 ||
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

  const handleSearch = (query: string) => {
    setConfig({ params: { ...config.params, search: query, page: 1 } });
    setPageData({
      emails: [],
      pagination: { total: 0, current_page: 0, last_page: 0 },
    });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({ params: { ...config.params, sort_order: order, page: 1 } });
    setPageData({
      emails: [],
      pagination: { total: 0, current_page: 0, last_page: 0 },
    });
  };

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
      setPageData({
        emails: [],
        pagination: { total: 0, current_page: 0, last_page: 0 },
      });
    }, 300),
    []
  );

  const handleTableItemClick = (record: DataItem) => {
    setSelectedSMS(record as EmailRecord);
    if (record.email_id) {
      setSelectedEmailId(Number(record.email_id));
    }
    setModalOpen(true);
  };

  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null);
  const [selectedEmailDetails, setSelectedEmailDetails] =
    useState<EmailRecord | null>(null);

  useEffect(() => {
    if (selectedEmailId) {
      setSelectedEmailDetails(null);
    }
  }, [selectedEmailId]);

  const {
    data: emailIdData,
    silentLoading,
    loading: emailLoading,
  } = useFetch<IEmailByIdResponse>(
    selectedSMS ? `report/emails/${selectedSMS?.email_id}` : null
  );

  useEffect(() => {
    if (emailIdData) {
      const transformEmail = transformEmailById(emailIdData);
      setSelectedEmailDetails(transformEmail);
    }
  }, [emailIdData]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const handleMenuOpen = (item: DataItem, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedItemId(String(item.id));
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };

  async function handleDeleteItem(item: string) {
    //await deleteUndoItem(item);
  }

  async function restoreTrashItem(item: string) {
    //await restoreItem(item);
  }

  if (loading && config.params.page === 1)
    return <CustomLoader layout="page" pageTitle="Email" view="table" />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Emails"
          newData={23}
          total={200}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        isDateTrue
        pageTitle="Email"
        aboutPageModalData={{
          title: "Email",
          description: "This page contains a list of Email on the platform.",
        }}
        searchInputPlaceholder="Search for Email"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        onSort={handleSort}
        handleSearch={handleSearch}
        fileLabel={"Email Reports"}
        xlsxData={useGlobalStore.getState().emails}
        filterOptionsMenu={reportsEmailFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/email/export"
      />
      <section>
        {pageData?.emails.length === 0 && !loading ? (
          !!config.params.search || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Emails Available Yet"
              body={
                <p>
                  There are currently no email records to export. This section
                  will automatically populate with emails sent to your company
                  users using your company details once there is activities such
                  as rent-related actions begin on the platform. Please check
                  back later.
                </p>
              }
            />
          )
        ) : (
          <div ref={tableContainerRef} className="py-4">
            <CustomTable
              fields={emailTablefields}
              data={pageData?.emails || []}
              tableHeadClassName="h-[45px]"
              handleSelect={handleTableItemClick}
              lastRowRef={lastRowRef}
              // onActionClick={(item, e) => {
              //   handleMenuOpen(item, e as React.MouseEvent<HTMLElement>);
              // }}
            />

            {isFetchingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-brand-9" />
              </div>
            )}
            {pageData &&
              pageData.pagination.current_page >=
                pageData.pagination.last_page &&
              pageData.emails.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                  No more emails to load
                </div>
              )}
          </div>
        )}
      </section>
      <Modal
        state={{
          isOpen: modalOpen,
          setIsOpen: setModalOpen,
        }}
      >
        <ModalContent>
          {silentLoading ? (
            <EmailModalSkeleton />
          ) : (
            <EmailModal {...(selectedEmailDetails as EmailRecord)} />
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EmailReport;
