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
import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  accountingInvoiceOptionsWithDropdown,
  invoiceTableFields,
  invoiceTableData,
} from "./data";
import Link from "next/link";
import CustomTable from "@/components/Table/table";
import MenuItem from "@mui/material/MenuItem";
import type { DataItem } from "@/components/Table/types";
import useDarkMode from "@/hooks/useCheckDarkMode";
import TableMenu from "@/components/Table/table-menu";

const AccountingInvoicePage = () => {
  const isDarkMode = useDarkMode();
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >();

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
    console.log(e.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <div className="w-full flex items-center justify-between">
          <div className="font-medium text-2xl flex items-center space-x-1">
            <span className="text-2xl font-bold">Invoices</span>
            <ExclamationMark />
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
                placeholder="Search for Invoice"
                className="max-w-[255px]"
              />
              <Modal>
                <ModalTrigger asChild>
                  <FilterButton />
                </ModalTrigger>
                <ModalContent>
                  <FilterModal
                    filterOptions={[]}
                    filterOptionsWithDropdown={
                      accountingInvoiceOptionsWithDropdown
                    }
                    onApply={handleFilterApply}
                    onStateSelect={(state: string) => setSelectedState(state)}
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
              title="Total Receipts Created"
              balance={12345432}
              trendDirection="up"
              trendColor="green"
              variant="blueIncoming"
              percentage={53}
            />
            <AccountStatsCard
              title="Total Paid Receipts"
              balance={12345432}
              trendDirection="down"
              trendColor="red"
              variant="greenIncoming"
              percentage={4.3}
            />
            <AccountStatsCard
              title="Total Pending Receipts"
              balance={12345432}
              trendDirection="down"
              trendColor="red"
              variant="yellowCard"
              percentage={4.3}
            />
          </AutoResizingGrid>
        </div>
      </div>
      <CustomTable
        fields={invoiceTableFields}
        data={invoiceTableData}
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
    </section>
  );
};

export default AccountingInvoicePage;
