"use client";

import CreateInvoiceModal from "@/components/Accounting/invoice/CreateInvoiceModal";
import InvoiceStatCards from "@/components/Accounting/invoice/InvoiceStatCards";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { DatePickerWithRange } from "@/components/dashboard/date-picker";
import FilterButton from "@/components/FilterButton/filter-button";
import Button from "@/components/Form/Button/button";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Pagination from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExclamationMark, VerticalEllipsisIcon } from "@/public/icons/icons";
import ExportButton from "@/components/reports/export-button";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/Dropdown/dropdown";
import {
  accountingInvoiceOptionsWithDropdown,
  invoiceTableFields,
  invoiceTableData,
} from "./data";
import Link from "next/link";
import CustomTable from "@/components/Table/table";
import { Menu, MenuItem } from "@mui/material";

const AccountingInvoicePage = () => {
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
  const open = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const transformedTableData = invoiceTableData.map((item) => ({
    ...item,
    custom_action: (
      // Flawed
      <Dropdown>
        <DropdownTrigger
          aria-label="action"
          className="p-2 grid place-items-center mx-auto text-brand-10"
        >
          <VerticalEllipsisIcon />
        </DropdownTrigger>
        <DropdownContent>
          <div className="w-[250px] bg-white dark:bg-darkText-primary custom-flex-col py-2 gap-2 text-text-secondary dark:text-darkText-1 text-base font-bold capitalize text-center">
            <Link
              href={`/accounting/invoice/${item.id}/manage`}
              className="p-4"
            >
              Manage
            </Link>
            <Link
              href={`/accounting/invoice/${item.id}/add-payment`}
              className="p-4"
            >
              Add Payment
            </Link>
            <Link
              href={`/accounting/invoice/${item.id}/print-invoice`}
              className="p-4"
            >
              Print Invoice
            </Link>
          </div>
        </DropdownContent>
      </Dropdown>
      // <>
      //   <button
      //     type="button"
      //     aria-label="action"
      //     className="p-2 grid place-items-center mx-auto text-brand-10"
      //     onClick={handleMenuClick}
      //   >
      //     <VerticalEllipsisIcon />
      //   </button>
      //   <Menu
      //     anchorEl={anchorEl}
      //     open={open}
      //     onClose={handleMenuClose}
      //     MenuListProps={{
      //       "aria-labelledby": "basic-button",
      //     }}
      //   >
      //     <MenuItem onClick={handleMenuClose}>
      //       <Link href={`/accounting/invoice/${item.id}/manage`}>Manage</Link>
      //     </MenuItem>
      //     <MenuItem onClick={handleMenuClose}>
      //       <Link href={`/accounting/invoice/${item.id}/add-payment`}>
      //         Add Payment
      //       </Link>
      //     </MenuItem>
      //     <MenuItem onClick={handleMenuClose}>
      //       <Link href={`/accounting/invoice/${item.id}/print-invoice`}>
      //         Print Invoice
      //       </Link>
      //     </MenuItem>
      //   </Menu>
      // </>
    ),
  }));

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
          <AutoResizingGrid gap={16} minWidth={330}>
            <InvoiceStatCards
              title="Total Receipts Created"
              balance={12345432}
              upvalue={53}
            />
            <InvoiceStatCards
              title="Total Paid Receipts"
              balance={12345432}
              downValue={53}
            />
            <InvoiceStatCards
              title="Total Pending Receipts"
              balance={12345432}
              downValue={53}
            />
          </AutoResizingGrid>
        </div>
      </div>
      <CustomTable
        fields={invoiceTableFields}
        data={transformedTableData}
        tableHeadStyle={{ height: "76px" }}
        tableHeadCellSx={{ fontSize: "1rem" }}
        tableBodyCellSx={{
          fontSize: "1rem",
          paddingTop: "12px",
          paddingBottom: "12px",
        }}
      />
      <Pagination
        totalPages={5}
        currentPage={1}
        onPageChange={function (page: number): void {
          throw new Error("Function not implemented.");
        }}
      />
    </section>
  );
};

export default AccountingInvoicePage;
