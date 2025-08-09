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
  transformExpensesData,
  ExpensesRequestParams,
  transformStaffs,
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
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";
import TableLoading from "@/components/Loader/TableLoading";
import {
  ExpensesApiResponse,
  ExpenseStats,
  StaffListResponse,
  TransformedExpensesData,
} from "./types.";
import { useGlobalStore } from "@/store/general-store";
import ServerError from "@/components/Error/ServerError";
import useStaffRoles from "@/hooks/getStaffs";

const AccountingExpensesPage = () => {
  const router = useRouter();
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
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

  const { expenses, stats } = pageData;

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "">("");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >();

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

    const params: ExpensesRequestParams = {
      from_date: fromDate,
      to_date: toDate,
      search,
      property_ids: appliedFilters.menuOptions["Property"] || [],
      created_by: appliedFilters.menuOptions["Account Officer"] || [],
    };

    // If either date is provided, add date_filter: "custom"
    if (fromDate || toDate) {
      params.date_filter = "custom";
    }

    return { params };
  }, [appliedFilters, search, selectedDateRange]);

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const { data, loading, silentLoading, isNetworkError, error } =
    useFetch<ExpensesApiResponse>("/expenses", config);

  useEffect(() => {
    if (data) {
      const transformed = transformExpensesData(data);
      const newExpense = transformed.expenses;
      const currentExpenses = useGlobalStore.getState()?.accounting_expenses;
      if (JSON.stringify(currentExpenses) !== JSON.stringify(newExpense)) {
        setGlobalStore("accounting_expenses", newExpense);
      }
      setPageData({ ...transformed, expenses: newExpense });
      // setPageData(transformExpensesData(data));
    }
  }, [data, setGlobalStore, setPageData]);

  const {
    data: propertyData,
    error: propertyError,
    loading: propertyLoading,
  } = useFetch<PropertyListResponse>("/property/all");

  const {
    data: staffsData,
    error: staffsError,
    loading: staffsLoading,
  } = useFetch<StaffListResponse>("/report/staffs");

  const {
    getManagers,
    getStaffs,
    getAccountOfficers,
    loading: loadingStaffs,
  } = useStaffRoles();

  const accountOfficers = getAccountOfficers();

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
    amount: (
      <p className="text-status-success-3 dark:text-white">{item.amount}</p>
    ),
    payment: <p className="text-status-error-2">{item.payment}</p>,
    balance: item.balance ? item.balance : "--- ---",
  }));

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
        return "Last 30 days"; // Fallback for any unexpected value
    }
  }, [timeRange, selectedDateRange]);

  if (loading)
    return <CustomLoader layout="page" pageTitle="Expenses" view="table" />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <section className="space-y-8 mt-4">
      <div className="space-y-4">
        <div className="w-full flex items-center justify-between">
          <div className="font-medium text-2xl flex items-center space-x-1">
            <span className="text-2xl font-bold">Expenses</span>
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
              noExclamationMark
              exportHref="/accounting/expenses/export"
              xlsxData={useGlobalStore.getState().accounting_expenses}
              fileLabel="Accounting Expenses"
              customLeft={
                <>
                  <div
                    className={`w-fit flex bg-[#F5F5F5] dark:bg-darkText-primary rounded-md items-center justify-center`}
                  >
                    <DatePickerWithRange
                      selectedRange={selectedDateRange}
                      onDateChange={handleDateChange}
                    />
                    <Select
                      value={timeRange}
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
                ...(accountOfficersOptions.length > 0
                  ? [
                      {
                        label: "Account Manager",
                        value: accountOfficersOptions,
                      },
                    ]
                  : []),
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
              trendDirection={
                stats.percentage_change_amount < 0 ? "down" : "up"
              }
              trendColor={stats.percentage_change_amount < 0 ? "red" : "green"}
              percentage={stats.percentage_change_amount}
              timeRangeLabel={getTimeRangeLabel()}
            />
            <AccountStatsCard
              title="Deduction"
              balance={Number(stats.total_deduct)}
              variant="blueIncoming"
              trendDirection={
                stats.percentage_change_deduct < 0 ? "down" : "up"
              }
              trendColor={stats.percentage_change_deduct < 0 ? "red" : "green"}
              percentage={stats.percentage_change_deduct}
              timeRangeLabel={getTimeRangeLabel()}
            />
            <AccountStatsCard
              title="Balance"
              balance={Number(stats.total_balance)}
              variant="yellowCard"
              trendDirection={
                stats.percentage_change_balance < 0 ? "down" : "up"
              }
              trendColor={stats.percentage_change_balance < 0 ? "red" : "green"}
              percentage={stats.percentage_change_balance}
              timeRangeLabel={getTimeRangeLabel()}
            />
          </AutoResizingGrid>
        </div>
      </div>
      {/* Table and Menu */}
      {transformedTableData.length === 0 && !silentLoading ? (
        config.params.search || isFilterApplied() ? (
          <SearchError />
        ) : (
          <section>
            <EmptyList
              noButton
              title="You do not have any expenses yet!"
              body={
                <p>
                  Create an expense by clicking on the &apos;Create New
                  Expense&apos; button.
                  <br />
                  <br />
                  It keeps a record of all expenses made on a particular unit or
                  property.
                  <br />
                  <br />
                </p>
              }
            />
          </section>
        )
      ) : (
        <>
          {silentLoading ? (
            <TableLoading />
          ) : transformedTableData.length === 0 ? (
            <section>
              <EmptyList
                buttonText="+ Create New Expense"
                buttonLink="/accounting/expenses/create-expenses"
                title="You do not have any expenses yet!"
                body={
                  <p>
                    Create an expense by clicking on the &rqous;Create New
                    Expense&rqous; button.
                  </p>
                }
              />
            </section>
          ) : (
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
          )}
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
        </>
      )}
    </section>
  );
};

export default AccountingExpensesPage;
