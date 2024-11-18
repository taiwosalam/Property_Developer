"use client";

// Imports
import { useEffect, useState } from "react";
import Button from "@/components/Form/Button/button";
import TenantCard from "@/components/Management/landlord-and-tenant-card";
import type { TenantProps } from "@/components/Management/Tenants/types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import Pagination from "@/components/Pagination/pagination";
import UserTag from "@/components/Tags/user-tag";
import AddTenantModal from "@/components/Management/Tenants/add-tenant-modal";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import {
  defaultTenantPageData,
  TenantPageState,
  tenantTableFields,
  type TenantApiResponse,
  TenantPageData,
  transformTenantApiResponse,
} from "./data";
import Link from "next/link";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomLoader from "@/components/Loader/CustomLoader";
import useView from "@/hooks/useView";
import useFetch from "@/hooks/useFetch";
import useSettingsStore from "@/store/settings";

const Tenants = () => {
  const view = useView();

  const { selectedOptions, setSelectedOption } = useSettingsStore();
  const [selectedView, setSelectedView] = useState<string | null>(
    selectedOptions.view
  );
  // const grid = selectedView === "grid";

  const initialState: TenantPageState = {
    gridView: selectedView === "grid",
    tenantsPageData: defaultTenantPageData,
  };

  const [state, setState] = useState<TenantPageState>(initialState);
  const {
    gridView,
    tenantsPageData: {
      total_pages,
      current_page,
      total_tenants,
      new_tenants_this_month,
      mobile_tenants,
      new_mobile_tenants_this_month,
      web_tenants,
      new_web_tenants_this_month,
      tenants,
    },
  } = state;

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

  const [searchQuery, setSearchQuery] = useState("");

  const handlePageChange = (page: number) => {
    setSearchQuery("");
    setState((state) => ({
      ...state,
      tenantsPageData: { ...state.tenantsPageData, current_page: page },
    }));
  };

  const handleSearch = async (query: string) => {
    if (!query && !searchQuery) return;
    setSearchQuery(query);
  };

  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useFetch<TenantApiResponse>(
    `tenants?page=${current_page}&search=${searchQuery}`
  );

  useEffect(() => {
    if (apiData) {
      setState((prevState) => ({
        ...prevState,
        tenantsPageData: transformTenantApiResponse(apiData),
      }));
    }
  }, [apiData]);

  // Listen for the refetch event
  useEffect(() => {
    const handleRefetch = () => {
      refetch();
    };

    window.addEventListener("refetchTenants", handleRefetch);
    return () => {
      window.removeEventListener("refetchTenants", handleRefetch);
    };
  }, [refetch]);

  const transformedTenants = tenants.map((t) => ({
    ...t,
    full_name: (
      <p className="flex items-center">
        <span className="text-ellipsis line-clamp-1">{t.name}</span>
        <BadgeIcon color={t.badge_color} />
      </p>
    ),
    user_tag: <UserTag type={t.user_tag} />,
    "manage/chat": (
      <div className="flex gap-x-[4%] items-center w-full">
        <Button
          href={`/management/tenants/${t.id}/manage`}
          size="sm_medium"
          className="px-8 py-2"
        >
          Manage
        </Button>
        <Button
          variant="sky_blue"
          size="sm_medium"
          className="px-8 py-2 bg-brand-tertiary bg-opacity-50 text-white"
          // onClick={() => onClickChat(t)}
        >
          Chat
        </Button>
      </div>
    ),
  }));

  if (loading)
    return (
      <CustomLoader
        layout="page"
        pageTitle="Tenants/Occupants (Users)"
        statsCardCount={3}
      />
    );

  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-8">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Users"
            newData={new_tenants_this_month}
            total={total_tenants}
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Web Tenants"
            newData={new_web_tenants_this_month}
            total={web_tenants}
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Mobile Tenants"
            newData={new_mobile_tenants_this_month}
            total={mobile_tenants}
            colorScheme={3}
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

      <FilterBar
        azFilter
        gridView={gridView}
        setGridView={setGridView}
        setListView={setListView}
        onStateSelect={onStateSelect}
        pageTitle="Tenants/Occupants (Users)"
        aboutPageModalData={{
          title: "Tenants/Occupants (Users)",
          description: "This page contains a list of all tenants and occupants",
        }}
        searchInputPlaceholder="Search for Tenants & Occupants"
        handleFilterApply={handleFilterApply}
        isDateTrue
        filterOptionsWithRadio={tenantFiltersRadio}
        filterWithOptionsWithDropdown={tenantFilterOptionssWithDropdown}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
      />
      <section>
        {view === "grid" || gridView ? (
          <AutoResizingGrid minWidth={284} gap={16}>
            {tenants.map((t) => (
              <Link href={`/management/tenants/${t.id}/manage`} key={t.id}>
                <TenantCard
                  key={t.id}
                  picture_url={t.picture_url}
                  name={t.name}
                  user_tag={t.user_tag}
                  badge_color={t.badge_color}
                  email={t.email}
                  phone_number={t.phone_number}
                />
              </Link>
            ))}
          </AutoResizingGrid>
        ) : (
          <CustomTable
            displayTableHead={false}
            fields={tenantTableFields}
            data={transformedTenants}
            tableBodyCellSx={{ color: "#3F4247" }}
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
