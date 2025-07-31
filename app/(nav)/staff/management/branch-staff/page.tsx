"use client";
import clsx from "clsx";
import BackButton from "@/components/BackButton/back-button";
import UserCard from "@/components/Management/landlord-and-tenant-card";
import FilterBar from "@/components/FIlterBar/FilterBar";
import Button from "@/components/Form/Button/button";
import CreateStaffModal from "@/components/Management/Staff-And-Branches/create-staff-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Pagination from "@/components/Pagination/pagination";
import { LocationIcon } from "@/public/icons/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import type { DataItem } from "@/components/Table/types";
import CustomTable from "@/components/Table/table";
import { branchStaffTableFields, transformStaffListResponse } from "./data";
import useView from "@/hooks/useView";
import useFetch from "@/hooks/useFetch";
import { AxiosRequestConfig } from "axios";
import type {
  BranchStaffRequestParams,
  BranchStaffPageState,
  StaffListResponse,
} from "./types";
import type { FilterResult } from "@/components/Management/Landlord/types";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import CardsLoading from "@/components/Loader/CardsLoading";
import TableLoading from "@/components/Loader/TableLoading";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";

const BranchStaffPage = () => {
  const { branch } = usePersonalInfoStore();
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);
  const companyVerified = usePersonalInfoStore((state) => state.is_verified);
  const BRANCH_ID = branch?.branch_id || 0;
  const router = useRouter();
  const branchName = branch?.branch_name;

  const gridSectionRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<AxiosRequestConfig>(() => {
    const savedPage = sessionStorage.getItem(`staff_page_${BRANCH_ID}`);
    return {
      params: {
        page: savedPage ? parseInt(savedPage, 10) : 1,
      } as BranchStaffRequestParams,
    };
  });

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

  const [state, setState] = useState<BranchStaffPageState>({
    total_pages: 0,
    current_page: parseInt(
      sessionStorage.getItem(`staff_page_${BRANCH_ID}`) || "1",
      10
    ),
    branch_name: "",
    branch_address: "",
    staffs: [],
    staff_count_by_role: {
      "account officer": 0,
      staff: 0,
      account_officer: 0,
      manager: 0,
    },
    total_data_count: 0,
  });

  // Save page number to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(
      `staff_page_${BRANCH_ID}`,
      state.current_page.toString()
    );
  }, [state.current_page, BRANCH_ID]);

  const handlePageChange = (page: number) => {
    setConfig({
      params: { ...config.params, page },
    });
    if (view === "grid" && gridSectionRef.current) {
      gridSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort_order: order },
    });
  };

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query, current_page: 1 },
    });
    sessionStorage.setItem(`staff_page_${BRANCH_ID}`, "1");
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const position = menuOptions["Position"]?.[0];
    const queryParams: BranchStaffRequestParams = {
      page: 1,
      search: "",
    };
    setConfig({
      params: queryParams,
    });
    setState((prevState) => ({
      ...prevState,
      staffs: [],
      current_page: 1,
    }));
    sessionStorage.setItem(`staff_page_${BRANCH_ID}`, "1");
  };

  const {
    data: apiData,
    error,
    loading,
    isNetworkError,
    silentLoading,
    refetch,
  } = useFetch<StaffListResponse>("staffs", config);

  useRefetchOnEvent("refetch_staff", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setState((x) => ({
        ...x,
        ...transformStaffListResponse(apiData),
      }));
    }
  }, [apiData]);

  useEffect(() => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      params: { ...prevConfig.params, page: 1 },
    }));
    setState((prevData) => ({
      ...prevData,
      staffs: [],
      current_page: 1,
    }));
    window.dispatchEvent(new Event("refetch_staff"));
  }, [view]);

  useEffect(() => {
    if (apiData) {
      const transformedData = transformStaffListResponse(apiData);
      setState((prevState) => {
        const newStaffs =
          view === "grid" || transformedData.current_page === 1
            ? transformedData.staffs
            : [...prevState?.staffs, ...transformedData.staffs];
        return {
          ...transformedData,
          staffs: newStaffs,
        };
      });
    }
  }, [apiData, view]);

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading || silentLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          state.current_page < state.total_pages
        ) {
          handlePageChange(state.current_page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, silentLoading, state.current_page, state.total_pages]
  );

  const transformedTableData = state.staffs.map((item, index) => ({
    ...item,
    gender: ["male", "female"].includes(item.gender?.toLowerCase() || "") ? (
      <p
        className={clsx(
          item.gender?.toLowerCase() === "male"
            ? "bg-support-1"
            : "bg-support-2",
          "p-2 rounded-lg text-white w-8 h-8 flex items-center justify-center"
        )}
      >
        {item.gender?.charAt(0).toUpperCase()}
      </p>
    ) : (
      ""
    ),
    ref:
      index === state.staffs.length - 1 &&
      state.current_page < state.total_pages
        ? lastRowRef
        : undefined,
  }));

  const handleSelectTableItem = (item: DataItem) => {
    router.push(
      `staff/management/branch-staff/${item.id}`
    );
  };

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="custom-flex-col gap-6">
      <div className="w-full gap-2 flex items-center justify-between flex-wrap">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Staff"
            newData={state.total_data_count}
            total={state.total_data_count}
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Account Manager"
            newData={state.staff_count_by_role["account officer"]}
            total={state.staff_count_by_role["account officer"]}
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Other Staff"
            newData={state.staff_count_by_role.staff}
            total={state.staff_count_by_role.staff}
            colorScheme={3}
          />
        </div>
      </div>
      <FilterBar
        azFilter
        noFilterButton
        pageTitle={`${branchName !== null ? branchName : "Branch"} Staff`}
        searchInputPlaceholder="Search within Branch"
        handleFilterApply={handleFilterApply}
        gridView={view === "grid"}
        setGridView={() => setView("grid")}
        setListView={() => setView("list")}
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
        ) : state?.staffs.length === 0 ? (
          config.params.search || isFilterApplied() ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="The branch staff is empty"
              body={
                <p>
                  You can view other staffs once they are added by the manager or the director.
                </p>
              }
            />
          )
        ) : view === "grid" ? (
          <AutoResizingGrid minWidth={284} gap={16} key="data">
            {state?.staffs.map((staff) => (
              <Link
                key={staff.id}
                href={`/staff/management/branch-staff/${staff.id}`}
              >
                <UserCard
                  badge_color={staff.badge_color}
                  email={staff.email}
                  name={staff.name}
                  phone_number={staff.phone_number}
                  user_tag={staff.position}
                  isOnline={staff.isOnline}
                  picture_url={staff.picture}
                />
              </Link>
            ))}
          </AutoResizingGrid>
        ) : (
          <CustomTable
            fields={branchStaffTableFields}
            data={transformedTableData || []}
            tableBodyCellSx={{ fontSize: "1rem" }}
            tableHeadCellSx={{ fontSize: "1rem", height: 70 }}
            handleSelect={handleSelectTableItem}
          />
        )}
        {state && state.staffs.length && (
          <Pagination
            totalPages={state.total_pages}
            currentPage={state.current_page}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </div>
  );
};

export default BranchStaffPage;
