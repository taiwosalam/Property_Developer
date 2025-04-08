"use client";

import CreateInvoiceModal from "@/components/Accounting/invoice/CreateInvoiceModal";
import AccountStatsCard from "@/components/Accounting/account-stats-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { DatePickerWithRange } from "@/components/dashboard/date-picker";
import FilterButton from "@/components/FilterButton/filter-button";
import Button from "@/components/Form/Button/button";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import SearchInput from "@/components/SearchInput/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExclamationMark } from "@/public/icons/icons";
import ExportButton from "@/components/reports/export-button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  accountingInvoiceOptionsWithDropdown,
  invoiceTableFields,
  invoiceTableData,
  transformInvoiceData,
} from "./data";
import Link from "next/link";
import CustomTable from "@/components/Table/table";
import MenuItem from "@mui/material/MenuItem";
import type { DataItem } from "@/components/Table/types";
import useDarkMode from "@/hooks/useCheckDarkMode";
import TableMenu from "@/components/Table/table-menu";
import CustomLoader from "@/components/Loader/CustomLoader";
import { AxiosRequestConfig } from "axios";
import {
  InvoiceListResponse,
  InvoiceRequestParams,
  TransformedInvoiceData,
} from "./types";
import { FilterResult } from "@/components/Management/Landlord/types";
import useFetch from "@/hooks/useFetch";
import dayjs from "dayjs";
import NetworkError from "@/components/Error/NetworkError";
import { PropertyListResponse } from "../../management/rent-unit/[id]/edit-rent/type";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";
import TableLoading from "@/components/Loader/TableLoading";

const AccountingInvoicePage = () => {
  const isDarkMode = useDarkMode();
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >();
  const [currentPage, setCurrentPage] = useState(1);
  const [invoiceData, setInvoiceData] = useState<TransformedInvoiceData | null>(
    null
  );

  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/all");

  const propertyOptions =
    propertyData?.data.map((p) => ({
      value: `${p.id}`,
      label: p.title,
    })) || [];

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const isFilterApplied = useCallback(() => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  }, [appliedFilters]);

  const config: AxiosRequestConfig = useMemo(() => {
    const fromDate = appliedFilters.startDate
      ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
      : undefined;

    const toDate = appliedFilters.endDate
      ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
      : undefined;

    const params: InvoiceRequestParams = {
      from_date: fromDate,
      to_date: toDate,
      search,
      property_ids: appliedFilters.menuOptions["Property"] || [],
      account_officer: appliedFilters.menuOptions["Account Officer"] || [],
      sort_by: sort,
    };

    return { params };
  }, [appliedFilters, search, sort]);

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleSort = (order: "asc" | "desc") => {
    setSort(order);
  };

  const { data, error, loading, isNetworkError, silentLoading } =
    useFetch<InvoiceListResponse>("/invoice/list", config);

  useEffect(() => {
    if (data) {
      const transformed = transformInvoiceData(data);
      setInvoiceData(transformed);
    }
  }, [data]);

  const [state, setState] = useState<{ selectedState: string }>({
    selectedState: "",
  });

  const setSelectedState = (selectedState: string) => {
    setState((state) => ({ ...state, selectedState }));
  };

  const [timeRange, setTimeRange] = useState("90d");

  const handleDateChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    // If the user selects a custom range, set the timeRange to "custom"
    if (range?.from && range?.to) {
      setTimeRange("custom");
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
    }
  };

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading)
    return <CustomLoader layout="page" view="table" pageTitle="Invoices" />;
  if (error) return <div>Error loading invoice data.</div>;
  if (!invoiceData) return <div>No invoice data available.</div>;
  if (isNetworkError) return <NetworkError />;

  const { statistics, invoices } = invoiceData;

  // console.log("stats", invoices)

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <div className="w-full flex items-center justify-between">
          <div className="font-medium text-2xl flex items-center space-x-1">
            <span className="text-2xl font-bold">Invoices</span>
          </div>
          <Modal>
            <ModalTrigger asChild>
              <Button type="button" className="page-header-button">
                + create invoice
              </Button>
            </ModalTrigger>
            <ModalContent>
              <CreateInvoiceModal />
            </ModalContent>
          </Modal>
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
                onSearch={handleSearch}
                placeholder="Search for Invoice"
                className="max-w-[255px]"
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
                      ...(propertyOptions.length > 0
                        ? [
                            {
                              label: "Account Officer",
                              value: propertyOptions,
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
                <ExportButton type="pdf" href="/accounting/invoice/export" />
                <ExportButton type="csv" href="/accounting/invoice/export" />
              </div>
            </div>
          </div>
          <AutoResizingGrid gap={24} minWidth={300}>
            <AccountStatsCard
              title="Total Invoice Created"
              balance={statistics.total_receipt}
              trendDirection="up"
              trendColor="green"
              variant="blueIncoming"
              percentage={statistics.percentage_change_total}
            />
            <AccountStatsCard
              title="Total Paid Invoice"
              balance={statistics.total_receipt}
              trendDirection="down"
              trendColor="red"
              variant="greenIncoming"
              percentage={statistics.percentage_change_paid}
            />
            <AccountStatsCard
              title="Total Pending Invoice"
              balance={statistics.total_pending_receipt}
              trendDirection="down"
              trendColor="red"
              variant="yellowCard"
              percentage={Number(statistics.total_pending_receipt)}
            />
          </AutoResizingGrid>
        </div>
      </div>
      {invoices.length === 0 && !silentLoading ? (
        config.params.search || isFilterApplied() ? (
          <SearchError />
        ) : (
          <section>
            <EmptyList
              buttonText="+ new invoice"
              buttonLink="#"
              title="You do not have any disbursements yet"
              body={
                <p>
                  Create a new invoice by clicking on the &rqous;+ new
                  invoice&rqous; button.
                </p>
              }
            />
          </section>
        )
      ) : (
        <>
          {silentLoading ? (
            <TableLoading />
          ) : (
            <CustomTable
              fields={invoiceTableFields}
              data={invoices}
              tableHeadStyle={{ height: "76px" }}
              tableHeadCellSx={{ fontSize: "1rem" }}
              tableBodyCellSx={{
                fontSize: "1rem",
                paddingTop: "12px",
                paddingBottom: "12px",
              }}
              onActionClick={(item, e) => {
                handleMenuOpen(item, e as React.MouseEvent<HTMLElement>);
              }}
            />
          )}
          <TableMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose} disableRipple>
              <Link
                href={`/accounting/invoice/${selectedItemId}/manage`}
                className="w-full text-left"
              >
                Manage
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} disableRipple>
              <Link
                href={`/accounting/invoice/${selectedItemId}/add-payment`}
                className="w-full text-left"
              >
                Add Payment
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} disableRipple>
              <Link
                href={`/accounting/invoice/${selectedItemId}/print-invoice`}
                className="w-full text-left"
              >
                Preview
              </Link>
            </MenuItem>
          </TableMenu>
        </>
      )}
    </section>
  );
};

export default AccountingInvoicePage;
