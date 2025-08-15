"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

// Images
import { ExclamationMark } from "@/public/icons/icons";

// Imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DateRange } from "react-day-picker";
import SearchInput from "@/components/SearchInput/search-input";
import FilterButton from "@/components/FilterButton/filter-button";
import { DatePickerWithRange } from "@/components/dashboard/date-picker";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import AccountStatsCard from "@/components/Accounting/account-stats-card";
import {
  accountingVatOptionsWithDropdown,
  vatTableFields,
  vatTableData,
  VATPageState,
  initialVATPageState,
  VATFilterParams,
  VATAPIResponse,
  transformVATAPIResponse,
  getOtherCurrencyFromVats,
} from "./data";
import { useRouter } from "next/navigation";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import ExportButton from "@/components/reports/export-button";
import { FilterResult } from "@/components/Management/Landlord/types";
import dayjs from "dayjs";
import { AxiosRequestConfig } from "axios";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import { PropertyListResponse } from "../../management/rent-unit/[id]/edit-rent/type";
import useStaffRoles from "@/hooks/getStaffs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";
import TableLoading from "@/components/Loader/TableLoading";
import { useGlobalStore } from "@/store/general-store";
import ServerError from "@/components/Error/ServerError";
import CustomLoader from "@/components/Loader/CustomLoader";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { getOtherCurrency } from "../invoice/data";
import TableMenu from "@/components/Table/table-menu";
import { MenuItem } from "@mui/material";
import Link from "next/link";
import { usePersonalInfoStore } from "@/store/personal-info-store";

