"use client";

import AccountStatsCard from "@/components/Accounting/account-stats-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { DatePickerWithRange } from "@/components/dashboard/date-picker";
import FilterButton from "@/components/FilterButton/filter-button";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ExportButton from "@/components/reports/export-button";
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
import {
  accountingReceiptOptionsWithDropdown,
  receiptTableFields,
  receiptTableData,
} from "./data";
import CustomTable from "@/components/Table/table";
import { useRouter } from "next/navigation";
import type { DataItem } from "@/components/Table/types";

const AccountingReceiptsPage = () => {
  const router = useRouter();
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

  const handleRowSelect = (item: DataItem) => {
    router.push(`/accounting/receipts/${item.id}/preview`);
  };

  return (
    <section className="space-y-8 mt-4">
      <div className="space-y-4">
        <div className="w-full flex items-center justify-between">
          <div className="font-medium text-2xl flex items-center space-x-1">
            <span className="text-2xl font-bold">Receipts</span>
            <ExclamationMark />
          </div>
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
                placeholder="Search for Receipt"
                className="max-w-[255px]"
              />
              <Modal>
                <ModalTrigger asChild>
                  <FilterButton />
                </ModalTrigger>
                <ModalContent>
                  <FilterModal
                    isDateTrue
                    filterOptionsMenu={accountingReceiptOptionsWithDropdown}
                    handleFilterApply={handleFilterApply}
                  />
                </ModalContent>
              </Modal>
              <div className="flex items-center gap-2">
                <ExportButton type="pdf" href="/accounting/receipts/1/export" />
                <ExportButton type="csv" href="/accounting/receipts/1/export" />
              </div>
            </div>
          </div>
          <AutoResizingGrid gap={24} minWidth={300}>
            <AccountStatsCard
              title="Total Receipts Created"
              balance={12345432}
              trendDirection="up"
              trendColor="red"
              variant="blueIncoming"
              percentage={53}
            />
            <AccountStatsCard
              title="Total Paid Receipts"
              balance={12345432}
              trendDirection="down"
              trendColor="green"
              variant="greenIncoming"
              percentage={4.3}
            />
            <AccountStatsCard
              title="Total Outstanding Receipts"
              balance={12345432}
              trendDirection="down"
              trendColor="green"
              variant="redOutgoing"
              percentage={4.3}
            />
          </AutoResizingGrid>
        </div>
      </div>
      <CustomTable
        fields={receiptTableFields}
        data={receiptTableData()}
        tableHeadStyle={{ height: "76px" }}
        tableHeadCellSx={{ fontSize: "1rem" }}
        tableBodyCellSx={{
          fontSize: "1rem",
          paddingTop: "12px",
          paddingBottom: "12px",
        }}
        handleSelect={handleRowSelect}
      />
    </section>
  );
};

export default AccountingReceiptsPage;
