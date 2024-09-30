"use client";

import InvoiceStatCards from "@/components/Accounting/invoice/InvoiceStatCards";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { DatePickerWithRange } from "@/components/dashboard/date-picker";
import FilterButton from "@/components/FilterButton/filter-button";
import ThreeDotsVertical from "@/public/icons/three-dots-vertical.svg";
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
import Link from "next/link";

const AccountingReceiptsPage = () => {
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
            <span className="text-2xl font-bold">Receipts</span>
            <ExclamationMark />
          </div>
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
              <SearchInput placeholder="Search for Statement" />
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
                  href="/accounting/receipts/1/export"
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
            <InvoiceStatCards
              title="Total Paid Receipts"
              balance={12345432}
              downValue={53}
            />
            <InvoiceStatCards
              title="Total Receipts Created"
              balance={12345432}
              upvalue={53}
            />
            <InvoiceStatCards
              title="Total Pending Receipts"
              balance={12345432}
              downValue={53}
            />
          </AutoResizingGrid>
        </div>
      </div>
      <div className="rounded-lg w-full overflow-x-scroll no-scrollbar">
        <table className="dash-table">
          <colgroup>
            <col className="w-[72px]" />
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th>client name</th>
              <th>invoive ID</th>
              <th>payment reason</th>
              <th>total amount</th>
              <th>date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array(10)
              .fill(null)
              .map((_, index) => (
                <tr key={index}>
                  <td>
                    <Picture
                      src={"/empty/avatar-1.svg"}
                      alt="profile picture"
                      rounded
                      size={40}
                    />
                  </td>
                  <td>
                    <p>Amori Ademakinwa</p>
                  </td>
                  <td>
                    <p>1234563456</p>
                  </td>
                  <td>
                    <p>Rent cost: Start date: Sept 22, 2023 - Expiry date:</p>
                  </td>
                  <td>
                    <p>₦35,000.00</p>
                  </td>
                  <td>
                    <p>02/03/2024</p>
                  </td>
                  <td
                    className="cursor-pointer w-fit"
                    onClick={() =>
                      (window.location.href = "/accounting/receipts/1/preview")
                    }
                  >
                    <Picture
                      src={ThreeDotsVertical}
                      alt="three dots vertical"
                      size={24}
                    />
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

export default AccountingReceiptsPage;
