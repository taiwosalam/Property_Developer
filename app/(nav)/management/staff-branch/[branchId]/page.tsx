"use client";

import { useState } from "react";
import Image from "next/image";
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
import useWindowWidth from "@/hooks/useWindowWidth";
import SearchInput from "@/components/SearchInput/search-input";
import { GridIcon, ListIcon } from "@/public/icons/icons";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import { PageState } from "./data";
import Pagination from "@/components/Pagination/pagination";
import BranchStatCard from "@/components/Management/Staff-And-Branches/Branch/branchStatCard";
import { DatePickerWithRange } from "@/components/dashboard/date-picker";
import BranchActivitiesCard from "@/components/Management/Staff-And-Branches/Branch/branch-activity-card";
import BranchBalanceCard from "@/components/Management/Staff-And-Branches/Branch/branch-balance-card";
import { properties } from "../../property/data";
import PropertyCard from "@/components/Management/Property/property-card";
import BranchPropertyListItem from "@/components/Management/Staff-And-Branches/Branch/branch-property-list-item";

const Dashboard = () => {
  const initialState = {
    gridView: true,
    total_pages: 50,
    current_page: 1,
  };
  const [state, setState] = useState<PageState>(initialState);

  const { gridView, total_pages, current_page } = state;
  const { branchId } = useParams();
  const { isMobile } = useWindowWidth();

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

  return (
    <div className="custom-flex-col gap-5">
      <div className="w-full flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Branch Name</h1>
          <div className="flex items-center space-x-1">
            <Image
              src={"/icons/location.svg"}
              alt="location"
              width={14}
              height={14}
              style={{
                width: "14px",
                height: "14px",
              }}
            />
            <p className="text-text-disabled text-sm font-medium">
              Street 23, All Avenue, Nigeria
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Modal>
            <ModalTrigger asChild>
              <Button type="button" className="page-header-button">
                + create staff
              </Button>
            </ModalTrigger>
            <ModalContent>
              <div>Hello</div>
            </ModalContent>
          </Modal>
          <Button type="button" className="page-header-button">
            Edit Branch
          </Button>
        </div>
      </div>
      <div className="w-full h-full xl:flex gap-x-10">
        <div className="w-full flex-1 h-full xl:w-[70%] space-y-4 xl:space-y-7">
          <>
            <div className="ml-auto flex w-[390px] px-4 bg-[#F5F5F5] rounded-md items-center justify-end">
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
            <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
            </div>
          </>
          <div className="w-full flex flex-row overflow-x-scroll md:overflow-auto py-1.5 md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar">
            {dashboardCardData.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                icon={card.icon}
                value={card.value}
                subvalue={card.subValue}
                bg={card.bg}
              />
            ))}
          </div>
          {!isMobile && (
            <div className="w-full h-fit">
              <DashboardChart visibleRange={false} />
            </div>
          )}
        </div>
        <div className="w-full xl:w-[30%] xl:max-w-[342px] h-full space-y-6 mt-6 xl:mt-0">
          <BranchBalanceCard
            mainBalance={walletBalanceCardData.mainBalance}
            cautionDeposit={walletBalanceCardData.cautionDeposit}
          />
          <BranchActivitiesCard />
          <NotificationCard
            sectionHeader="Staffs"
            notifications={recentMessagesData}
          />
        </div>
      </div>
      <div className="page-title-container" style={{ justifyContent: "end" }}>
        <div className="flex items-center space-x-4">
          <SearchInput placeholder="Search for Branch properties" />
          <div className="flex items-center gap-x-3">
            <button
              type="button"
              aria-label="list-view"
              className={`${
                !gridView ? "bg-black" : "bg-transparent"
              } p-1 rounded-md`}
              onClick={setListView}
            >
              <div className={!gridView ? "text-white" : "text-[unset]"}>
                <ListIcon />
              </div>
            </button>
            <button
              type="button"
              aria-label="grid-view"
              className={`${
                gridView ? "bg-black" : "bg-transparent"
              } p-1 rounded-md`}
              onClick={setGridView}
            >
              <div className={gridView ? "text-white" : "text-[unset]"}>
                <GridIcon />
              </div>
            </button>
          </div>
          <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
            <Modal>
              <ModalContent>
                <ModalTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Image
                      src="/icons/sliders.svg"
                      alt="filters"
                      width={20}
                      height={20}
                    />
                    <p>Filters</p>
                  </div>
                </ModalTrigger>
                <ModalContent>
                  <FilterModal
                    filterOptions={BranchFilters}
                    filterOptionsWithDropdown={branchFiltersWithOptions}
                    onApply={handleFilterApply}
                    date
                    onStateSelect={(state: string) => setSelectedState(state)}
                  />
                </ModalContent>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>

      {/* Property cards */}
      <section>
        {gridView ? (
          <div
            className="grid gap-x-[30px] gap-y-5"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(370px, 1fr))",
            }}
          >
            {properties.slice(0, 30).map((p) => (
              <Link
                href={`/management/staff-branch/${branchId}/property/${p.id}`}
                key={p.id}
              >
                <PropertyCard {...p} isClickable={false} />
              </Link>
            ))}
          </div>
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
        <Pagination
          totalPages={total_pages}
          currentPage={current_page}
          onPageChange={handlePageChange}
          className="mt-8 text-xs font-medium"
        />
      </section>
    </div>
  );
};

export default Dashboard;
