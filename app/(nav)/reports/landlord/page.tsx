"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsLandlordsFilterOptionsWithDropdown,
  landlordsReportTableFields,
  landlordsReportTableData,
  // LandlordsReport,
  LandlordsApiResponse,
  transformLandlordsData,
} from "./data";
import { type LandlordsReport } from "./data";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
import { ReportsRequestParams } from "../tenants/data";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import { hasActiveFilters } from "../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import SearchError from "@/components/SearchNotFound/SearchNotFound";

const LandlordsReport = () => {
  const [branches, setBranches] = useState<BranchFilter[]>([]);
  const [branchAccountOfficers, setBranchAccountOfficers] = useState<
    BranchStaff[]
  >([]);
  const [propertyList, setPropertyList] = useState<PropertyFilter[]>([]);
  const { data: apiData } = useFetch<any>("branches");
  const { data: staff } = useFetch<any>(`report/staffs`);
  const { data: property } = useFetch<any>(`property/all`);

  const [landlords_report, setLandlords_report] = useState<LandlordsReport>({
    total_landlords: 0,
    monthly_landlords: 0,
    landlords: [],
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

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

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as ReportsRequestParams,
  });

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
    console.log("Searching...");
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

  const { total_landlords, monthly_landlords, landlords } = landlords_report;

  const { data, loading, error, isNetworkError } =
    useFetch<LandlordsApiResponse>("/report/landlords", config);

  useEffect(() => {
    if (data) {
      setLandlords_report(transformLandlordsData(data));
    }
  }, [data]);

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Tenants/Occupants" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total"
          newData={monthly_landlords}
          total={total_landlords}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="Landlord/Landlady"
        aboutPageModalData={{
          title: "Landlord/Landlady",
          description:
            "This page contains a list of Landlord/Landlady on the platform.",
        }}
        searchInputPlaceholder="Search for Landlord/Landlady"
        handleSearch={handleSearch}
        onSort={handleSort}
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exportHref="/reports/landlord/export"
        xlsxData={landlords}
        fileLabel={"Landlord & Landlady Reports"}
      />
      <section>
        {landlords.length === 0 && !loading ? (
          !!config.params.search || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <div className="col-span-full text-left py-8 text-gray-500">
              <EmptyList
                noButton
                title="No Landlord or Landlady Profiles Available Yet
"
                body={
                  <p className="">
                    At the moment, there are no landlord or landlady profiles
                    available for export. Once profile records are added to the
                    system, they will appear here and be available for download
                    or export. <br /> <br />
                    <p>
                      This section will automatically populate with all
                      available data as soon as new landlord or landlady
                      profiles are created or imported into the platform.
                    </p>
                  </p>
                }
              />
            </div>
          )
        ) : (
          <CustomTable
            fields={landlordsReportTableFields}
            // data={landlordsReportTableData}
            data={landlords}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
    </div>
  );
};

export default LandlordsReport;
