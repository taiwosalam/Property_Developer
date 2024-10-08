"use client";
import { useState } from "react";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import { GridIcon, ListIcon } from "@/public/icons/icons";
import clsx from "clsx";
import FilterButton from "@/components/FilterButton/filter-button";
import {
  RentAndUnitFilters,
  RentAndUnitFiltersWithOptions,
  RentAndUnitState,
} from "./data";
import StatusIndicator from "@/components/Management/status-indicator";
import Pagination from "@/components/Pagination/pagination";
import RentalPropertyCard from "@/components/Management/Rent And Unit/rental-property-card";
import RentalPropertyListCard from "@/components/Management/Rent And Unit/rental-property-list";

const RentAndUnit = () => {
  const [state, setState] = useState<RentAndUnitState>({
    gridView: true,
    total_pages: 5,
    current_page: 1,
  });

  const { gridView, total_pages, current_page } = state;

  const setGridView = () => {
    setState((state) => ({ ...state, gridView: true }));
  };
  const setListView = () => {
    setState((state) => ({ ...state, gridView: false }));
  };
  const handlePageChange = (page: number) => {
    setState((state) => ({ ...state, current_page: page }));
  };

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add filtering logic here for branches
  };
  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Units"
          newData={30}
          total={40}
          className="w-[240px]"
        />
        <ManagementStatistcsCard
          title="Occupied Units"
          newData={40}
          total={40}
          className="w-[240px]"
        />
        <ManagementStatistcsCard
          title="Vacannt Units"
          newData={40}
          total={40}
          className="w-[240px]"
        />
        <ManagementStatistcsCard
          title="Expired Units"
          newData={40}
          total={40}
          className="w-[240px]"
        />
      </div>
      <div className="page-title-container">
        <PageTitle title="Rent & Unit" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search for Rent and Unit" />
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="list-view"
              className={clsx(
                "p-1 rounded-md",
                !gridView
                  ? "bg-black text-white"
                  : "bg-transparent text-[unset]"
              )}
              onClick={setListView}
            >
              <ListIcon />
            </button>
            <button
              type="button"
              aria-label="grid-view"
              className={clsx(
                "p-1 rounded-md",
                gridView ? "bg-black text-white" : "bg-transparent text-[unset]"
              )}
              onClick={setGridView}
            >
              <GridIcon />
            </button>
          </div>
          <Modal>
            <ModalTrigger asChild>
              <FilterButton />
            </ModalTrigger>
            <ModalContent>
              <FilterModal
                filterOptionsWithDropdown={RentAndUnitFiltersWithOptions}
                filterOptions={RentAndUnitFilters}
                onApply={handleFilterApply}
                date
              />
            </ModalContent>
          </Modal>
        </div>
      </div>

      <section className="capitalize space-y-4 px-4 w-full">
        <div className="w-full flex items-center justify-end">
          <div className="flex gap-4 flex-wrap">
            <StatusIndicator statusTitle="vacant" />
            <StatusIndicator statusTitle="occupied" />
            <StatusIndicator statusTitle="active" />
            <StatusIndicator statusTitle="expired" />
            <StatusIndicator statusTitle="relocate" />
          </div>
        </div>
        {gridView ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
            <RentalPropertyCard />
            <RentalPropertyCard />
            <RentalPropertyCard />
          </div>
        ) : (
          <div className="space-y-4">
            <RentalPropertyListCard />
            <RentalPropertyListCard />
            <RentalPropertyListCard />
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

export default RentAndUnit;
