
"use client";

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
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import Link from "next/link";
import CreateExpenceModal from "@/components/Accounting/expenses/create-expense/CreateExpenceModal";
import {
  accountingExpensesOptionsWithDropdown,
  expenseTableFields,
  expenseTableData,
  ExpenseStats,
  TransformedExpensesData,
  transformExpensesData,
  ExpensesApiResponse,
  ExpensesRequestParams,
} from "./data";
import MenuItem from "@mui/material/MenuItem";
import CustomTable from "@/components/Table/table";
import TableMenu from "@/components/Table/table-menu";
import type { DataItem } from "@/components/Table/types";
import ExportButton from "@/components/reports/export-button";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { AxiosRequestConfig } from "axios";
import { FilterResult } from "@/components/Management/Landlord/types";
import dayjs from "dayjs";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { PropertyListResponse } from "../../management/rent-unit/[id]/edit-rent/type";

const AccountingExpensesPage = () => {
  const router = useRouter()
  const [pageData, setPageData] = useState<TransformedExpensesData>({
    expenses: [],
    stats: {
      total_amount: 0,
      total_balance: 0,
      total_deduct: 0,
      percentage_change_amount: 0,
      percentage_change_deduct: 0,
      percentage_change_balance: 0,
    } as ExpenseStats,
  });

  const {
    expenses,
    stats
  } = pageData

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });


  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");

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
    return {
      params: {
        from_date: appliedFilters.startDate
          ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
          : undefined,
        to_date: appliedFilters.endDate
          ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
          : undefined,
        search: search,
        property_ids: appliedFilters.menuOptions["Property"] || [],
      } as ExpensesRequestParams,
    };
  }, [appliedFilters, search]);

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const {
    data,
    loading,
    isNetworkError,
    error
  } = useFetch<ExpensesApiResponse>("/expenses", config);

  useEffect(() => {
    if (data) {
      setPageData(transformExpensesData(data));
    }
  }, [data]);

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

  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >();

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

  const transformedTableData = expenses.map((item) => ({
    ...item,
    amount: <p className="text-status-success-3">{item.amount}</p>,
    payment: <p className="text-status-error-2">{item.payment}</p>,
    balance: item.balance ? item.balance : "--- ---",
  }));


  if (loading) return <CustomLoader layout="page" pageTitle="Expenses" view="table" />
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <section className="space-y-8 mt-4">
      <div className="space-y-4">
        <div className="w-full flex items-center justify-between">
          <div className="font-medium text-2xl flex items-center space-x-1">
            <span className="text-2xl font-bold">Expenses</span>
            <ExclamationMark />
          </div>
          <Button
            type="button"
            className="page-header-button"
            onClick={() => router.push("/accounting/expenses/create-expenses")}
          >
            + create Expenses
          </Button>
        </div>
        <div className="bg-white rounded-[8px] border border-opacity-20 border-[#BAC7D533] dark:bg-[#3C3D37] dark:border-[#292d32] p-4 space-y-6">
          <div className="flex flex-wrap gap-y-4 items-center justify-between">
            {/* Page Title with search */}
            <FilterBar
              hasGridListToggle={false}
              exports
              exportHref="/accounting/expenses/export"
              customLeft={
                <>
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
                </>
              }
              aboutPageModalData={{
                title: "Expenses",
                description:
                  "This page contains a list of Expenses on the platform.",
              }}
              searchInputPlaceholder="Search for Expenses"
              handleFilterApply={handleFilterApply}
              isDateTrue
              filterOptionsMenu={[
                ...accountingExpensesOptionsWithDropdown,
                ...(propertyOptions.length > 0
                  ? [
                    {
                      label: "Property",
                      value: propertyOptions,
                    },
                  ]
                  : []),
              ]}
              handleSearch={handleSearch}
              appliedFilters={appliedFilters}
            />
          </div>
          <AutoResizingGrid gap={24} minWidth={300}>
            <AccountStatsCard
              title="Total Expenses"
              balance={Number(stats.total_amount)}
              variant="redOutgoing"
              trendDirection="up"
              trendColor="red"
              percentage={stats.percentage_change_amount}
            />
            <AccountStatsCard
              title="Part Payment"
              balance={Number(stats.total_deduct)}
              variant="blueIncoming"
              trendDirection="down"
              trendColor="green"
              percentage={stats.percentage_change_deduct}
            />
            <AccountStatsCard
              title="Balance"
              balance={Number(stats.total_balance)}
              variant="yellowCard"
              trendDirection="down"
              trendColor="green"
              percentage={stats.percentage_change_balance}
            />
          </AutoResizingGrid>
        </div>
      </div>
      <CustomTable
        fields={expenseTableFields}
        data={transformedTableData}
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
      <TableMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose} disableRipple>
          <Link
            href={`/accounting/expenses/${selectedItemId}/manage-expenses`}
            className="w-full text-left"
          >
            Manage Expense
          </Link>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} disableRipple>
          <Link
            href={`/accounting/expenses/${selectedItemId}/preview-expenses`}
            className="w-full text-left"
          >
            Preview Expense
          </Link>
        </MenuItem>
      </TableMenu>
    </section>
  );
};

export default AccountingExpensesPage;
