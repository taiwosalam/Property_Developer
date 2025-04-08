"use client";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsListingsFilterOptionsWithDropdown,
  trackingTableFields,
} from "./data";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import {
  ActivityApiResponse,
  ActivityTable,
  transformActivityAData,
} from "./[userId]/types";
import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { ReportsRequestParams } from "../tenants/data";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { hasActiveFilters } from "../data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";

const TrackingReport = () => {
  const [branches, setBranches] = useState<BranchFilter[]>([]);
  const [branchAccountOfficers, setBranchAccountOfficers] = useState<
    BranchStaff[]
  >([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });
  const [propertyList, setPropertyList] = useState<PropertyFilter[]>([]);
  const { data: apiData } = useFetch<any>("branches");
  const { data: staff } = useFetch<any>(`report/staffs`);
  const { data: property } = useFetch<any>(`property/all`);
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as ReportsRequestParams,
  });
  const [activity, setActivity] = useState<ActivityTable[]>([]);
  const {
    data: activityData,
    loading,
    isNetworkError,
    error,
  } = useFetch<ActivityApiResponse>("report/activities", config);

  useEffect(() => {
    if (apiData) {
      setBranches(apiData.data);
    }
    if (staff) {
      const filterStaff = staff.data.filter(
        (staff: any) => staff.staff_role === "account officer"
      );
      setBranchAccountOfficers(filterStaff);
    }
    if (property) {
      setPropertyList(property.data);
    }
  }, [apiData, staff, property]);

  useEffect(() => {
    if (activityData) {
      setActivity(transformActivityAData(activityData));
    }
  }, [activityData]);

  const reportTenantFilterOption = [
    {
      label: "Account Officer",
      value: branchAccountOfficers.map((staff: any) => ({
        label: staff.user.name,
        value: staff.user.id.toString(),
      })),
    },
    {
      label: "Branch",
      value: branches.map((branch) => ({
        label: branch.branch_name,
        value: branch?.id.toString(),
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

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort_order: order },
    });
  };

  const handleAppliedFilter = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const accountOfficer = menuOptions["Account Officer"] || [];
    const branch = menuOptions["Branch"] || [];
    const property = menuOptions["Property"] || [];

    const queryParams: ReportsRequestParams = {
      page: 1,
      search: "",
    };

    if (accountOfficer.length > 0) {
      queryParams.account_officer_id = accountOfficer.join(",");
    }
    if (branch.length > 0) {
      queryParams.branch_id = branch.join(",");
    }
    if (property.length > 0) {
      queryParams.property_id = property.join(",");
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
    }
    setConfig({
      params: queryParams,
    });
  };

  const router = useRouter();

  const handleSelectTableItem = (item: DataItem) => {
    router.push(`/reports/tracking/${item.id}`);
    console.log(item);
  };

  if (loading)
    return <CustomLoader layout="page" pageTitle="Units Report" view="table" />;
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="Tracking"
        aboutPageModalData={{
          title: "Tracking",
          description: "This page contains a list of Tracking on the platform.",
        }}
        searchInputPlaceholder="Search for audit trail"
        handleSearch={handleSearch}
        onSort={handleSort}
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exportHref="/reports/tracking/export"
      />

      <section>
        {activity.length === 0 && !loading ? (
          !!config.params.search || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <EmptyList
                noButton
                title="No Staff Activities Report Available Yet

"
                body={
                  <p className="">
                    Currently, there are no staff activity reports available for
                    export. Once activity records are logged into the system,
                    they will appear here and be ready for download or export.
                    <br /> <br />
                    <p>
                      This section will automatically display all available
                      records related to staff activities as soon as they are
                      generated within the platform.
                    </p>
                  </p>
                }
              />
            </div>
          )
        ) : (
          <CustomTable
            fields={trackingTableFields}
            data={activity}
            tableHeadClassName="h-[45px]"
            handleSelect={handleSelectTableItem}
          />
        )}
      </section>
    </div>
  );
};

export default TrackingReport;
