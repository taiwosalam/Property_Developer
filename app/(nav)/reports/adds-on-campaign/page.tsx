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
import {
  CampaignFields,
  FeatureFields,
  SponsorFields,
} from "../../settings/add-on/data";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import {
  CampaignHistoryResponse,
  ICampaignTable,
  transformCampaignData,
} from "@/components/Settings/sponsor_data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

const AddsOnCampaignRecord = () => {
  const { company_id } = usePersonalInfoStore();
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: { page: 1, search: "" } as ReportsRequestParams,
  });
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const filteredCampaign = useGlobalStore((s) => s.campaign_history);

  const [campaignTable, setCampaignTable] = useState<ICampaignTable[] | null>(
    null
  );

  const {
    data: campaignData,
    refetch,
    loading,
    isNetworkError,
    error,
  } = useFetch<CampaignHistoryResponse>(
    company_id ? `campaigns/${company_id}` : null,
    config
  );
  useRefetchOnEvent("companyCampaign", () => refetch({ silent: true }));

  useEffect(() => {
    if (campaignData) {
      const transData = transformCampaignData(campaignData);
      setCampaignTable(transData);
    }
  }, [campaignData]);

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

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

  useEffect(() => {
    if (!loading && campaignData) {
      const transformedData = transformCampaignData(campaignData);
      const campaignHistory = transformedData;
      const currentCampaign = useGlobalStore.getState().sms_transaction;
      if (JSON.stringify(currentCampaign) !== JSON.stringify(campaignHistory)) {
        setGlobalStore("campaign_history", campaignHistory);
      }
    }
  }, [campaignData, loading, setGlobalStore]);

  const searchParams = useSearchParams();
  const search = searchParams.get("b");

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Add-On Campaign" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <FilterBar
        exports
        isDateTrue
        onBack={search ? true : false}
        pageTitle="Adds-On Campaign"
        aboutPageModalData={{
          title: "Adds-On Campaign",
          description: "This page contains a list of campaign history",
        }}
        searchInputPlaceholder="Search for campaign history"
        handleFilterApply={handleAppliedFilter}
        //={() => {}}

        handleSearch={handleSearch}
        //filterOptionsMenu={() => {}}
        hasGridListToggle={false}
        exportHref="/reports/adds-on-feature/export"
        xlsxData={filteredCampaign?.map((activity) => ({
          ...activity,
        }))}
        fileLabel={"Campaign Reports"}
      />
      <section>
        <CustomTable
          fields={CampaignFields}
          data={campaignTable ? campaignTable : []}
          tableHeadClassName="h-[45px]"
        />
      </section>
    </div>
  );
};

export default AddsOnCampaignRecord;
