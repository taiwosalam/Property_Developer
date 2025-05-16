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
import { useCallback, useEffect, useState } from "react";
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
import { Activity } from "lucide-react";
import { SMSFields, SponsorFields } from "../../settings/add-on/data";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import {
  SMSTable,
  SmsTransactionResponse,
  transSMSTransactionTable,
} from "@/components/Settings/sponsor_data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

const AddsOnSMSRecord = () => {
  const { company_id } = usePersonalInfoStore();
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: { page: 1, search: "" } as ReportsRequestParams,
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const [smsTransactionData, setSMSTransactionData] = useState<SMSTable | null>(
    null
  );

  const {
    data: smsTransactions,
    loading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<SmsTransactionResponse>(`sms/transactions`, config);

  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const filteredTransactions = useGlobalStore((s) => s.sms_transaction);

  useRefetchOnEvent("buySMS", () => refetch({ silent: true }));

  const handleSearch = (query: string) => {
    setConfig({ params: { ...config.params, search: query } });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({ params: { ...config.params, sort_order: order } });
  };

  useEffect(() => {
    if (smsTransactions) {
      const transformData = transSMSTransactionTable(smsTransactions);
      setSMSTransactionData(transformData);
    }
  }, [smsTransactions]);

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
    if (!loading && smsTransactions) {
      const transformedData = transSMSTransactionTable(smsTransactions);
      const smsTransaction = transformedData;
      const currentLandlords = useGlobalStore.getState().sms_transaction;
      if (
        JSON.stringify(currentLandlords) !== JSON.stringify(smsTransactions)
      ) {
        setGlobalStore("sms_transaction", smsTransaction);
      }
    }
  }, [smsTransactions, loading, setGlobalStore]);
  const searchParams = useSearchParams();
  const search = searchParams.get("b");

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Landlord/Landlady" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <FilterBar
        exports
        isDateTrue
        onBack={search ? true : false}
        pageTitle="Adds-On SMS"
        aboutPageModalData={{
          title: "Adds-On SMS",
          description: "This page contains a list of sms units history",
        }}
        searchInputPlaceholder="Search for audit trail"
        handleFilterApply={handleAppliedFilter}
        //={() => {}}
        //onSort={handleSearch}
        handleSearch={handleSearch}
        //filterOptionsMenu={() => {}}
        hasGridListToggle={false}
        exportHref="/reports/adds-on-sms/export"
        xlsxData={filteredTransactions?.data.map((activity) => ({
          ...activity,
        }))}
        fileLabel={"Activity Reports"}
      />
      <section>
        {smsTransactionData && smsTransactionData.data.length === 0 && !loading ? (
          !!config.params.search ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Property Data Available Yet"
              body={
                <p>
                  Currently, there is no property data available for export.
                  Once data is added to the system, they will be displayed here
                  and ready for download or export.
                  <br />
                  <br />
                  <p>
                    This section will automatically update to show all available
                    property records as they are created or imported into the
                    platform.
                  </p>
                </p>
              }
            />
          )
        ) : (
          <CustomTable
            fields={SMSFields}
            data={smsTransactionData ? smsTransactionData?.data : []}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
    
    </div>
  );
};

export default AddsOnSMSRecord;
