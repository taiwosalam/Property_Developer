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
import { useAuthStore } from "@/store/authstrore";
import { useEffect, useState } from "react";
import { getOneBranch } from "../../data";
import { PageState } from "../data";
import { useParams } from "next/navigation";
import { ResponseType } from "../types";
import Link from "next/link";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import CustomTable from "@/components/Table/table";
import { branchStaffTableFields, branchStaffTableData } from "./data";

const BranchStaffPage = () => {
  const BranchFilters = [{ label: "Alphabetically", value: "alphabetically" }];

  const branchFiltersWithOptions = [
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
  ];

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add filtering logic here for branches
  };
  const initialState = {
    gridView: true,
    total_pages: 50,
    current_page: 1,
    selectedState: "",
    localGovernments: [],
  };
  const [state, setState] = useState<PageState>(initialState);
  const [fetchedBranchData, setFetchedBranchData] =
    useState<ResponseType | null>();

  const { gridView, total_pages, current_page } = state;
  const { branchId } = useParams();

  const setGridView = () => {
    setState((state) => ({ ...state, gridView: true }));
  };
  const setListView = () => {
    setState((state) => ({ ...state, gridView: false }));
  };
  const handlePageChange = (page: number) => {
    setState((state) => ({ ...state, current_page: page }));
  };
  const setSelectedState = (selectedState: string) => {
    setState((state) => ({ ...state, selectedState }));
  };
  const accessToken = useAuthStore((state) => state.access_token);

  useEffect(() => {
    const fetchBranchData = async () => {
      if (typeof branchId === "string") {
        const data = await getOneBranch(branchId, accessToken);
        setFetchedBranchData(data);
        console.log(data);
      } else {
        console.error("Invalid branchId:", branchId);
      }
    };

    fetchBranchData();
  }, [accessToken, branchId]);

  const transformedTableData = branchStaffTableData.map((item) => ({
    ...item,
    gender: (
      <p
        className={clsx(
          item.gender === "Male" ? "bg-support-1" : "bg-support-2",
          "p-2 rounded-lg text-white w-8 h-8 flex items-center justify-center"
        )}
      >
        {item.gender.charAt(0).toUpperCase()}
      </p>
    ),
  }));

  return (
    <div className="custom-flex-col gap-6">
      <div className="w-full gap-2 flex items-center justify-between flex-wrap">
        <div>
          <BackButton>
            {/* Samuel, h1 child of h1, hydration error. Backbutton is h1 */}
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
              {fetchedBranchData?.branch?.branch_title || "Null"}
            </h1>
            <div className="text-text-disabled flex items-center space-x-1">
              <LocationIcon />
              <p className="text-sm font-medium">
                {fetchedBranchData?.branch?.branch_full_address || "Null"}
              </p>
            </div>
          </BackButton>
        </div>
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
        filterOptions={BranchFilters}
        filterWithOptionsWithDropdown={branchFiltersWithOptions}
        onStateSelect={(state: string) => setSelectedState(state)}
        handleFilterApply={handleFilterApply}
        isDateTrue
        gridView={gridView}
        setGridView={setGridView}
        setListView={setListView}
      />
      {/* staff cards */}
      {gridView ? (
        <AutoResizingGrid minWidth={284}>
          {Array.from({ length: 20 }).map((_, index) => (
            <Link key={index} href="">
              <UserCard
                badge_color="black"
                email="test@test.com"
                name="John Doe"
                phone_number="123-456-7890"
                user_tag="Manager"
                picture_url=""
              />
            </Link>
          ))}
        </AutoResizingGrid>
      ) : (
        <CustomTable
          fields={branchStaffTableFields}
          data={transformedTableData}
          tableBodyCellSx={{ fontSize: "1rem" }}
          tableHeadCellSx={{ fontSize: "1rem", height: 70 }}
        />
      )}
      <Pagination
        totalPages={total_pages}
        currentPage={current_page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default BranchStaffPage;
