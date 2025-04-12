"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Form/Button/button";
import BranchCard from "@/components/Management/Staff-And-Branches/branch-card";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { getAllStates } from "@/utils/states";
import {
  type BranchesPageData,
  initialBranchesPageData,
  branchTableFields,
  type BranchApiResponse,
  type BranchRequestParams,
  transformBranchApiResponse,
} from "./data";
import Pagination from "@/components/Pagination/pagination";
import CreateBranchModal from "@/components/Management/Staff-And-Branches/create-branch-modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomLoader from "@/components/Loader/CustomLoader";
import CardsLoading from "@/components/Loader/CardsLoading";
import useView from "@/hooks/useView";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { FilterResult } from "@/components/Management/Landlord/types";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import { toast } from "sonner";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import ServerError from "@/components/Error/ServerError";

const allStates = getAllStates();

const StaffAndBranches = () => {
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);
  const router = useRouter();

  // For grid view we use this ref to scroll to top when changing pages.
  const contentTopRef = useRef<HTMLDivElement>(null);

  const [pageData, setPageData] = useState<BranchesPageData>(
    initialBranchesPageData
  );
  const {
    total_pages,
    current_page,
    total_branches,
    new_branches_count,
    total_properties,
    new_properties_count,
    total_staffs,
    new_staffs_count,
    branches,
  } = pageData;

  // Update view if storedView changes.
  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  // When view changes, reset page to 1 and clear branch list,
  // then trigger a refetch (similar to the Landlord page)
  useEffect(() => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      params: { ...prevConfig.params, page: 1 },
    }));
    setPageData((prevData) => ({
      ...prevData,
      branches: [],
      current_page: 1,
    }));
    window.dispatchEvent(new Event("refetchBranches"));
  }, [view]);

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const isFilterApplied = () => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const statesArray = menuOptions["State"] || [];
    const queryParams: BranchRequestParams = { page: 1, search: "" };
    if (statesArray.length > 0) {
      queryParams.states = statesArray.join(",");
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD");
    }
    setConfig({ params: queryParams });
  };

  const handleSelectTableItem = (item: DataItem) => {
    if (item.is_active !== 1) {
      toast.error("Branch is not active");
      return;
    }
    router.push(`/management/staff-branch/${item.id}`);
  };

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: { page: 1, search: "" } as BranchRequestParams,
  });

  // Manual page change (Pagination) triggers scroll only in grid view.
  const handlePageChange = (page: number) => {
    setConfig({ params: { ...config.params, page } });
    if (view === "grid" && contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = async (query: string) => {
    setConfig({ params: { ...config.params, search: query } });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({ params: { ...config.params, sort_order: order } });
  };

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<BranchApiResponse>("branches", config);
  useRefetchOnEvent("refetchBranches", () => refetch({ silent: true }));

  // Merge fetched data with current list.
  // Mimic Landlord page: replace if grid view or new page is 1, else append.
  useEffect(() => {
    if (apiData) {
      const transformedData = transformBranchApiResponse(apiData);
      setPageData((prevData) => {
        const updatedBranches =
          view === "grid" || transformedData.current_page === 1
            ? transformedData.branches
            : [...prevData.branches, ...transformedData.branches];
        return { ...transformedData, branches: updatedBranches };
      });
    }
  }, [apiData, view]);

  // --- Infinite Scroll for List View ---
  // Use an IntersectionObserver (only in list view) to trigger fetching next page.
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          current_page < total_pages &&
          !silentLoading
        ) {
          // In list view we simply set config with the new page.
          setConfig((prev) => ({
            params: { ...prev.params, page: current_page + 1 },
          }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [current_page, total_pages, silentLoading]
  );

  // In list view, attach observer ref on the last row.
  const transformedBranches =
    view === "list"
      ? branches.map((b, index) => ({
          ...b,
          ref:
            index === branches.length - 1 && current_page < total_pages
              ? lastRowRef
              : undefined,
        }))
      : branches;

  // Show full-page loader only on the very first load.
  if (loading && current_page === 1)
    return (
      <CustomLoader
        layout="page"
        pageTitle="Staff & Branch"
        statsCardCount={3}
      />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      {/* For grid view use the contentTopRef so that manual pagination scrolls to top */}
      <div
        className="page-header-container"
        ref={view === "grid" ? contentTopRef : null}
      >
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
            <CreateBranchModal branches={branches} />
          </ModalContent>
        </Modal>
      </div>
      <FilterBar
        azFilter
        gridView={view === "grid"}
        setGridView={() => setView("grid")}
        setListView={() => setView("list")}
        pageTitle="Staff & Branch"
        aboutPageModalData={{
          title: "Staff & Branch",
          description:
            "This page contains a list of all Staff & Branch on the platform.",
        }}
        searchInputPlaceholder="Search Branch"
        handleFilterApply={handleFilterApply}
        appliedFilters={appliedFilters}
        isDateTrue
        dateLabel="Date Created"
        filterOptionsMenu={[
          {
            label: "State",
            value: allStates.map((state) => ({ label: state, value: state })),
          },
        ]}
        handleSearch={handleSearch}
        onSort={handleSort}
      />
      <section className="findthezero">
        {branches.length === 0 ? (
          config.params.search || isFilterApplied() ? (
            <SearchError />
          ) : (
            <EmptyList
              buttonText="+ create branch"
              modalContent={<CreateBranchModal branches={branches} />}
              title="No branches or staff have been added yet."
              body={
                <p>
                  You can create profiles for all your branches and assign staff
                  and properties to them by clicking on the &quot;Create
                  Branch&quot; button. Branch managers will have the same access
                  to their branch as you do, while you will have access to all
                  staff accounts and branches created.
                  <br />
                  <br />
                  To learn more about this page later, click your profile
                  picture at the top right of the dashboard and select
                  Assistance & Support.
                </p>
              }
            />
          )
        ) : view === "grid" ? (
          <AutoResizingGrid minWidth={284} key="card">
            {branches.map((b) =>
              b.is_active === 1 ? (
                <Link href={`/management/staff-branch/${b.id}`} key={b.id}>
                  <BranchCard {...b} />
                </Link>
              ) : (
                <BranchCard {...b} key={b.id} />
              )
            )}
          </AutoResizingGrid>
        ) : (
          <>
            <CustomTable
              displayTableHead={false}
              fields={branchTableFields}
              data={transformedBranches}
              tableHeadClassName="bg-brand-5 h-[76px]"
              tableHeadStyle={{
                borderBottom: "1px solid rgba(234, 236, 240, 0.20)",
              }}
              handleSelect={handleSelectTableItem}
            />
            {silentLoading && current_page > 1 && (
              <div className="flex items-center justify-center py-4 my-8">
                <div className="loader" />
              </div>
            )}
          </>
        )}
        {view === "grid" && (
          <Pagination
            totalPages={total_pages}
            currentPage={current_page}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </div>
  );
};

export default StaffAndBranches;
