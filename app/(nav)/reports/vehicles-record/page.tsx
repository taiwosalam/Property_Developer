"use client";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { vehicleRecordReportTableFields } from "./data";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { ReportsRequestParams } from "../tenants/data";
import { AxiosRequestConfig } from "axios";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import {
  transformVehicleRecordsData,
  VehicleRecordsResponse,
  VehicleRecordsType,
} from "./types";
import { hasActiveFilters } from "../data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";

const VehiclesRecordReport = () => {
  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });
  const [branches, setBranches] = useState<BranchFilter[]>([]);
  const [vehiclesRecordTableData, setVehiclesRecordTableData] = useState<
    VehicleRecordsType[]
  >([]);
  const [branchAccountOfficers, setBranchAccountOfficers] = useState<
    BranchStaff[]
  >([]);
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

  const {
    data: vehicleData,
    loading,
    silentLoading,
    error,
    isNetworkError,
  } = useFetch<VehicleRecordsResponse>("report/vehicle-records", config);

  useEffect(() => {
    if (vehicleData) {
      setVehiclesRecordTableData(transformVehicleRecordsData(vehicleData));
    }
  }, [vehicleData]);


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
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD");
    }
    setConfig({
      params: queryParams,
    });
  };

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Vehicle Report" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <FilterBar
        azFilter
        isDateTrue
        exports
        pageTitle="vehicle records"
        aboutPageModalData={{
          title: "vehicle records",
          description:
            "This page contains a list of vehicle records on the platform.",
        }}
        searchInputPlaceholder="Search for vehicle records"
        handleSearch={handleSearch}
        onSort={handleSort}
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exportHref="/reports/vehicles-record/export"
        xlsxData={vehiclesRecordTableData}
        fileLabel={`Vehicle Reports`}
      />

      <section>
        {vehiclesRecordTableData.length === 0 && !loading ? (
          !!config.params.search || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <div className="col-span-full text-left py-8 text-gray-500">
              <EmptyList
                noButton
                title="No Vehicle Records Available Yet
             "
                body={
                  <p className="">
                    At the moment, there are no vehicle records available for
                    export. Once vehicle data is added to the system, it will
                    appear here and be available for download or export. <br />{" "}
                    <br />
                    <p>
                      This section will automatically populate with all
                      available vehicle records as soon as new entries are
                      created or imported into the platform.
                    </p>
                  </p>
                }
              />
            </div>
          )
        ) : (
          <CustomTable
            fields={vehicleRecordReportTableFields}
            data={vehiclesRecordTableData}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
    </div>
  );
};

export default VehiclesRecordReport;
