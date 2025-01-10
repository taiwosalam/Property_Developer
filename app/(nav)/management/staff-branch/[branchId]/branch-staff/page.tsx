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
import { useEffect, useState } from "react";
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
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";

const BranchStaffPage = ({ params }: { params: { branchId: string } }) => {
  const { branchId } = params;
  const router = useRouter();
  const companyVerified = usePersonalInfoStore((state) => state.is_verified);
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
    } as BranchStaffRequestParams,
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

  const [state, setState] = useState<BranchStaffPageState | null>(null);

  const handlePageChange = (page: number) => {
    setConfig({
      params: { ...config.params, page },
    });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort_order: order },
    });
  };

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const position = menuOptions["Position"]?.[0];
    const queryParams: BranchStaffRequestParams = {
      page: 1,
      search: "",
    };
    if (position) {
      queryParams.staff_positiion = position;
    }
    // if (startDate) {
    //   queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD");
    // }
    // if (endDate) {
    //   queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD");
    // }
    setConfig({
      params: queryParams,
    });
  };

  const {
    data: apiData,
    error,
    loading,
    isNetworkError,
    silentLoading,
    refetch,
  } = useFetch<StaffListResponse>(`staffs?branch_id=${branchId}`, config);

  useEffect(() => {
    console.log("apiData", apiData);
    if (apiData) {
      setState((x) => ({
        ...x,
        ...transformStaffListResponse(apiData),
      }));
    }
  }, [apiData]);

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  useRefetchOnEvent("refetch_staff", () => refetch({ silent: true }));

  const transformedTableData = state?.staffs.map((item) => ({
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
  }));

  const handleSelectTableItem = (item: DataItem) => {
    router.push(`/management/staff-branch/${branchId}/branch-staff/${item.id}`);
  };

  // console.log("staff", state)

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="custom-flex-col gap-6">
      <div className="w-full gap-2 flex items-center justify-between flex-wrap">
        <BackButton reducePaddingTop as="div" className="items-start">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
            {loading ? "Loading..." : state?.branch_name || "Branch Name"}
          </h1>
          <div className="text-text-disabled flex items-center space-x-1">
            <LocationIcon />
            <p className="text-sm font-medium">
              {loading
                ? "Loading..."
                : state?.branch_address || "Branch Address"}
            </p>
          </div>
        </BackButton>
        <div className="flex items-center justify-between gap-2 ml-auto flex-wrap">
          <Modal>
            <ModalTrigger asChild>
              <Button
                type="button"
                variant="border"
                className="page-header-button"
              >
                + create staff
              </Button>
            </ModalTrigger>
            <ModalContent>
              <CreateStaffModal
                branchId={branchId as string}
                hasManager={true}
              />
            </ModalContent>
          </Modal>
        </div>
      </div>
      <FilterBar
        pageTitle="Branch Staff"
        searchInputPlaceholder="Search within Branch"
        azFilter
        filterOptionsMenu={[
          {
            label: "Position",
            radio: true,
            value: [
              { label: "Account Officer", value: "account_officer" },
              { label: "Staff", value: "staff" },
              { label: "Branch Manager", value: "manager" },
            ],
          },
        ]}
        handleFilterApply={handleFilterApply}
        gridView={view === "grid"}
        setGridView={() => setView("grid")}
        setListView={() => setView("list")}
        appliedFilters={appliedFilters}
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
              buttonText="+ Create New Staff"
              modalContent={
                <CreateStaffModal
                  branchId={branchId as string}
                  hasManager={true}
                />
              }
              title="The branch staff is empty"
              body={
                <p>
                  You can create a staff by clicking on the &quot;Create
                  Staff&quot; button.
                </p>
              }
            />
          )
        ) : view === "grid" ? (
          <AutoResizingGrid minWidth={284} gap={16} key="data">
            {state?.staffs.map((staff) => (
              <Link
                key={staff.id}
                href={`/management/staff-branch/${branchId}/branch-staff/${staff.id}`}
              >
                <UserCard
                  badge_color={companyVerified ? "gray" : undefined}
                  email={staff.email}
                  name={staff.name}
                  phone_number={staff.phone_number}
                  user_tag={staff.position}
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
