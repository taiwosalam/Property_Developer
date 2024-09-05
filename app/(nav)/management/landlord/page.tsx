"use client";

// Imports
import { useState } from "react";
import { GridIcon, ListIcon } from "@/public/icons/icons";
import Image from "next/image";
import AddLandlordModal from "@/components/Management/Landlord/add-landlord-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import LandlordCard from "@/components/Management/landlord-and-tenant-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import type { LandlordProps } from "@/components/Management/Landlord/types";
import type { Field } from "@/components/Table/types";
import { landlords } from "../data";
import SearchInput from "@/components/SearchInput/search-input";
import UserTag from "@/components/Tags/user-tag";
import Pagination from "@/components/Pagination/pagination";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { BadgeCheckIcon } from "@/public/icons/icons";

const Landlord = () => {
  const initialState = {
    gridView: true,
    total_pages: 50,
    current_page: 1,
  };
  const [state, setState] = useState(initialState);

  const setGridView = () => {
    setState((state) => ({ ...state, gridView: true }));
  };
  const setListView = () => {
    setState((state) => ({ ...state, gridView: false }));
  };
  const handlePageChange = (page: number) => {
    setState((state) => ({ ...state, current_page: page }));
  };

  const onClickManage = (landlord: LandlordProps) => {
    console.log("Manage clicked for:", landlord);
    // Add your logic here to manage the landlord
  };

  const onClickChat = (landlord: LandlordProps) => {
    console.log("Chat clicked for:", landlord);
    // Add your logic here to chat with the landlord
  };

  const states = getAllStates();

  const onStateSelect = (selectedState: string) => {
    const localGovernments = getLocalGovernments(selectedState);

    const updatedFilters = landlordFiltersWithOptions.map((filter) => {
      if (filter.label === "Local Government") {
        return {
          ...filter,
          value: localGovernments.map((lg) => ({
            label: lg,
            value: lg.toLowerCase(),
          })),
        };
      }
      return filter;
    });
  };

  const landlordFiltersWithOptions = [
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
    {
      label: "State",
      value: states.map((state) => ({
        label: state,
        value: state.toLowerCase(),
      })),
    },
  ];

  const landlordFiltersRadio = [
    {
      label: "Landlord Type",
      value: [
        { label: "Mobile Landlord", value: "mobile_landlord" },
        { label: "Web Landlord", value: "web_landlord" },
        { label: "All Landlords", value: "all_landlords" },
      ],
    },
  ];

  const landlordFilters = [
    { label: "Alphabetically", value: "alphabetically" },
    { label: "Registration Date", value: "registration_date" },
  ];

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add  logic here to filter landlords
  };

  const transformedLandlords = landlords.map((l) => ({
    ...l,
    full_name: (
      <p className="flex items-center gap-2">
        {`${l.first_name} ${l.last_name}`}
        <span className="text-green-700">
          <BadgeCheckIcon />
        </span>
      </p>
    ),
    user_tag: <UserTag type={l.user_tag} />,
    "manage/chat": (
      <div className="flex gap-x-[4%] items-center w-full text-white [&>button]:rounded-[4px] [&>button]:capitalize">
        <button
          type="button"
          className="py-[8px] px-[32px] text-sm font-medium bg-brand-9"
          onClick={() => onClickManage(l)}
        >
          Manage
        </button>
        <button
          type="button"
          className="py-[8px] px-[32px] text-sm font-medium bg-brand-tertiary"
          onClick={() => onClickChat(l)}
        >
          Chat
        </button>
      </div>
    ),
  }));

  const fields: Field[] = [
    {
      id: "1",
      accessor: "avatar",
      isImage: true,
      cellStyle: { paddingRight: "4px" },
    },
    {
      id: "2",
      accessor: "full_name",
      cellStyle: { paddingLeft: "4px", fontWeight: 700 },
    },
    {
      id: "3",
      accessor: "email",
      cellStyle: { fontWeight: 500, color: "#3F4247" },
    },
    {
      id: "4",
      accessor: "phone_number",
      cellStyle: { fontWeight: 500, color: "#3F4247" },
    },
    { id: "5", accessor: "user_tag" },
    { id: "6", accessor: "manage/chat" },
  ];

  const { gridView, total_pages, current_page } = state;

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
                + create new landlord
              </button>
            </ModalTrigger>
            <ModalContent>
              <AddLandlordModal />
            </ModalContent>
          </Modal>
        </div>
      </section>
      <div className="page-title-container">
        <h1 className="page-title">Landlords/Landladies (Owners)</h1>
        <div className="flex items-center gap-x-4">
          <SearchInput
            placeholder="Search for Landlords"
            className="bg-[#F1F2F4] w-[270px]"
            textInputClassName={`text-xs md:text-sm text-neutral-8 font-normal`}
            searchIconColor="#1E3A8A"
          />
          <div className="flex items-center gap-x-3">
            <button
              type="button"
              aria-label="list-view"
              className={`${
                !gridView ? "bg-black" : "bg-transparent"
              } p-[4px] rounded-md`}
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
              } p-[4px] rounded-md`}
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
                    alt="filter"
                    width={20}
                    height={20}
                  />
                  <p>Filters</p>
                </div>
              </ModalTrigger>
              <ModalContent>
                <FilterModal
                  filterOptionsWithDropdown={landlordFiltersWithOptions}
                  filterOptions={landlordFilters}
                  filterOptionsWithRadio={landlordFiltersRadio}
                  onApply={handleFilterApply}
                  onStateSelect={onStateSelect} // Pass the state selection handler
                />
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
      <section>
        {gridView ? (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(284px, 1fr))",
            }}
          >
            {landlords.slice(0, 30).map((l) => (
              <LandlordCard key={l.id} {...l} />
            ))}
          </div>
        ) : (
          <CustomTable
            displayTableHead={false}
            fields={fields}
            data={transformedLandlords.slice(0, 20)}
            tableBodyCellSx={{
              border: "none",
              textAlign: "left",
            }}
            evenRowColor="#fff"
            oddRowColor="#F1F2F4"
          />
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

export default Landlord;
