"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
// Imports
import Card from "@/components/dashboard/card";
import Button from "@/components/Form/Button/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  dashboardCardData,
  recentMessagesData,
  walletBalanceCardData,
} from "@/app/(nav)/dashboard/data";
import NotificationCard from "@/components/dashboard/notification-card";
import { DashboardChart } from "@/components/dashboard/chart";

import { LocationIcon } from "@/public/icons/icons";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { PageState } from "./data";
import Pagination from "@/components/Pagination/pagination";
import BranchStatCard from "@/components/Management/Staff-And-Branches/Branch/branchStatCard";
import { DatePickerWithRange } from "@/components/dashboard/date-picker";
import BranchActivitiesCard from "@/components/Management/Staff-And-Branches/Branch/branch-activity-card";
import BranchBalanceCard from "@/components/Management/Staff-And-Branches/Branch/branch-balance-card";
import PropertyCard from "@/components/Management/Properties/property-card";
import BranchPropertyListItem from "@/components/Management/Staff-And-Branches/Branch/branch-property-list-item";
import CreateStaffModal from "@/components/Management/Staff-And-Branches/create-staff-modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { getOneBranch } from "../data";
import { useAuthStore } from "@/store/authstrore";
import { ResponseType } from "./types";
import FilterBar from "@/components/FIlterBar/FilterBar";

