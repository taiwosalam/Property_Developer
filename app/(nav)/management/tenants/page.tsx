"use client";

// Imports
import { useEffect, useState, useCallback } from "react";
import Button from "@/components/Form/Button/button";
import TenantCard from "@/components/Management/landlord-and-tenant-card";
import type { TenantProps } from "@/components/Management/Tenants/types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import type { Field } from "@/components/Table/types";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import Pagination from "@/components/Pagination/pagination";
import UserTag from "@/components/Tags/user-tag";
import AddTenantModal from "@/components/Management/Tenants/add-tenant-modal";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { defaultTenantPageData, getAllTenants, TenantPageState } from "./data";
import { useAuthStore } from "@/store/authstrore";
import Link from "next/link";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";

const Tenants = () => {
  const accessToken = useAuthStore((state) => state.access_token);
  const initialState: TenantPageState = {
    gridView: true,
    total_pages: 50,
    current_page: 1,
    loading: true,
    error: null,
    tenantsPageData: defaultTenantPageData,
  };
  const [state, setState] = useState<TenantPageState>(initialState);
  const {
    gridView,
    total_pages,
    current_page,
    loading,
    error,
    tenantsPageData: {
      total_tenants,
      new_tenants_this_month,
      mobile_tenants,
      new_mobile_tenants_this_month,
      web_tenants,
      new_web_tenants_this_month,
      tenants,
    },
  } = state;

  const fetchLandlords = useCallback(async () => {
    try {
      const data = await getAllTenants(accessToken);
      setState((x) => ({ ...x, tenantsPageData: data }));
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error }));
    } finally {
      setState((x) => ({ ...x, loading: false }));
    }
  }, [accessToken]);

  useEffect(() => {
    // Fetch the landlords when the component mounts
    fetchLandlords();
  }, [fetchLandlords]);

  const states = getAllStates();

  const onStateSelect = (selectedState: string) => {
    const localGovernments = getLocalGovernments(selectedState);

    const updatedFilters = tenantFilterOptionssWithDropdown.map((filter) => {
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

  const tenantFilterOptionssWithDropdown = [
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
        { label: "Mobile user", value: "mobile_user" },
        { label: "Web user", value: "web_user" },
        { label: "All users", value: "all_users" },
      ],
    },
  ];

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add  logic here to filter tenant
  };

  const setGridView = () => {
    setState((state) => ({ ...state, gridView: true }));
  };
  const setListView = () => {
    setState((state) => ({ ...state, gridView: false }));
  };
  const handlePageChange = (page: number) => {
    setState((state) => ({ ...state, current_page: page }));
  };

  const onClickChat = (tenant: TenantProps) => {
    console.log("Chat clicked for:", tenant);
    // Add your logic here to chat with the landlord
  };

  const transformedTenants = tenants.map((t) => ({
    ...t,
    full_name: (
      <p className="flex items-center">
        <span className="text-ellipsis line-clamp-1">{`${t.first_name} ${t.last_name}`}</span>
        <BadgeIcon color="yellow" />
      </p>
    ),
    user_tag: <UserTag type={t.user_tag} />,
    "manage/chat": (
      <div className="flex gap-x-[4%] items-center w-full text-white text-sm font-medium [&>*]:rounded-[4px] [&>*]:capitalize [&>*]:py-[8px] [&>*]:px-[32px] [&>*]:border-2 [&>*]:border-transparent">
        <a
          href={`/management/tenant/${t.id}/manage`}
          className="bg-brand-9 hover:bg-[#0033c4b3] active:text-brand-9 active:bg-transparent active:border-brand-9"
        >
          Manage
        </a>
        <button
          type="button"
          className="bg-brand-tertiary hover:bg-[#4892e5] active:bg-transparent active:text-brand-9 active:border-brand-tertiary"
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
      accessor: "picture_url",
      isImage: true,
      cellStyle: { paddingRight: "4px" },
    },
    {
      id: "2",
      accessor: "full_name",
      cellStyle: {
        paddingLeft: "4px",
        fontWeight: 700,
        minWidth: 150,
      },
    },
    {
      id: "3",
      accessor: "email",
      cellStyle: {
        fontWeight: 500,
        color: "#3F4247",
        maxWidth: 200,
        textOverflow: "ellipsis",
        wordBreak: "break-all",
      },
    },
    {
      id: "4",
      accessor: "phone_number",
      cellStyle: { fontWeight: 500, color: "#3F4247" },
    },
    { id: "5", accessor: "user_tag" },
    { id: "6", accessor: "manage/chat" },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Users"
            newData={new_tenants_this_month}
            total={total_tenants}
          />
          <ManagementStatistcsCard
            title="Web Tenants"
            newData={new_web_tenants_this_month}
            total={web_tenants}
          />
          <ManagementStatistcsCard
            title="Mobile Tenants"
            newData={new_mobile_tenants_this_month}
            total={mobile_tenants}
          />
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + create new tenant
            </Button>
          </ModalTrigger>
          <ModalContent>
            <AddTenantModal />
          </ModalContent>
        </Modal>
      </div>

      <FilterBar azFilter gridView={gridView}
        setGridView={setGridView}
        setListView={setListView} onStateSelect={onStateSelect} pageTitle="Tenants/Occupants (Users)" aboutPageModalData={
          { title: "Tenants/Occupants (Users)", description: "This page contains a list of all tenants and occupants" }
        } searchInputPlaceholder="Search for Tenants & Occupants" handleFilterApply={handleFilterApply} isDateTrue filterOptionsWithRadio={tenantFiltersRadio} filterWithOptionsWithDropdown={tenantFilterOptionssWithDropdown} />
      <section>
        {gridView ? (
          <AutoResizingGrid minWidth={284} gap={16}>
            {tenants.map((t) => (
              <Link href={`/management/tenants/${t.id}/manage`} key={t.id}>
                <TenantCard key={t.id} {...t} cardType="tenant" />
              </Link>
            ))}
          </AutoResizingGrid>
        ) : (
          <CustomTable
            displayTableHead={false}
            fields={fields}
            data={transformedTenants}
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
