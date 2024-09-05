"use client";

import { useEffect, useState } from "react";
import BranchCard from "@/components/Management/Staff-And-Branches/branch-card";
import CustomTable from "@/components/Table/table";
import { branches } from "./data";
import type { Field } from "@/components/Table/types";
import Input from "@/components/Form/Input/input";
import Image from "next/image";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import SearchInput from "@/components/SearchInput/search-input";

const StaffAndBranches = () => {
  const [gridView, setGridView] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [localGovernments, setLocalGovernments] = useState<string[]>([]);
  const [selectedLGA, setSelectedLGA] = useState("");

  function toggleGridView() {
    setGridView(true);
  }

  function toggleListView() {
    setGridView(false);
  }

  const states = getAllStates() || [];

  // Handle the selected state and update local governments
  useEffect(() => {
    if (selectedState) {
      const lgas = getLocalGovernments(selectedState);
      setLocalGovernments(lgas || []);
    }
  }, [selectedState]);

  const StaffAndBranchFiltersWithOptions = [
    {
      label: "State",
      value: states.map((state) => ({
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

  const StaffAndBranchFilters = [
    { label: "Alphabetically", value: "alphabetically" },
    { label: "Registration Date", value: "registration_date" },
  ];

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add filtering logic here for branches
  };

  const fields: Field[] = [
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
      },
    },
    { id: "9", label: "", accessor: "action" },
  ];

  return (
    <div className="space-y-9">
      <section className="page-header-container">
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
          <ManagementStatistcsCard />
          <ManagementStatistcsCard />
          <ManagementStatistcsCard />
        </div>
        <div className="ml-auto">
          <Modal>
            <ModalTrigger asChild>
              <button type="button" className="page-header-button">
                + create branch
              </button>
            </ModalTrigger>
            <ModalContent>
              <div>Hello</div>
            </ModalContent>
          </Modal>
        </div>
      </section>
      <div className="page-title-container">
        <h1 className="page-title">Staff & Branch</h1>
        <div className="flex items-center space-x-4">
          <SearchInput
            placeholder="Search for Staff and Branch"
            className="bg-[#F1F2F4] w-[270px]"
            textInputClassName={`text-xs md:text-sm text-neutral-8 font-normal`}
            searchIconColor="#1E3A8A"
          />
          <div className="flex items-center space-x-3">
            <Image
              src="/icons/list-view.svg"
              alt="list view"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={toggleListView}
            />
            <Image
              src="/icons/grid-view.svg"
              alt="grid view"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={toggleGridView}
            />
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
                  // Set the selected state in the parent component
                  onStateSelect={(state: string) => setSelectedState(state)}
                />
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>

      <section className="capitalize">
        {gridView ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {branches.slice(0, 30).map((b) => (
              <BranchCard key={b.id} {...b} />
            ))}
          </div>
        ) : (
          <CustomTable
            fields={fields}
            data={branches.slice(0, 20)}
            tableHeadClassName="bg-brand-5"
            tableHeadStyle={{
              borderBottom: "1px solid rgba(234, 236, 240, 0.20)",
            }}
            tableHeadCellSx={{
              color: "#fff",
              fontWeight: 500,
              fontSize: "16px",
              border: "none",
            }}
            tableBodyCellSx={{
              fontWeight: 500,
              fontSize: "16px",
              color: "#050901",
              border: "none",
              textAlign: "center",
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
