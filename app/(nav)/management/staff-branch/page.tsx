"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Form/Button/button";
import BranchCard from "@/components/Management/Staff-And-Branches/branch-card";
import CustomTable from "@/components/Table/table";
import type { Field, DataItem } from "@/components/Table/types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import { type StaffAndBranchPageState, getAllBranches } from "./data";
import Pagination from "@/components/Pagination/pagination";
import CreateBranchModal from "@/components/Management/Staff-And-Branches/create-branch-modal";
import { useAuthStore } from "@/store/authstrore";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomLoader from "@/components/Loader/CustomLoader";
import useDarkMode from "@/hooks/useCheckDarkMode";

const StaffAndBranches = () => {
  const isDarkMode = useDarkMode();
  const router = useRouter();
  const initialState: StaffAndBranchPageState = {
    gridView: true,
    total_pages: 50,
    current_page: 1,
    selectedState: "",
    selectedLGA: "",
    localGovernments: [],
    loading: true,
    error: null,
    branchesPageData: {
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
    gridView,
    total_pages,
    current_page,
    selectedState,
    selectedLGA,
    localGovernments,
    loading,
    error,
    branchesPageData: {
      total_branches,
      new_branches_count,
      total_properties,
      new_properties_count,
      total_staffs,
      new_staffs_count,
      branches,
    },
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

  const handleSelectTableItem = (item: DataItem) => {
    router.push(`/management/staff-branch/${item.id}`);
  };

  const accessToken = useAuthStore((state) => state.access_token);

  const fetchLandlords = useCallback(async () => {
    try {
      const data = await getAllBranches(accessToken);
      setState((x) => ({ ...x, branchesPageData: data }));
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error }));
    } finally {
      setState((x) => ({ ...x, loading: false }));
    }
  }, [accessToken]);

  // Handle the selected state and update local governments
  useEffect(() => {
    if (selectedState) {
      const lgas = getLocalGovernments(selectedState);
      setLocalGovernments(lgas || []);
    }
  }, [selectedState]);

  useEffect(() => {
    // Fetch the landlords when the component mounts
    fetchLandlords();
  }, [fetchLandlords]);

  // console.log(branches);

  if (loading)
    return (
      <CustomLoader
        layout="page"
        pageTitle="Staff & Branch"
        statsCardCount={3}
      />
    );

  if (error) return <div>Error: {error.message}</div>;


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
        gridView={gridView}
        setGridView={setGridView}
        setListView={setListView}
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
      />

      <section className="capitalize">
        {gridView ? (
          <AutoResizingGrid minWidth={284}>
            {branches.map((b) => (
              <Link href={`/management/staff-branch/${b.id}`} key={b.id}>
                <BranchCard key={b.id} {...b} />
              </Link>
            ))}
          </AutoResizingGrid>
        ) : (
          <CustomTable
            fields={tableFields}
            data={branches}
            tableHeadClassName="bg-brand-5 h-[76px]"
            tableHeadStyle={{
              borderBottom: "1px solid rgba(234, 236, 240, 0.20)",
            }}
            handleSelect={handleSelectTableItem}
            tableHeadCellSx={{
              color: isDarkMode ? "#EFF6FF" : "#050901",
              fontWeight: 500,
              border: "none",
              textAlign: "left",
            }}
            tableBodyCellSx={{
              fontWeight: 500,
              color: isDarkMode ? "#fff" : "#050901",
              border: "none",
              textAlign: "left",
            }}
            evenRowColor={isDarkMode ? "#3C3D37" : "#fff"}
            oddRowColor={isDarkMode ? "#020617" : "#FAFAFA"}
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

export default StaffAndBranches;
