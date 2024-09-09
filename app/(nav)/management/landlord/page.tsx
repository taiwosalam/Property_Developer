"use client";

// Imports
import { useState } from "react";
import clsx from "clsx";
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
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import PageTitle from "@/components/PageTitle/page-title";
import AboutPage from "@/components/AboutPage/about-page";
import Button from "@/components/Form/Button/button";

const Landlord = () => {
  const initialState = {
    gridView: true,
    total_pages: 50,
    current_page: 1,
  };
  const [state, setState] = useState(initialState);
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
    { label: "Registration Date", value: "registration_date" },
    { label: "Alphabetically", value: "alphabetically" },
  ];

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add  logic here to filter landlords
  };

  const transformedLandlords = landlords.map((l) => ({
    ...l,
    full_name: (
      <p className="flex items-center">
        {`${l.first_name} ${l.last_name}`}
        <BadgeIcon color="red" />
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

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <ManagementStatistcsCard
            title="Total Landlords"
            old={100}
            newData={200}
            total={300}
          />
          <ManagementStatistcsCard
            title="Web Landlords"
            old={100}
            newData={200}
            total={300}
          />
          <ManagementStatistcsCard
            title="Mobile Landlords"
            old={100}
            newData={200}
            total={300}
          />
          <div className="hidden md:block xl:hidden">
            <div className="flex items-center justify-center w-full h-full">
              <Modal>
                <ModalTrigger asChild>
                  <Button type="button" className="page-header-button">
                    + create new landlord
                  </Button>
                </ModalTrigger>
                <ModalContent>
                  <AddLandlordModal />
                </ModalContent>
              </Modal>
            </div>
          </div>
        </div>
        <div className="md:hidden xl:flex lg:ml-4">
          <Modal>
            <ModalTrigger asChild>
              <Button type="button" className="page-header-button">
                + create new landlord
              </Button>
            </ModalTrigger>
            <ModalContent>
              <AddLandlordModal />
            </ModalContent>
          </Modal>
        </div>
      </div>

      <div className="page-title-container">
        <PageTitle
          title="Landlords/Landladies (Owners)"
          aboutPageModal={
            <AboutPage
              title="Landlords"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer rhoncus nunc interdum turpis bibendum, quis molestie sapien convallis. Vivamus porta elementum nibh, vel placerat mauris vehicula non. Ut maximus vehicula tortor, nec pretium lacus venenatis id. Morbi pretium aliquet nisi, nec vestibulum nibh blandit in. "
            />
          }
        />
        <div className="flex items-center gap-x-4">
          <SearchInput placeholder="Search for Landlords" />
          <div className="flex items-center gap-x-3">
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
        />
      </section>
    </div>
  );
};

export default Landlord;
