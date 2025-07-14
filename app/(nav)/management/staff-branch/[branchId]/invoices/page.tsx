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
import { LocationIcon } from "@/public/icons/icons";
import ExportButton from "@/components/reports/export-button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  invoiceTableFields,
  transformInvoiceData,
  getOtherCurrency,
} from "@/app/(nav)/accounting/invoice/data";
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
  TransformedInvoiceData,
} from "@/app/(nav)/accounting/invoice/types";
import useFetch from "@/hooks/useFetch";
import dayjs from "dayjs";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import useBranchStore from "@/store/branch-store";
import EmptyList from "@/components/EmptyList/Empty-List";
import TableLoading from "@/components/Loader/TableLoading";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { parseHTML } from "@/utils/parse-html";
import clsx from "clsx";
import { useParams } from "next/navigation";

const BranchInvoicePage = () => {
  const isDarkMode = useDarkMode();
  const { branch } = useBranchStore();
  const { branchId } = useParams();
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");
  const [appliedFilters, setAppliedFilters] = useState<any>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });
  const [timeRange, setTimeRange] = useState("90d");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Set up API parameters, including branch_id
  const config: AxiosRequestConfig = useMemo(() => {
    const fromDate = selectedDateRange?.from
      ? dayjs(selectedDateRange.from).format("YYYY-MM-DD")
      : undefined;
    const toDate = selectedDateRange?.to
      ? dayjs(selectedDateRange.to).format("YYYY-MM-DD")
      : undefined;
    return {
      params: {
        from_date: fromDate,
        to_date: toDate,
        date_filter: "custom",
        search,
        sort_by: sort,
        branch_id: branch?.id, // IMPORTANT: filter by branch
      },
    };
  }, [selectedDateRange, search, sort, branch?.id]);

  // Fetch branch invoices
  const { data, error, loading, isNetworkError, silentLoading } =
    useFetch<InvoiceListResponse>("/invoice/list?branch_id=" + branch.branch_id, config);

  // Transform and store data for table/cards
  const [invoiceData, setInvoiceData] = useState<TransformedInvoiceData | null>(
    null
  );
  useEffect(() => {
    if (data) {
      const transformed = transformInvoiceData(data);
      setInvoiceData(transformed);
    }
  }, [data]);

  // Date picker handling
  const handleDateChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    if (range?.from && range?.to) setTimeRange("custom");
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

  // Search and filters
  const handleSearch = (query: string) => setSearch(query);
  const handleFilterApply = (filters: any) => setAppliedFilters(filters);

  // Table menu
  const handleMenuOpen = (item: DataItem, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedItemId(String(item.id));
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };

  if (loading)
    return (
      <CustomLoader layout="page" view="table" pageTitle="Branch Invoices" />
    );
  if (error) return <ServerError error={error} />;
  if (isNetworkError) return <NetworkError />;
  if (!invoiceData) return <div>No invoice data available.</div>;

  // Table data transformation (add status coloring, etc.)
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

  // Card currency data
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

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <div className="w-full flex items-center justify-between">
          <div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
                {branch.branch_name}
              </h1>
              <div className="text-text-disabled flex items-center space-x-1">
                <LocationIcon />
                <p className="text-sm font-medium">{branch.address}</p>
              </div>
            </div>
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
                    handleFilterApply={handleFilterApply}
                    isDateTrue
                  />
                </ModalContent>
              </Modal>
              <div className="flex items-center gap-2">
                <ExportButton type="pdf" href="/accounting/invoice/export" />
                <ExportButton type="csv" href="/accounting/invoice/export" />
              </div>
            </div>
          </div>
          <AutoResizingGrid gap={24} minWidth={320}>
            <AccountStatsCard
              title="Total Receipts Created"
              balance={statistics.total_receipt}
              trendDirection={
                statistics.percentage_change_total < 0 ? "down" : "up"
              }
              otherCurrency={otherCurrencyTotal}
              trendColor={
                statistics.percentage_change_total < 0 ? "red" : "green"
              }
              variant="blueIncoming"
              percentage={statistics.percentage_change_total}
              noSymbol
            />
            <AccountStatsCard
              title="Total Paid Receipts"
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
              noSymbol
            />
            <AccountStatsCard
              title="Total Pending Receipts"
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
              noSymbol
            />
          </AutoResizingGrid>
        </div>
      </div>
      {invoices.length === 0 && !silentLoading ? (
        <section>
          <EmptyList
            noButton
            title="No invoices for this branch yet."
            body={
              <p>
                You can either create a new invoice manually or allow the system
                to generate an invoice automatically for a new rent.
              </p>
            }
          />
        </section>
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
                Print Invoice
              </Link>
            </MenuItem>
          </TableMenu>
        </>
      )}
    </section>
  );
};

export default BranchInvoicePage;
