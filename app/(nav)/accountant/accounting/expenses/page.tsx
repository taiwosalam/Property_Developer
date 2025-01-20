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
import { useState } from "react";
import { DateRange } from "react-day-picker";
import Link from "next/link";
import CreateExpenceModal from "@/components/Accounting/expenses/create-expense/CreateExpenceModal";
import {
  accountingExpensesOptionsWithDropdown,
  expenseTableFields,
  expenseTableData,
} from "./data";
import MenuItem from "@mui/material/MenuItem";
import CustomTable from "@/components/Table/table";
import TableMenu from "@/components/Table/table-menu";
import type { DataItem } from "@/components/Table/types";
import ExportButton from "@/components/reports/export-button";

const AccountingExpensesPage = () => {
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

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add filtering logic here for branches
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

  const transformedTableData = expenseTableData().map((item) => ({
    ...item,
    amount: <p className="text-status-success-3">{item.amount}</p>,
    payment: <p className="text-status-error-2">{item.payment}</p>,
    balance: item.balance ? item.balance : "--- ---",
  }));

  return (
    <section className="space-y-8 mt-4">
      <div className="space-y-4">
        <div className="w-full flex items-center justify-between">
          <div className="font-medium text-2xl flex items-center space-x-1">
            <span className="text-2xl font-bold">Expenses</span>
            <ExclamationMark />
          </div>
          <Modal>
            <ModalTrigger asChild>
              <Button type="button" className="page-header-button">
                + create Expenses
              </Button>
            </ModalTrigger>
            <ModalContent>
              <CreateExpenceModal />
            </ModalContent>
          </Modal>
        </div>
        <div className="bg-white rounded-[8px] border border-opacity-20 border-[#BAC7D533] dark:bg-[#3C3D37] dark:border-[#292d32] p-4 space-y-6">
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
                placeholder="Search for Expenses"
                className="max-w-[255px]"
              />
              <Modal>
                <ModalTrigger asChild>
                  <FilterButton />
                </ModalTrigger>
                <ModalContent>
                  <FilterModal
                    filterOptionsMenu={accountingExpensesOptionsWithDropdown}
                    handleFilterApply={handleFilterApply}
                    isDateTrue
                  />
                </ModalContent>
              </Modal>
              <div className="flex items-center gap-2">
                <ExportButton type="pdf" href="/accounting/expenses/export" />
                <ExportButton type="csv" href="/accounting/expenses/export" />
              </div>
            </div>
          </div>
          <AutoResizingGrid gap={24} minWidth={300}>
            <AccountStatsCard
              title="Total Expenses"
              balance={12345432}
              variant="redOutgoing"
              trendDirection="up"
              trendColor="red"
              percentage={53}
            />
            <AccountStatsCard
              title="Part Payment"
              balance={12345432}
              variant="blueIncoming"
              trendDirection="down"
              trendColor="green"
              percentage={4.3}
            />
            <AccountStatsCard
              title="Balance"
              balance={12345432}
              variant="yellowCard"
              trendDirection="down"
              trendColor="green"
              percentage={4.3}
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
