"use client";
import { useEffect, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import {
  RentAndUnitFilters,
  RentAndUnitFiltersWithDropdown,
  RentAndUnitState,
} from "./data";
import StatusIndicator from "@/components/Management/status-indicator";
import Pagination from "@/components/Pagination/pagination";
import RentalPropertyCard from "@/components/Management/Rent And Unit/rental-property-card";
import RentalPropertyListCard from "@/components/Management/Rent And Unit/rental-property-list";
import FilterBar from "@/components/FIlterBar/FilterBar";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import useView from "@/hooks/useView";
import useSettingsStore from "@/store/settings";

const RentAndUnit = () => {
  const view = useView();
  const { selectedOptions, setSelectedOption } = useSettingsStore();
  const [selectedView, setSelectedView] = useState<string | null>(
    selectedOptions.view
  );
  // const grid = selectedView === "grid";

  const [state, setState] = useState<RentAndUnitState>({
    gridView: selectedView === "grid",
    total_pages: 5,
    current_page: 1,
  });

  const { gridView, total_pages, current_page } = state;

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      gridView: selectedView === "grid",
    }));
  }, [selectedView]);

  const setGridView = () => {
    setSelectedOption("view", "grid");
    setSelectedView("grid");
  };

  const setListView = () => {
    setSelectedOption("view", "list");
    setSelectedView("list");
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
          newData={100}
          total={450}
          className="w-[240px]"
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Occupied Units"
          newData={100}
          total={450}
          className="w-[240px]"
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Vacannt Units"
          newData={100}
          total={450}
          className="w-[240px]"
          colorScheme={3}
        />
        <ManagementStatistcsCard
          title="Expired Units"
          newData={100}
          total={450}
          className="w-[240px]"
          colorScheme={4}
        />
      </div>
      <FilterBar
        azFilter
        gridView={view === "grid" || gridView}
        setGridView={setGridView}
        setListView={setListView}
        pageTitle="Rent & Unit"
        aboutPageModalData={{
          title: "Rent & Unit",
          description:
            "This page contains a list of Rent & Unit on the platform.",
        }}
        searchInputPlaceholder="Search for Rent and Unit"
        handleFilterApply={handleFilterApply}
        isDateTrue
        filterOptions={RentAndUnitFilters}
        filterOptionsMenu={RentAndUnitFiltersWithDropdown}
      />
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
        {view === "grid" || gridView ? (
          <AutoResizingGrid minWidth={315}>
            <RentalPropertyCard
              propertyType="rental"
              images={[
                "/empty/SampleProperty.jpeg",
                "/empty/SampleProperty2.jpeg",
                "/empty/SampleProperty3.jpeg",
                "/empty/SampleProperty4.png",
                "/empty/SampleProperty5.jpg",
              ]}
              unitId="1"
            />
            <RentalPropertyCard
              propertyType="facility"
              images={[
                "/empty/SampleProperty.jpeg",
                "/empty/SampleProperty2.jpeg",
                "/empty/SampleProperty3.jpeg",
                "/empty/SampleProperty4.png",
                "/empty/SampleProperty5.jpg",
              ]}
              unitId="2"
            />
            <RentalPropertyCard
              propertyType="rental"
              images={[
                "/empty/SampleProperty.jpeg",
                "/empty/SampleProperty2.jpeg",
                "/empty/SampleProperty3.jpeg",
                "/empty/SampleProperty4.png",
                "/empty/SampleProperty5.jpg",
              ]}
              unitId="3"
            />
          </AutoResizingGrid>
        ) : (
          <div className="space-y-4">
            <RentalPropertyListCard propertyType="rental" unitId="1" />
            <RentalPropertyListCard propertyType="facility" unitId="2" />
            <RentalPropertyListCard propertyType="rental" unitId="3" />
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
