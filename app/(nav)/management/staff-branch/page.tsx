"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Form/Button/button";
import BranchCard from "@/components/Management/Staff-And-Branches/branch-card";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import {
  type StaffAndBranchPageState,
  branchTableFields,
  type BranchApiResponse,
  transformBranchApiResponse,
} from "./data";
import Pagination from "@/components/Pagination/pagination";
import CreateBranchModal from "@/components/Management/Staff-And-Branches/create-branch-modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomLoader from "@/components/Loader/CustomLoader";
import TableLoading from "@/components/Loader/TableLoading";
import CardsLoading from "@/components/Loader/CardsLoading";
import useView from "@/hooks/useView";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { ExclamationMark } from "@/public/icons/icons";

const StaffAndBranches = () => {
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);
  const router = useRouter();
  const initialState: StaffAndBranchPageState = {
    selectedState: "",
    selectedLGA: "",
    localGovernments: [],
    branchesPageData: {
      total_pages: 1,
      current_page: 1,
      total_branches: 0,
      new_branches_count: 0,
      total_properties: 0,
      new_properties_count: 0,
      total_staffs: 0,
      new_staffs_count: 0,
      branches: [],
    },
  };
  const [state, setState] = useState<StaffAndBranchPageState>(initialState);
  const {
    selectedState,
    selectedLGA,
    localGovernments,
    branchesPageData: {
      total_pages,
      current_page,
      total_branches,
      new_branches_count,
      total_properties,
      new_properties_count,
      total_staffs,
      new_staffs_count,
      branches,
    },
  } = state;

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  const setLocalGovernments = (array: string[]) => {
    setState((state) => ({ ...state, localGovernments: array }));
  };
  const setSelectedState = (selectedState: string) => {
    setState((state) => ({ ...state, selectedState }));
  };

  const allStates = getAllStates() || [];

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add filtering logic here for branches
  };

  const StaffAndBranchFiltersWithDropdown = [
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

  const handleSelectTableItem = (item: DataItem) => {
    router.push(`/management/staff-branch/${item.id}`);
  };

  // Handle the selected state and update local governments
  useEffect(() => {
    if (selectedState) {
      const lgas = getLocalGovernments(selectedState);
      setLocalGovernments(lgas || []);
    }
  }, [selectedState]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  const handlePageChange = (page: number) => {
    setSearchQuery("");
    setState((prevState) => ({
      ...prevState,
      branchesPageData: {
        ...prevState.branchesPageData,
        current_page: page,
      },
    }));
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
  };

  const config = useMemo(
    () => ({
      params: {
        page: current_page,
        search: searchQuery,
        sort_order: sortOrder,
      },
    }),
    [current_page, searchQuery, sortOrder]
  );

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<BranchApiResponse>("branches", config);

  useRefetchOnEvent("refetchBranches", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setState((x) => ({
        ...x,
        branchesPageData: transformBranchApiResponse(apiData),
      }));
    }
  }, [apiData]);

  if (loading)
    return (
      <CustomLoader
        layout="page"
        pageTitle="Staff & Branch"
        statsCardCount={3}
      />
    );

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Branches"
            newData={new_branches_count}
            total={total_branches}
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Total Properties"
            newData={new_properties_count}
            total={total_properties}
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Total Staff"
            newData={new_staffs_count}
            total={total_staffs}
            colorScheme={3}
          />
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + create branch
            </Button>
          </ModalTrigger>
          <ModalContent>
            <CreateBranchModal />
          </ModalContent>
        </Modal>
      </div>
      <FilterBar
        azFilter
        gridView={view === "grid"}
        setGridView={() => setView("grid")}
        setListView={() => setView("list")}
        onStateSelect={(state: string) => setSelectedState(state)}
        pageTitle="Staff & Branch"
        aboutPageModalData={{
          title: "Staff & Branch",
          description:
            "This page contains a list of all Staff & Branch on the platform.",
        }}
        searchInputPlaceholder="Search for Staff & Branch"
        handleFilterApply={handleFilterApply}
        isDateTrue
        filterWithOptionsWithDropdown={StaffAndBranchFiltersWithDropdown}
        handleSearch={handleSearch}
        onSort={handleSort}
      />

      <section className="capitalize">
        {branches.length === 0 && !silentLoading ? (
          searchQuery ? (
            "No Search Found"
          ) : (
            <EmptyList
              buttonText="+ create branch"
              modalContent={<CreateBranchModal />}
              title="You have not created any branches or added any staff yet"
              body={
                <p>
                  You can create profiles for all your branches and assign staff
                  and properties to them by clicking on the &quot;Create
                  Branch&quot; button. Branch managers will have the same access
                  to their branch as you do, while you will have access to all
                  staff accounts and branches created. To learn more about this
                  page later, you can click on this icon{" "}
                  <span className="inline-block text-brand-10 align-text-top">
                    <ExclamationMark />
                  </span>{" "}
                  at the top left of the dashboard page.
                </p>
              }
            />
          )
        ) : (
          <>
            {view === "grid" ? (
              <AutoResizingGrid minWidth={284}>
                {silentLoading ? (
                  <CardsLoading />
                ) : (
                  branches.map((b) => (
                    <Link href={`/management/staff-branch/${b.id}`} key={b.id}>
                      <BranchCard {...b} />
                    </Link>
                  ))
                )}
              </AutoResizingGrid>
            ) : (
              <>
                {silentLoading ? (
                  <TableLoading />
                ) : (
                  <CustomTable
                    fields={branchTableFields}
                    data={branches}
                    tableHeadClassName="bg-brand-5 h-[76px]"
                    tableHeadStyle={{
                      borderBottom: "1px solid rgba(234, 236, 240, 0.20)",
                    }}
                    handleSelect={handleSelectTableItem}
                  />
                )}
              </>
            )}
            <Pagination
              totalPages={total_pages}
              currentPage={current_page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default StaffAndBranches;
