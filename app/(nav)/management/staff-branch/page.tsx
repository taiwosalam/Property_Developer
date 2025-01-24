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
import TableLoading from "@/components/Loader/TableLoading";
import CardsLoading from "@/components/Loader/CardsLoading";
import useView from "@/hooks/useView";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { ExclamationMark } from "@/public/icons/icons";
import { FilterResult } from "@/components/Management/Landlord/types";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import { toast } from "sonner";

const allStates = getAllStates();

const StaffAndBranches = () => {
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);
  const router = useRouter();
  const [state, setState] = useState<BranchesPageData>(initialBranchesPageData);
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
  } = state;

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const statesArray = menuOptions["State"] || [];
    const queryParams: BranchRequestParams = {
      page: 1,
      search: "",
    };
    if (statesArray.length > 0) {
      queryParams.states = statesArray.join(",");
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD");
    }
    setConfig({
      params: queryParams,
    });
  };

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });
  const handleSelectTableItem = (item: DataItem) => {
    if (item.is_active !== 1){
      toast.error("Branch is not active");
      return;
    }
    router.push(`/management/staff-branch/${item.id}`);
  };

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as BranchRequestParams,
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

  const handlePageChange = (page: number) => {
    setConfig({
      params: { ...config.params, page },
    });
  };

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort_order: order },
    });
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

  useEffect(() => {
    if (apiData) {
      setState((x) => ({
        ...transformBranchApiResponse(apiData),
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

    console.log("Branches", branches);

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
        searchInputPlaceholder="Search for Staff & Branch"
        handleFilterApply={handleFilterApply}
        appliedFilters={appliedFilters}
        isDateTrue
        dateLabel="Date Created"
        filterOptionsMenu={[
          {
            label: "State",
            value: allStates.map((state) => ({
              label: state,
              value: state,
            })),
          },
        ]}
        handleSearch={handleSearch}
        onSort={handleSort}
      />

      <section>
        {loading || silentLoading ? (
          view === "grid" ? (
            <AutoResizingGrid minWidth={284} gap={16} key="loading">
              <CardsLoading />
            </AutoResizingGrid>
          ) : (
            <TableLoading />
          )
        ) : branches.length === 0 ? (
          config.params.search || isFilterApplied() ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No Search/Filter Found
            </div>
          ) : (
            <EmptyList
              buttonText="+ create branch"
              modalContent={<CreateBranchModal branches={branches} />}
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
        ) : view === "grid" ? (
          <AutoResizingGrid minWidth={284} key="card">
            {branches.map((b) => (
              b.is_active === 1 ? (
                <Link href={`/management/staff-branch/${b.id}`} key={b.id}>
                  <BranchCard {...b} />
                </Link>
              ) : (
                <BranchCard {...b} key={b.id} />
              )
            ))}
          </AutoResizingGrid>
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
        {branches.length && (
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
