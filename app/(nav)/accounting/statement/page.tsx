"use client";

import { useState } from "react";

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
import {
  accountingStatementOptionsWithDropdown,
  statementTableFields,
  statementTableData,
} from "./data";
import AccountStatsCard from "@/components/Accounting/account-stats-card";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import ExportButton from "@/components/reports/export-button";
import { useRouter } from "next/navigation";

const Statement = () => {
  const router = useRouter();
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

  const handleRowClick = (item: DataItem) => {
    router.push(`/accounting/statement/preview`);
  };

  const transformedTableData = statementTableData.map((item) => ({
    ...item,
    credit: (
      <p className={item.credit ? "text-status-success-3" : ""}>
        {item.credit ? item.credit : "--- ---"}
      </p>
    ),
    debit: (
      <p className={item.debit ? "text-status-error-2" : ""}>
        {item.debit ? item.debit : "--- ---"}
      </p>
    ),
  }));

  return (
    <div className="custom-flex-col gap-10">
      <div className="custom-flex-col gap-6">
        <div className="flex gap-1 items-center">
          <h1 className="text-black dark:text-white text-2xl font-medium">
            Statement
          </h1>
          <ExclamationMark />
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
                placeholder="Search for Statement"
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
                      accountingStatementOptionsWithDropdown
                    }
                    onApply={handleFilterApply}
                    date
                    onStateSelect={(state: string) => setSelectedState(state)}
                  />
                </ModalContent>
              </Modal>
              <div className="flex items-center gap-2">
                <ExportButton type="pdf" href="/accounting/statement/export" />
                <ExportButton type="csv" href="/accounting/statement/export" />
              </div>
            </div>
          </div>
          <AutoResizingGrid gap={24} minWidth={300}>
            <AccountStatsCard
              title="Total Amount"
              balance={6506689}
              variant="blueIncoming"
              trendDirection="up"
              trendColor="green"
              percentage={53}
            />
            <AccountStatsCard
              title="Total Credit"
              balance={706689}
              variant="greenIncoming"
              trendDirection="down"
              trendColor="red"
              percentage={43}
            />
            <AccountStatsCard
              title="Total Debit"
              balance={706689}
              variant="redOutgoing"
              trendDirection="down"
              trendColor="red"
              percentage={43}
            />
          </AutoResizingGrid>
        </div>
      </div>
      <CustomTable
        fields={statementTableFields}
        data={transformedTableData}
        tableHeadStyle={{ height: "76px" }}
        tableHeadCellSx={{ fontSize: "1rem" }}
        tableBodyCellSx={{
          fontSize: "1rem",
          paddingTop: "12px",
          paddingBottom: "12px",
        }}
        handleSelect={handleRowClick}
      />
    </div>
  );
};

export default Statement;
