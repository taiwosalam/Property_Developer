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
  getOtherCurrency,
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
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { useGlobalStore } from "@/store/general-store";
import ServerError from "@/components/Error/ServerError";
import useStaffRoles from "@/hooks/getStaffs";
import { parseHTML } from "@/utils/parse-html";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";

const AccountingInvoicePage = () => {
  const isDarkMode = useDarkMode();
  const searchParams = useSearchParams();
  const {
    setGlobalInfoStore,
    otherCurrencies,
    invoiceTimeRange,
    selectedDateRange,
    timeRangeLabel,
  } = useGlobalStore((s) => ({
    setGlobalInfoStore: s.setGlobalInfoStore,
    otherCurrencies: s.otherCurrencies,
    invoiceTimeRange: s.invoiceTimeRange,
    selectedDateRange: s.selectedDateRange,
    timeRangeLabel: s.timeRangeLabel,
  }));
  // const [selectedDateRange, setSelectedDateRange] = useState<
  //   DateRange | undefined
  // >();
  const [currentPage, setCurrentPage] = useState(1);
  const [inoiceStatus, setInvoiceStatus] = useState("");
  const [invoiceData, setInvoiceData] = useState<TransformedInvoiceData | null>(
    null
  );

  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/all");

  const {
    getManagers,
    getStaffs,
    getAccountOfficers,
    loading: loadingStaffs,
    error: staffsError,
  } = useStaffRoles();
  const accountOfficers = getAccountOfficers();

  const propertyOptions = Array.isArray(propertyData?.data)
    ? [
        ...new Map(
          propertyData.data
            .filter((property: any) => property.units.length > 0)
            .map((property: any) => [
              property.title.toLowerCase(),
              {
                label: property.title.toLowerCase(),
                value: property.id.toString(),
              },
            ])
        ).values(),
      ]
    : [];

  // const propertyOptions =
  //   propertyData?.data.map((p) => ({
  //     value: `${p.id}`,
  //     label: p.title,
  //   })) || [];

  const accountOfficersOptions = Array.isArray(accountOfficers)
    ? [
        ...new Map(
          accountOfficers.map((officer: any) => [
            officer.name.toLowerCase(),
            {
              label: officer.name.toLowerCase(),
              value: officer.id.toString(),
            },
          ])
        ).values(),
      ]
    : [];

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");

  // Initialize appliedFilters with status from URL
  const initialFilters: FilterResult = {
    options: [],
    menuOptions: searchParams.get("status")
      ? { Status: [searchParams.get("status")!] }
      : {},
    startDate: null,
    endDate: null,
  };

  const [appliedFilters, setAppliedFilters] =
    useState<FilterResult>(initialFilters);

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
    // date range from the Select/DatePicker if available,
    // otherwise use the appliedFilters date (if both start and end are defined)
    const fromDate = selectedDateRange?.from
      ? dayjs(selectedDateRange.from).format("YYYY-MM-DD")
      : appliedFilters.startDate
      ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
      : undefined;

    const toDate = selectedDateRange?.to
      ? dayjs(selectedDateRange.to).format("YYYY-MM-DD")
      : appliedFilters.endDate
      ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
      : undefined;

    const Status = appliedFilters.menuOptions["Status"]?.[0];

    const params: InvoiceRequestParams = {
      from_date: fromDate,
      to_date: toDate,
      date_filter: "custom",
      search,
      property_ids: appliedFilters.menuOptions["Property"] || [],
      account_officer: appliedFilters.menuOptions["Account Officer"] || [],
      sort_by: sort,
      status: Status,
    };

    return { params };
  }, [appliedFilters, search, sort, selectedDateRange]);

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const { data, error, loading, isNetworkError, silentLoading } =
    useFetch<InvoiceListResponse>("/invoice/list", config);

  useEffect(() => {
    if (data) {
      const transformed = transformInvoiceData(data);
      const newInvoices = transformed.invoices;
      const newStats = transformed.statistics;
      const currentInvoices = useGlobalStore.getState()?.accounting_invoices;
      const currentStats = useGlobalStore.getState()?.accounting_statistics;
      if (JSON.stringify(currentInvoices) !== JSON.stringify(newInvoices)) {
        setGlobalInfoStore("accounting_invoices", newInvoices);
      }
      if (JSON.stringify(currentStats) !== JSON.stringify(newStats)) {
        setGlobalInfoStore("accounting_statistics", newStats);
      }
      setInvoiceData({ ...transformed, invoices: newInvoices });
    }
  }, [data, setGlobalInfoStore]);

  // Effect to update otherCurrencies
  useEffect(() => {
    if (invoiceData?.invoices) {
      const otherCurrencyTotal = getOtherCurrency(
        invoiceData.invoices,
        selectedDateRange,
        "total_amount"
      );
      const otherCurrencyPaid = getOtherCurrency(
        invoiceData.invoices,
        selectedDateRange,
        "amount_paid"
      );
      const otherCurrencyPending = getOtherCurrency(
        invoiceData.invoices,
        selectedDateRange,
        "balance_due"
      );

      const newOtherCurrencies = {
        total: otherCurrencyTotal,
        paid: otherCurrencyPaid,
        pending: otherCurrencyPending,
      };

      const currentOtherCurrencies = useGlobalStore.getState()?.otherCurrencies;

      if (
        JSON.stringify(currentOtherCurrencies) !==
        JSON.stringify(newOtherCurrencies)
      ) {
        setGlobalInfoStore("otherCurrencies", newOtherCurrencies);
      }
    }
  }, [invoiceData, selectedDateRange, setGlobalInfoStore]);

  // Effect to update timeRangeLabel
  useEffect(() => {
    const newTimeRangeLabel = (() => {
      switch (invoiceTimeRange) {
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
    })();

    if (newTimeRangeLabel !== timeRangeLabel) {
      setGlobalInfoStore("timeRangeLabel", newTimeRangeLabel);
    }
  }, [invoiceTimeRange, selectedDateRange, timeRangeLabel, setGlobalInfoStore]);

  const [state, setState] = useState<{ selectedState: string }>({
    selectedState: "",
  });

  const setSelectedState = (selectedState: string) => {
    setState((state) => ({ ...state, selectedState }));
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setGlobalInfoStore("selectedDateRange", range);
    if (range?.from && range?.to) {
      setGlobalInfoStore("timeRange", "custom");
    }
  };

  const calculateDateRange = (days: number) => {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - days);
    return { from: fromDate, to: now };
  };

  const handleSelectChange = (value: string) => {
    setGlobalInfoStore("invoiceTimeRange", value);
    if (value !== "custom") {
      const days =
        value === "90d" ? 90 : value === "30d" ? 30 : value === "7d" ? 7 : 1;
      setGlobalInfoStore("selectedDateRange", calculateDateRange(days));
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isAutoGenerated, setIsAutoGenerated] = useState<boolean>(false);

  const handleMenuOpen = (item: DataItem, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedItemId(String(item.id));
    setAnchorEl(e.currentTarget);
    setIsAutoGenerated(item.is_auto);
    // Extract the actual status string from the React element
    const statusString =
      item.status && typeof item.status === "object" && "props" in item.status
        ? item.status.props.children
        : item.status;
    setInvoiceStatus(statusString);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
    setInvoiceStatus("");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Function to get the display label for the time range
  const getTimeRangeLabel = useCallback(() => {
    switch (invoiceTimeRange) {
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
        return "Last 30 days"; // Fallback for any unexpected value
    }
  }, [invoiceTimeRange, selectedDateRange]);

  if (loading)
    return <CustomLoader layout="page" view="table" pageTitle="Invoices" />;
  if (error) return <ServerError error={error} />;
  if (isNetworkError) return <NetworkError />;
  if (!invoiceData) return <div>No invoice data available.</div>;

  const { statistics, invoices } = invoiceData;
  const transformedInvoiceTableData = invoices.map((i) => ({
    ...i,
    client_name: (
      <p className="flex items-center whitespace-nowrap">
        <span>{i.client_name}</span>
        {i.badge_color && <BadgeIcon color={i.badge_color} />}
      </p>
    ),
    payment_reason: (
      <p className="flex items-center whitespace-nowrap">
        <span> {parseHTML(i.payment_reason)}</span>
      </p>
    ),
    status: (
      <span
        className={clsx({
          "text-status-success-3":
            i.status.toLowerCase() === "paid" ||
            i.status.toLowerCase() === "partially paid",
          "text-orange-normal": i.status.toLowerCase() === "pending",
          "text-status-error-primary": i.status.toLowerCase() === "cancel",
        })}
      >
        {i.status}
      </span>
    ),
  }));

  const statusOptions = [
    { label: "Cancel", value: "cancel" },
    { label: "Part Payment", value: "partially_paid" },
    { label: "Fully Paid", value: "paid" },
    { label: "Unpaid", value: "pending" },
  ];

  // const otherCurrency = getOtherCurrency(invoices);
  // Calculate otherCurrency for each card
  const otherCurrencyTotal = getOtherCurrency(
    invoices,
    selectedDateRange,
    "total_amount"
  );
  const otherCurrencyPaid = getOtherCurrency(
    invoices,
    selectedDateRange,
    "amount_paid"
  );
  const otherCurrencyPending = getOtherCurrency(
    invoices,
    selectedDateRange,
    "balance_due"
  );
  const IS_PAID =
    inoiceStatus?.toLowerCase() === "paid" ||
    inoiceStatus?.toLowerCase() === "partially paid";
  // const IS_PAID = false;

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <div className="w-full pt-4 flex items-center justify-between">
          <div className="font-medium text-2xl flex items-center space-x-1">
            <span className="text-2xl font-bold">Invoices</span>
          </div>
          <Button
            href="/accounting/invoice/create-invoice"
            type="button"
            className="page-header-button"
          >
            + create invoice
          </Button>

          {/* <Modal>
            <ModalTrigger asChild>
              <Button type="button" className="page-header-button">
                + create invoice
              </Button>
            </ModalTrigger>
            <ModalContent>
              <CreateInvoiceModal />
            </ModalContent>
          </Modal> */}
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
              <Select
                value={invoiceTimeRange}
                onValueChange={handleSelectChange}
              >
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
                      {
                        radio: true,
                        label: "Status",
                        value: statusOptions,
                      },
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
                              label: "Account Manager",
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
                <ExportButton type="pdf" href="/accounting/invoice/export" />
                <ExportButton
                  fileLabel="Invoice"
                  data={transformedInvoiceTableData}
                  type="csv"
                />
              </div>
            </div>
          </div>
          <div className="account-card-container">
            <AccountStatsCard
              className="!min-w-[320px] shrink-0"
              title="Total Invoice Created"
              balance={statistics.total_receipt}
              trendDirection={
                statistics.percentage_change_total < 0 ? "down" : "up"
              }
              // otherCurrency={otherCurrency}
              otherCurrency={otherCurrencyTotal}
              trendColor={
                statistics.percentage_change_total < 0 ? "red" : "green"
              }
              variant="blueIncoming"
              percentage={statistics.percentage_change_total}
              timeRangeLabel={getTimeRangeLabel()}
              noSymbol
            />
            <AccountStatsCard
              className="!min-w-[320px]  py-3 shrink-0"
              title="Total Paid Invoice"
              balance={statistics.total_paid_receipt}
              trendDirection={
                statistics.percentage_change_paid < 0 ? "down" : "up"
              }
              otherCurrency={otherCurrencyPaid}
              trendColor={
                statistics.percentage_change_paid < 0 ? "red" : "green"
              }
              variant="greenIncoming"
              percentage={statistics.percentage_change_paid}
              timeRangeLabel={getTimeRangeLabel()}
              noSymbol
            />
            <AccountStatsCard
              className="!min-w-[320px] shrink-0"
              title="Total Pending Invoice"
              balance={statistics.total_pending_receipt}
              otherCurrency={otherCurrencyPending}
              trendDirection={
                statistics.percentage_change_pending < 0 ? "down" : "up"
              }
              trendColor={
                statistics.percentage_change_pending < 0 ? "red" : "green"
              }
              variant="yellowCard"
              percentage={statistics.percentage_change_pending}
              timeRangeLabel={getTimeRangeLabel()}
              noSymbol
            />
          </div>
        </div>
      </div>
      {invoices.length === 0 && !silentLoading ? (
        config.params.search || isFilterApplied() ? (
          <SearchError />
        ) : (
          <section>
            <EmptyList
              noButton
              // buttonText="+ create invoice"
              // buttonLink="/accounting/invoice/create-invoice"
              // modalContent={<CreateInvoiceModal />}
              title="You haven't created any invoices yet."
              body={
                <p>
                  You can either create a new invoice manually or allow the
                  system to generate an invoice automatically for a new rent.
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
              data={transformedInvoiceTableData}
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
            <>
              {!IS_PAID && (
                <MenuItem onClick={handleMenuClose} disableRipple>
                  <Link
                    href={`/accounting/invoice/${selectedItemId}/manage`}
                    className="w-full text-left"
                  >
                    Manage
                  </Link>
                </MenuItem>
              )}
              {/* <MenuItem onClick={handleMenuClose} disableRipple>
                  <Link
                    href={`/accounting/invoice/${selectedItemId}/add-payment`}
                    className="w-full text-left"
                  >
                    Add Payment
                  </Link>
                </MenuItem> */}
            </>
            {/* )} */}
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
