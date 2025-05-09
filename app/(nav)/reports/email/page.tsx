"use client";
import { Modal, ModalContent } from "@/components/Modal/modal";
import { useCallback, useEffect, useState } from "react";
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
} from "./data";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
import { AxiosRequestConfig } from "axios";
import { ReportsRequestParams } from "../tenants/data";
import debounce from "lodash/debounce";
import dayjs from "dayjs";
import EmptyList from "@/components/EmptyList/Empty-List";
import { hasActiveFilters } from "../data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";

const EmailReport = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSMS, setSelectedSMS] = useState<EmailRecord | null>(null);
  const [pageData, setPageData] = useState<EmailPageData | null>(null);

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: { page: 1, search: "" } as ReportsRequestParams,
  });

  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

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
  const { data: apiData } = useFetch<any>("branches");
  const { data: staff } = useFetch<any>(`report/staffs`);
  const { data: property } = useFetch<any>(`property/all`);

  const {
    data: emailData,
    loading,
    isNetworkError,
    error,
  } = useFetch<IEmailReportResponse>(`/report/emails`, config);

  useEffect(() => {
    if (emailData) {
      const transData = transformEmailReport(emailData);
      setPageData(transData);
    }
  }, [emailData]);

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

  useEffect(() => {
    if (!loading && emailData) {
      const transformedData = transformEmailReport(emailData);

      const emails = transformedData.emails;
      const currentEmails = useGlobalStore.getState().emails;
      if (JSON.stringify(currentEmails) !== JSON.stringify(emails)) {
        setPageData(transformedData);
        setGlobalStore("emails", currentEmails);
        console.log("Store after update:", useGlobalStore.getState().landlords);
      }
    }
  }, [emailData, loading, setGlobalStore]);

  const handleTableItemClick = (record: DataItem) => {
    setSelectedSMS(record as EmailRecord);
  };


  if (loading)
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
        //exports
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
                  At the moment, there are no landlord or landlady profiles
                  available for export. Once profile records are added to the
                  system, they will appear here and be available for download or
                  export.
                  <br />
                  <br />
                  <p>
                    This section will automatically populate with all available
                    data as soon as new landlord or landlady profiles are
                    created or imported into the platform.
                  </p>
                </p>
              }
            />
          )
        ) : (
          <CustomTable
            fields={emailTablefields}
            data={pageData?.emails || []}
            tableHeadClassName="h-[45px]"
            handleSelect={handleTableItemClick}
          />
        )}
      </section>

      <Modal
        state={{
          isOpen: modalOpen,
          setIsOpen: setModalOpen,
        }}
      >
        <ModalContent>
          <EmailModal {...(selectedSMS as EmailRecord)} />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EmailReport;