const BranchDashboard = () => {
  const initialState = {
    gridView: true,
    total_pages: 50,
    current_page: 1,
  };
  const [state, setState] = useState<PageState>(initialState);
  const [fetchedBranchData, setFetchedBranchData] =
    useState<ResponseType | null>();

  const { gridView, total_pages, current_page } = state;
  const { branchId } = useParams();

  const setGridView = () => {
    setState((state) => ({ ...state, gridView: true }));
  };
  const setListView = () => {
    setState((state) => ({ ...state, gridView: false }));
  };
  const handlePageChange = (page: number) => {
    setState((state) => ({ ...state, current_page: page }));
  };
  const setSelectedState = (selectedState: string) => {
    setState((state) => ({ ...state, selectedState }));
  };

  const properties = fetchedBranchData?.property_list || [];

  const BranchFilters = [{ label: "Alphabetically", value: "alphabetically" }];

  const branchFiltersWithOptions = [
    {
      label: "Branch",
      value: [
        { label: "Branch 1", value: "branch1" },
        { label: "Branch 2", value: "branch2" },
        { label: "Branch 3", value: "branch3" },
      ],
    },
    {
      label: "Account Officer",
      value: [
        { label: "Account Officer 1", value: "account_officer1" },
        { label: "Account Officer 2", value: "account_officer2" },
        { label: "Account Officer 3", value: "account_officer3" },
      ],
    },
  ];

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add filtering logic here for branches
  };

  const accessToken = useAuthStore((state) => state.access_token);

  useEffect(() => {
    const fetchBranchData = async () => {
      if (typeof branchId === "string") {
        const data = await getOneBranch(branchId, accessToken);
        setFetchedBranchData(data);
        console.log(data);
      } else {
        console.error("Invalid branchId:", branchId);
      }
    };

    fetchBranchData();
  }, [accessToken, branchId]);

  return (
    <div className="custom-flex-col gap-6">
      <div className="w-full gap-2 flex items-center justify-between flex-wrap">
        <div>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
            {fetchedBranchData?.branch?.branch_title || "Null"}
          </h1>
          <div className="text-text-disabled flex items-center space-x-1">
            <LocationIcon />
            <p className="text-sm font-medium">
              {fetchedBranchData?.branch?.branch_full_address || "Null"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 ml-auto flex-wrap">
          <Modal>
            <ModalTrigger asChild>
              <Button
                type="button"
                variant="border"
                className="page-header-button"
              >
                + create staff
              </Button>
            </ModalTrigger>
            <ModalContent>
              <CreateStaffModal branchId={branchId as string} />
            </ModalContent>
          </Modal>
          <Button
            type="button"
            className="page-header-button"
            href={`/management/staff-branch/${branchId}/edit-branch`}
          >
            Edit Branch
          </Button>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row md:justify-between gap-x-8 gap-y-4 md:items-start">
        <div className="md:w-[58%] lg:w-[68%] bg-white dark:bg-[#3C3D37] p-6 space-y-4 rounded-lg border border-[rgba(186,199,213,0.20)]">
          <div className="ml-auto flex w-[390px] max-w-full px-4 bg-[#F5F5F5] dark:bg-darkText-primary rounded-md items-center justify-end">
            <DatePickerWithRange
              selectedRange={
                {
                  startDate: new Date(),
                  endDate: new Date(),
                  key: "selection",
                } as any
              }
              onDateChange={
                (range: any) => console.log(range)
                // Add date range logic here
              }
            />
            <Select
              value={"90d"}
              onValueChange={
                (value: string) => console.log(value)
                // Add date range logic here
              }
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
          <AutoResizingGrid gap={12} minWidth={212}>
            <BranchStatCard
              title="Total Receipts"
              balance={1234535}
              upvalue={54}
            />
            <BranchStatCard
              title="Total Expenses"
              balance={1234535}
              upvalue={54}
            />
            <BranchStatCard
              title="Total Balance"
              balance={1234535}
              upvalue={54}
            />
          </AutoResizingGrid>
        </div>
        <div className="md:flex-1 space-y-4">
          <div className="max-w-full flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-[14px] font-medium">Branch Wallet</h1>
            <p className="text-xs text-text-label">ID: 2324354678</p>
          </div>
          <BranchBalanceCard
            mainBalance={walletBalanceCardData.mainBalance}
            cautionDeposit={walletBalanceCardData.cautionDeposit}
            className="max-w-full"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-x-8 gap-y-4 lg:items-start">
        <div className="overflow-x-auto flex lg:w-[68%] md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar">
          {dashboardCardData.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              icon={<card.icon />}
              value={card.value}
              subvalue={card.subValue}
              bg={card.bg}
            />
          ))}
        </div>
        <BranchActivitiesCard className="lg:flex-1" />
      </div>
      <div className="flex flex-col lg:flex-row gap-x-8 gap-y-4 items-start">
        <DashboardChart
          chartTitle="Reports"
          visibleRange={false}
          className="hidden md:block md:w-full lg:w-[68%]"
        />
        <NotificationCard
          sectionHeader="Staffs"
          notifications={fetchedBranchData?.staff || []}
          branchId={branchId as string}
          className="md:flex-1"
        />
      </div>

      <FilterBar
        searchInputPlaceholder="Search for Branch properties"
        azFilter
        filterOptions={BranchFilters}
        filterWithOptionsWithDropdown={branchFiltersWithOptions}
        onStateSelect={(state: string) => setSelectedState(state)}
        handleFilterApply={handleFilterApply}
        isDateTrue
        gridView={gridView}
        setGridView={setGridView}
        setListView={setListView}
      />

      {/* Property cards */}
      <section>
        {gridView ? (
          <AutoResizingGrid minWidth={315}>
            {properties.slice(0, 30).map((p) => (
              <Link
                href={`/management/staff-branch/${branchId}/property/${p.id}`}
                key={p.id}
              >
                <PropertyCard {...p} isClickable={false} />
              </Link>
            ))}
          </AutoResizingGrid>
        ) : (
          <div className="space-y-4">
            {properties.slice(0, 30).map((p) => (
              <Link
                href={`/management/staff-branch/${branchId}/property/${p.id}`}
                key={p.id}
                className="block"
              >
                <BranchPropertyListItem {...p} />
              </Link>
            ))}
          </div>
        )}
      </section>

      <Pagination
        totalPages={total_pages}
        currentPage={current_page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default BranchDashboard;
