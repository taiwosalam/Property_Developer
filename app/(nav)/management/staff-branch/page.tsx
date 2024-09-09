"use client";

import { useEffect, useState } from "react";
import { GridIcon, ListIcon } from "@/public/icons/icons";
import BranchCard from "@/components/Management/Staff-And-Branches/branch-card";
import CustomTable from "@/components/Table/table";
import { branches } from "./data";
import type { Field } from "@/components/Table/types";
import Image from "next/image";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import SearchInput from "@/components/SearchInput/search-input";
import type { StaffAndBranchState } from "./types";
import DateInput from "@/components/Form/DateInput/date-input";
import { Dayjs } from "dayjs";
import PageTitle from "@/components/PageTitle/page-title";

const StaffAndBranches = () => {
  const initialState = {
    gridView: true,
    total_pages: 50,
    current_page: 1,
    selectedState: "",
    selectedLGA: "",
    localGovernments: [],
  };
  const [state, setState] = useState<StaffAndBranchState>(initialState);

  const setGridView = () => {
    setState((state) => ({ ...state, gridView: true }));
  };
  const setListView = () => {
    setState((state) => ({ ...state, gridView: false }));
  };
  const handlePageChange = (page: number) => {
    setState((state) => ({ ...state, current_page: page }));
  };

  const setLocalGovernments = (array: string[]) => {
    setState((state) => ({ ...state, localGovernments: array }));
  };
  const setSelectedState = (selectedState: string) => {
    setState((state) => ({ ...state, selectedState }));
  };

  const allStates = getAllStates() || [];

  const StaffAndBranchFilters = [
    { label: "Alphabetically", value: "alphabetically" },
  ];

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add filtering logic here for branches
  };

  const {
    gridView,
    total_pages,
    current_page,
    selectedState,
    selectedLGA,
    localGovernments,
  } = state;

  const [selectedDate, setSelectedDate] = useState<Dayjs | null | undefined>(
    null
  );

  const StaffAndBranchFiltersWithOptions = [
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

  const tableFields: Field[] = [
    { id: "1", label: "S/N", accessor: "S/N" },
    { id: "2", label: "", accessor: "avatar", isImage: true },
    { id: "3", label: "Branch Name", accessor: "branch_title" },
    { id: "4", label: "Branch Address", accessor: "branch_full_address" },
    { id: "5", label: "Branch Manager", accessor: "manager_name" },
    {
      id: "6",
      label: "Total Staff",
      accessor: "staff_count",
      contentStyle: {
        color: "#fff",
        padding: "4px",
        borderRadius: "8px",
        backgroundColor: "#8C62FF",
        display: "grid",
        placeItems: "center",
        width: "32px",
        margin: "auto",
      },
    },
    {
      id: "7",
      label: "Properties",
      accessor: "property_count",
      contentStyle: {
        color: "#fff",
        padding: "4px",
        borderRadius: "8px",
        backgroundColor: "#2DD4BF",
        display: "grid",
        placeItems: "center",
        width: "32px",
        margin: "auto",
      },
    },
    {
      id: "8",
      label: "Units",
      accessor: "unit_count",
      contentStyle: {
        color: "#fff",
        padding: "4px",
        borderRadius: "8px",
        backgroundColor: "#38BDF8",
        display: "grid",
        placeItems: "center",
        width: "32px",
        margin: "auto",
      },
    },
  ];

  // Handle the selected state and update local governments
  useEffect(() => {
    if (selectedState) {
      const lgas = getLocalGovernments(selectedState);
      setLocalGovernments(lgas || []);
    }
  }, [selectedState]);

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <ManagementStatistcsCard
            title="Total Branches"
            old={100}
            newData={200}
            total={300}
          />
          <ManagementStatistcsCard
            title="Total Properties"
            old={100}
            newData={200}
            total={300}
          />
          <ManagementStatistcsCard
            title="Total Staff"
            old={100}
            newData={200}
            total={300}
          />
          <div className="hidden md:block xl:hidden">
            <div className="flex items-center justify-center w-full h-full">
              <Modal>
                <ModalTrigger asChild>
                  <button type="button" className="page-header-button">
                    + create new landlord
                  </button>
                </ModalTrigger>
                <ModalContent>
                  <div>Hello</div>
                </ModalContent>
              </Modal>
            </div>
          </div>
        </div>
        <div className="md:hidden xl:flex lg:ml-4">
          <Modal>
            <ModalTrigger asChild>
              <button type="button" className="page-header-button">
                + create new landlord
              </button>
            </ModalTrigger>
            <ModalContent>
              <div>Hello</div>
            </ModalContent>
          </Modal>
        </div>
      </div>

      <div className="page-title-container">
        <PageTitle title="Staff & Branch" />
        <div className="flex items-center space-x-4">
          <SearchInput placeholder="Search for Staff and Branch" />
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
                  filterOptionsWithDropdown={StaffAndBranchFiltersWithOptions}
                  filterOptions={StaffAndBranchFilters}
                  onApply={handleFilterApply}
                  date
                  onStateSelect={(state: string) => setSelectedState(state)}
                />
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>

      <section className="capitalize">
        {gridView ? (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(284px, 1fr))",
            }}
          >
            {branches.slice(0, 30).map((b) => (
              <BranchCard key={b.id} {...b} />
            ))}
          </div>
        ) : (
          <CustomTable
            fields={tableFields}
            data={branches.slice(0, 20)}
            tableHeadClassName="bg-brand-5"
            tableHeadStyle={{
              borderBottom: "1px solid rgba(234, 236, 240, 0.20)",
            }}
            tableHeadCellSx={{
              color: "#fff",
              fontWeight: 500,
              border: "none",
              textAlign: "left",
            }}
            tableBodyCellSx={{
              fontWeight: 500,
              // fontSize: "16px",
              color: "#050901",
              border: "none",
              textAlign: "left",
            }}
            evenRowColor="#fff"
            oddRowColor="#EFF6FF"
          />
        )}
      </section>
    </div>
  );
};

export default StaffAndBranches;
