"use client";

import ExpensesStatCard from "@/components/Accounting/expenses/expenses-stat-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { DatePickerWithRange } from "@/components/dashboard/date-picker";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/Dropdown/dropdown";
import FilterButton from "@/components/FilterButton/filter-button";
import Button from "@/components/Form/Button/button";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Pagination from "@/components/Pagination/pagination";
import Picture from "@/components/Picture/picture";
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
import ThreeDotsVertical from "@/public/icons/three-dots-vertical.svg";
import Link from "next/link";
import CreateExpenceModal from "@/components/Accounting/expenses/create-expense/CreateExpenceModal";

const AccountingExpensesPage = () => {
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
        <div className="bg-white rounded-[8px] border border-opacity-20 border-[#BAC7D533] p-4 space-y-6">
          <div className="flex flex-wrap gap-y-4 items-center justify-between">
            <div
              className={`w-fit flex bg-[#F5F5F5] rounded-md items-center justify-center`}
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
              <SearchInput placeholder="Search for Invoice" />
              <Modal>
                <ModalTrigger asChild>
                  <FilterButton />
                </ModalTrigger>
                <ModalContent>
                  <FilterModal
                    filterOptions={[]}
                    filterOptionsWithDropdown={[]}
                    onApply={handleFilterApply}
                    date
                    onStateSelect={(state: string) => setSelectedState(state)}
                  />
                </ModalContent>
              </Modal>
              <div className="flex items-center gap-2">
                <Link
                  href={"/accounting/expenses/export"}
                  className="border border-[#D0D5DD py-[10px] px-4 rounded-[8px] flex items-center gap-1 text-sm font-medium font-[#344054]"
                >
                  <Picture src={"/icons/pdf-icon.svg"} size={20} alt="pdf" />
                  <span>Export</span>
                </Link>
                <div className="border border-[#D0D5DD py-[10px] px-4 rounded-[8px] flex items-center gap-1 text-sm font-medium font-[#344054]">
                  <Picture
                    src={"/icons/excel-icon.svg"}
                    size={20}
                    alt="excep"
                  />
                  <span>Export</span>
                </div>
              </div>
            </div>
          </div>
          <AutoResizingGrid gap={6} minWidth={330}>
            <ExpensesStatCard
              title="Total Expenses"
              balance={12345432}
              upvalue={53}
            />
            <ExpensesStatCard
              title="Part Payment"
              balance={12345432}
              downValue={53}
            />
            <ExpensesStatCard
              title="Balance"
              balance={12345432}
              downValue={53}
            />
          </AutoResizingGrid>
        </div>
      </div>
      <div className="rounded-lg w-full pb-[120px] overflow-x-scroll no-scrollbar">
        <table className="dash-table">
          <colgroup>
            <col className="w-[72px]" />
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th>date</th>
              <th>client name</th>
              <th>descrption</th>
              <th>amount</th>
              <th>payment</th>
              <th>balance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array(10)
              .fill(null)
              .map((_, index) => (
                <tr key={index} className="font-medium">
                  <td>
                    <Picture
                      src={"/empty/avatar-1.svg"}
                      alt="profile picture"
                      rounded
                      size={40}
                    />
                  </td>
                  <td>
                    <p>02/03/2024</p>
                  </td>
                  <td>
                    <p>Amori Ademakinwa</p>
                  </td>
                  <td>
                    <p>Water Plumbing</p>
                  </td>
                  <td>
                    <p className="text-status-success-3">₦35,000.00</p>
                  </td>
                  <td>
                    <p className="text-status-error-2">₦35,000.00</p>
                  </td>
                  <td>
                    <p>₦35,000.00</p>
                  </td>
                  <td>
                    <Dropdown>
                      <DropdownTrigger className="flex items-center justify-center">
                        <Picture
                          src={ThreeDotsVertical}
                          alt="three dots vertical"
                          size={24}
                        />
                      </DropdownTrigger>
                      <DropdownContent>
                        <div className="w-[250px] bg-white custom-flex-col py-2 gap-2 text-text-secondary text-base font-bold capitalize text-center">
                          <Link
                            href={"/accounting/expenses/1/manage-expenses"}
                            className="p-4"
                          >
                            Manage Receipt
                          </Link>
                          <Link
                            href={"/accounting/expenses/1/preview-expenses"}
                            className="p-4"
                          >
                            Preview Receipt
                          </Link>
                        </div>
                      </DropdownContent>
                    </Dropdown>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
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

export default AccountingExpensesPage;
