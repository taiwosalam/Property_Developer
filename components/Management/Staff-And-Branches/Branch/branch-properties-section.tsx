"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllStates } from "@/utils/states";
import FilterBar from "@/components/FIlterBar/FilterBar";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import PropertyCard from "@/components/Management/Properties/property-card";
import BranchPropertyListItem from "@/components/Management/Staff-And-Branches/Branch/branch-property-list-item";
import Pagination from "@/components/Pagination/pagination";

interface PageState {
  gridView: boolean;
  total_pages: number;
  current_page: number;
  selectedState: string;
  localGovernments: string[];
}

const BranchPropertiesSection: React.FC<{ branchId: string }> = ({
  branchId,
}) => {
  const initialState = {
    gridView: true,
    total_pages: 50,
    current_page: 1,
    selectedState: "",
    localGovernments: [],
  };
  const [state, setState] = useState<PageState>(initialState);
  const {
    gridView,
    total_pages,
    current_page,
    selectedState,
    localGovernments,
  } = state;

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

  const allStates = getAllStates() || [];

  const branchFiltersWithOptions = [
    {
      label: "State",
      value: allStates.map((state) => ({
        label: state,
        value: state,
      })),
    },
    {
      label: "Local Government",
      value: selectedState
        ? localGovernments.map((lga) => ({
            label: lga,
            value: lga,
          }))
        : [],
    },
  ];

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add filtering logic here for branches
  };
  return (
    <div className="custom-flex-col gap-6">
      <FilterBar
        searchInputPlaceholder="Search for Branch properties"
        azFilter
        filterOptions={[]}
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
            {Array.from({ length: 5 }).map((_, index) => (
              <Link
                key={index}
                href={`/management/staff-branch/${branchId}/property/${index}`}
              >
                <PropertyCard
                  address="123 Main St"
                  id={"1"}
                  images={[
                    "/empty/SampleProperty.jpeg",
                    "/empty/SampleProperty2.jpeg",
                    "/empty/SampleProperty3.jpeg",
                    "/empty/SampleProperty4.jpeg",
                    "/empty/SampleProperty5.jpeg",
                  ]}
                  property_name="Property 1"
                  total_units={1}
                  total_unit_pictures={5}
                  hasVideo={true}
                  property_type={index % 2 === 0 ? "rental" : "facility"}
                  currency="naira"
                  isClickable={false}
                  annualReturns={1000000}
                  annualIncome={1000000}
                  accountOfficer="John Doe"
                  last_updated="2021-01-01"
                  mobile_tenants={1}
                  web_tenants={1}
                  owing_units={1}
                  available_units={1}
                />
              </Link>
            ))}
          </AutoResizingGrid>
        ) : (
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <Link
                key={index}
                href={`/management/staff-branch/${branchId}/property/${index}`}
                className="block"
              >
                <BranchPropertyListItem />
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

export default BranchPropertiesSection;
