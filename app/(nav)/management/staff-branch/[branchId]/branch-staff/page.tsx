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
import { branchStaffTableFields } from "./data";
import useView from "@/hooks/useView";
import useFetch from "@/hooks/useFetch";
import { AxiosRequestConfig } from "axios";
import type { BranchStaffRequestParams, BranchStaffPageState } from "./types";
import type { FilterResult } from "@/components/Management/Landlord/types";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import CardsLoading from "@/components/Loader/CardsLoading";
import TableLoading from "@/components/Loader/TableLoading";

const BranchStaffPage = ({ params }: { params: { branchId: string } }) => {
  const { branchId } = params;
  const router = useRouter();
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
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

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add filtering logic here for branches
  };

  const {
    data: apiData,
    error,
    loading,
    isNetworkError,
    silentLoading,
  } = useFetch<any>(`staffs/${branchId}`, config);

  // useEffect(() => {
  //   if (apiData) {
  //     setState((x) => ({
  //       ...x,
  //       ...transformBranchStaffApiResponse(apiData),
  //     }));
  //   }
  // }, [apiData]);

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

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
              <CreateStaffModal branchId={branchId as string} />
            </ModalContent>
          </Modal>
        </div>
      </div>
      <FilterBar
        pageTitle="Branch Staff"
        searchInputPlaceholder="Search within Branch"
        azFilter
        filterOptions={[
          { label: "Account Officer", value: "account_officer" },
          { label: "Regular Staff", value: "regular_staff" },
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
            <AutoResizingGrid minWidth={284} gap={16}>
              <CardsLoading />
            </AutoResizingGrid>
          ) : (
            <TableLoading />
          )
        ) : state?.staffs.length === 0 ? (
          config.params.search || isFilterApplied() ? (
            "No Search/Filter Found"
          ) : (
            <EmptyList
              buttonText="+ Create New Staff"
              modalContent={<CreateStaffModal branchId={branchId as string} />}
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
          <AutoResizingGrid minWidth={284} gap={16}>
            {state?.staffs.map((staff) => (
              <Link
                key={staff.id}
                href={`/management/staff-branch/${branchId}/branch-staff/${staff.id}`}
              >
                <UserCard
                  badge_color="gray"
                  email={staff.email}
                  name={staff.name}
                  phone_number={staff.phone_number || ""}
                  user_tag={staff.position}
                  picture_url={staff.picture || ""}
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