const Vat = () => {
  const router = useRouter();
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [pageData, setPageData] = useState<VATPageState>(initialVATPageState);
  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const {
    total_paid_vat,
    total_pending_vat,
    total_vat_created,
    percentage_change_paid,
    percentage_change_pending,
    percentage_change_total,
    vats,
  } = pageData;

  const isFilterApplied = useCallback(() => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  }, [appliedFilters]);

  const [search, setSearch] = useState("");
  const config: AxiosRequestConfig = useMemo(() => {
    // Determine date_from and date_to, prioritizing selectedDateRange
    const dateFrom = selectedDateRange?.from
      ? dayjs(selectedDateRange.from).format("YYYY-MM-DD")
      : appliedFilters.startDate
      ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
      : undefined;
    const dateTo = selectedDateRange?.to
      ? dayjs(selectedDateRange.to).format("YYYY-MM-DD")
      : appliedFilters.endDate
      ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
      : undefined;

    return {
      params: {
        from_date: dateFrom,
        to_date: dateTo,
        search: search,
        account_officer: appliedFilters.menuOptions["Account Officer"] || [],
        property_ids: appliedFilters.menuOptions["Property"] || [],
        date_filter: "custom",
      } as VATFilterParams,
    };
  }, [appliedFilters, search, selectedDateRange]); // Add selectedDateRange as dependency

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    // If FilterModal sets dates, clear selectedDateRange to avoid conflicts
    if (filters.startDate || filters.endDate) {
      setSelectedDateRange(undefined);
    }
  };
  // Conditionally set the URL only if BRANCH_ID is valid
  const fetchUrl =
    BRANCH_ID && BRANCH_ID !== 0 ? `/vat/list?branch_id=${BRANCH_ID}` : null;

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
  } = useFetch<VATAPIResponse>(fetchUrl, config);

  useEffect(() => {
    if (apiData) {
      const transformedVat = transformVATAPIResponse(apiData);
      const newVat = transformedVat.vats;
      const currentVat = useGlobalStore.getState()?.accounting_vat;
      if (JSON.stringify(currentVat) !== JSON.stringify(newVat)) {
        setGlobalStore("accounting_vat", newVat);
      }
      setPageData({ ...transformedVat, vats: newVat });
      setGlobalStore("accounting_vat_data", {
        ...transformedVat,
        vats: newVat,
      });
      // accounting_vat_data({ ...transformedVat, vats: newVat });
      // setPageData((x) => ({
      //   ...x,
      //   ...transformVATAPIResponse(apiData),
      // }));
    }
  }, [apiData, setPageData, setGlobalStore]);

  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/all");

  const propertyOptions = Array.isArray(propertyData?.data)
    ? [
        ...new Map(
          propertyData.data
            .filter((property: any) => property.units.length > 0)
            .map((property: any) => [
              property.title.toLowerCase(),
              {
                label: property.title,
                value: property.id.toString(),
              },
            ])
        ).values(),
      ]
    : [];
  const {
    getManagers,
    getStaffs,
    getAccountOfficers,
    loading: loadingStaffs,
    error: staffsError,
  } = useStaffRoles();
  const accountOfficers = getAccountOfficers();
  const accountOfficersOptions =
    accountOfficers?.map((o) => ({
      label: o.name,
      value: `${o.id}`,
    })) || [];

  const [timeRange, setTimeRange] = useState("90d");

  const handleDateChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    if (range?.from && range?.to) {
      setTimeRange("custom");
      // Clear appliedFilters dates to avoid overlap
      setAppliedFilters((prev) => ({
        ...prev,
        startDate: null,
        endDate: null,
      }));
    }
  };

  const calculateDateRange = (days: number) => {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - days);
    return { from: fromDate, to: now };
  };

  const handleSelectChange = (value: string) => {
    setTimeRange(value);
    if (value !== "custom") {
      const days =
        value === "90d" ? 90 : value === "30d" ? 30 : value === "7d" ? 7 : 1;
      setSelectedDateRange(calculateDateRange(days));
      // Clear appliedFilters dates when using predefined ranges
      setAppliedFilters((prev) => ({
        ...prev,
        startDate: null,
        endDate: null,
      }));
    }
  };

  const handleRowClick = (item: DataItem) => {
    router.push(`/manager/accounting/vat/${item.id}/PrintVat`);
  };

  const transformedTableData = vats.map((item) => ({
    ...item,
    name: (
      <p className="flex items-center whitespace-nowrap">
        <span>{item.name}</span>
        {item.badge_color && <BadgeIcon color={item.badge_color} />}
      </p>
    ),
    total_vat: (
      <p
        className={
          item.total_vat ? "text-status-success-3 dark:text-white" : ""
        }
      >
        {item.total_vat}
      </p>
    ),
  }));

  const otherCurrency = getOtherCurrencyFromVats(apiData?.data.vats || []);

  const handleMenuOpen = (item: DataItem, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedItemId(String(item.id));
    setAnchorEl(e.currentTarget);
    // console.log("item", item);
    // setInvoiceStatus(item.status);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
    // setInvoiceStatus("");
  };

  // Function to get the display label for the time range
  const getTimeRangeLabel = useCallback(() => {
    switch (timeRange) {
      case "90d":
        return "Last 3 months";
      case "30d":
        return "Last 30 days";
      case "7d":
        return "Last 7 days";
      case "1d":
        return "Yesterday";
      case "custom":
        if (selectedDateRange?.from && selectedDateRange?.to) {
          return `${dayjs(selectedDateRange.from).format(
            "MMM D, YYYY"
          )} - ${dayjs(selectedDateRange.to).format("MMM D, YYYY")}`;
        }
        return "Last 30 days";
      default:
        return "Last 30 days";
    }
  }, [timeRange, selectedDateRange]);

  // Store timeRangeLabel in global store whenever it changes
  useEffect(() => {
    const timeRangeLabel = getTimeRangeLabel();
    setGlobalStore("vatTimeRangeLabel", timeRangeLabel);
  }, [getTimeRangeLabel, setGlobalStore]);

  if (loading)
    return <CustomLoader pageTitle="V.A.T" view="table" layout="page" />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-10">
      <div className="custom-flex-col gap-6">
        <div className="flex gap-1 items-center">
          <h1 className="text-black dark:text-white text-2xl font-medium">
            V.A.T
          </h1>
          {/* <ExclamationMark /> */}
        </div>
        <div className="bg-white dark:bg-[#3C3D37] rounded-[8px] border border-opacity-20 border-[#BAC7D533] p-4 space-y-6">
          <div className="flex flex-wrap gap-y-4 items-center justify-between">
            <div
              className={`w-fit flex bg-[#F5F5F5] dark:bg-darkText-primary rounded-md items-center justify-center`}
            >
              <DatePickerWithRange
                selectedRange={selectedDateRange}
                onDateChange={handleDateChange}
              />
              <Select value={timeRange} onValueChange={handleSelectChange}>
                <SelectTrigger
                  className="md:w-full lg:w-[120px] rounded-lg sm:ml-auto"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Last 3 months" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                  <SelectItem value="1d" className="rounded-lg">
                    Yesterday
                  </SelectItem>
                  <SelectItem value="custom" className="rounded-lg">
                    Custom
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <SearchInput
                placeholder="Search for Vat"
                className="max-w-[255px]"
                onSearch={handleSearch}
              />
              <Modal>
                <ModalTrigger asChild>
                  <FilterButton />
                </ModalTrigger>
                <ModalContent>
                  <FilterModal
                    filterOptionsMenu={[
                      ...(propertyOptions.length > 0
                        ? [
                            {
                              label: "Property",
                              value: propertyOptions,
                            },
                          ]
                        : []),
                      ...(accountOfficersOptions.length > 0
                        ? [
                            {
                              label: "Account Officer",
                              value: accountOfficersOptions,
                            },
                          ]
                        : []),
                    ]}
                    handleFilterApply={handleFilterApply}
                    isDateTrue
                    appliedFilters={appliedFilters}
                  />
                </ModalContent>
              </Modal>
              <div className="flex items-center gap-2">
                <ExportButton
                  type="pdf"
                  href="/manager/accounting/vat/export"
                />
                <ExportButton
                  fileLabel="Accounting Vat"
                  data={transformedTableData}
                  type="csv"
                />
              </div>
            </div>
          </div>
          <div className="account-card-container">
            <AccountStatsCard
              className="!min-w-[320px] shrink-0"
              title="Total Vat Paid"
              balance={total_vat_created}
              percentage={percentage_change_total}
              variant="blueIncoming"
              otherCurrency={otherCurrency}
              timeRangeLabel={getTimeRangeLabel()}
              trendDirection={percentage_change_total < 0 ? "down" : "up"}
              trendColor={percentage_change_total < 0 ? "red" : "green"}
            />
          </div>
        </div>
      </div>
      {vats.length === 0 && !silentLoading ? (
        config.params.search || isFilterApplied() ? (
          <SearchError />
        ) : (
          <EmptyList
            noButton
            title="No VAT yet"
            body={
              <p>
                This section will display VAT records once they are generated.
                VAT records are created based on transactions or activities that
                are subject to Value Added Tax.
                <br />
                <br />
                To start generating VAT records, ensure that you have entered
                the necessary data, such as transactions or property items,
                depending on your setup.
                <br />
                <br />
              </p>
            }
          />
        )
      ) : silentLoading ? (
        <TableLoading />
      ) : (
        <>
          <CustomTable
            fields={vatTableFields}
            data={transformedTableData}
            tableHeadStyle={{ height: "76px" }}
            tableHeadCellSx={{ fontSize: "1rem" }}
            tableBodyCellSx={{
              fontSize: "1rem",
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
            // handleSelect={handleRowClick}
            onActionClick={(item, e) => {
              handleMenuOpen(item, e as React.MouseEvent<HTMLElement>);
            }}
          />
          <TableMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose} disableRipple>
              <Link
                href={`/manager/accounting/vat/${selectedItemId}/PrintVat`}
                className="w-full text-left"
              >
                Preview
              </Link>
            </MenuItem>
          </TableMenu>
        </>
      )}
    </div>
  );
};

export default Vat;
