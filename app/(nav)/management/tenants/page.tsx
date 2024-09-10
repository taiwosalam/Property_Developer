"use client";
import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import Button from "@/components/Form/Button/button";
import { GridIcon, ListIcon } from "@/public/icons/icons";
import TenantCard from "@/components/Management/landlord-and-tenant-card";
import type { TenantProps } from "@/components/Management/Tenants/types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import type { Field } from "@/components/Table/types";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import { landlords as tenants } from "../data";
import SearchInput from "@/components/SearchInput/search-input";
import Pagination from "@/components/Pagination/pagination";
import UserTag from "@/components/Tags/user-tag";
import AddTenantModal from "@/components/Management/Tenants/add-tenant-modal";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import PageTitle from "@/components/PageTitle/page-title";

const Tenants = () => {
  const initialState = {
    gridView: true,
    total_pages: 50,
    current_page: 1,
  };

  const states = getAllStates();

  const onStateSelect = (selectedState: string) => {
    const localGovernments = getLocalGovernments(selectedState);

    const updatedFilters = tenantFiltersWithOptions.map((filter) => {
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

  const tenantFilters = [
    { label: "Alphabetically", value: "alphabetically" },
    { label: "Tenants", value: "tenants" },
    { label: "Occupants", value: "occupants" },
  ];

  const tenantFiltersWithOptions = [
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

  const tenantFiltersRadio = [
    {
      label: "Tenant Type",
      value: [
        { label: "Mobile Tenant", value: "mobile_tenant" },
        { label: "Web Tenant", value: "web_tenant" },
        { label: "All Tenant", value: "all_tenants" },
      ],
    },
  ];

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add  logic here to filter tenant
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

  const onClickManage = (tenant: TenantProps) => {
    console.log("Manage clicked for:", tenant);
    // Add your logic here to manage the landlord
  };

  const onClickChat = (tenant: TenantProps) => {
    console.log("Chat clicked for:", tenant);
    // Add your logic here to chat with the landlord
  };

  const transformedTenants = tenants.map((t) => ({
    ...t,
    full_name: (
      <p className="flex items-center">
        {`${t.first_name} ${t.last_name}`}
        <BadgeIcon color="yellow" />
      </p>
    ),
    user_tag: <UserTag type={t.user_tag} />,
    "manage/chat": (
      <div className="flex gap-x-[4%] items-center w-full text-white [&>button]:rounded-[4px] [&>button]:capitalize">
        <button
          type="button"
          className="py-[8px] px-[32px] text-sm font-medium bg-brand-9"
          onClick={() => onClickManage(t)}
        >
          Manage
        </button>
        <button
          type="button"
          className="py-[8px] px-[32px] text-sm font-medium bg-brand-tertiary"
          onClick={() => onClickChat(t)}
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
      <div className="page-header-container">
        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <ManagementStatistcsCard
            title="Total Users"
            old={100}
            newData={200}
            total={300}
          />
          <ManagementStatistcsCard
            title="Web Tenants"
            old={100}
            newData={200}
            total={300}
          />
          <ManagementStatistcsCard
            title="Mobile Tenants"
            old={100}
            newData={200}
            total={300}
          />
          <div className="hidden md:block xl:hidden">
            <div className="flex items-center justify-center w-full h-full">
              <Modal>
                <ModalTrigger asChild>
                  <Button type="button" className="page-header-button">
                    + create new tenant
                  </Button>
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
              <Button type="button" className="page-header-button">
                + create new tenant
              </Button>
            </ModalTrigger>
            <ModalContent>
              <div>Hello</div>
            </ModalContent>
          </Modal>
        </div>
      </div>

      <div className="page-title-container">
        <PageTitle title="Tenants/Occupants (Users)" />
        <div className="flex items-center gap-x-4">
          <SearchInput placeholder="Search for Tenants & Occupants" />
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
                  filterOptions={tenantFilters}
                  filterOptionsWithRadio={tenantFiltersRadio}
                  filterOptionsWithDropdown={tenantFiltersWithOptions}
                  onApply={handleFilterApply}
                  onStateSelect={onStateSelect}
                  date={true}
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
            {tenants.slice(0, 30).map((t) => (
              <TenantCard key={t.id} {...t} />
            ))}
          </div>
        ) : (
          <CustomTable
            displayTableHead={false}
            fields={fields}
            data={transformedTenants.slice(0, 20)}
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

export default Tenants;
