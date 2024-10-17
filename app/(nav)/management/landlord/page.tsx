"use client";

// Imports
import { useEffect, useState, useCallback } from "react";
import AddLandlordModal from "@/components/Management/Landlord/add-landlord-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import LandlordCard from "@/components/Management/landlord-and-tenant-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Link from "next/link";
import CustomTable from "@/components/Table/table";
import type { LandlordProps } from "@/components/Management/Landlord/types";
import type { Field } from "@/components/Table/types";
import UserTag from "@/components/Tags/user-tag";
import Pagination from "@/components/Pagination/pagination";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Button from "@/components/Form/Button/button";
import {
  getAllLandlords,
  getLandlordsHelpInfo,
  LandlordPageState,
} from "./data";
import { useAuthStore } from "@/store/authstrore";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { LandlordHelpInfo } from "./types";
import { title } from "process";
import GlobalPageLoader from "@/components/Loader/global-page-loader";

const Landlord = () => {
  const accessToken = useAuthStore((state) => state.access_token);
  const initialState: LandlordPageState = {
    gridView: true,
    total_pages: 5,
    current_page: 1,
    loading: true,
    error: null,
    landlordsPageData: {
      total_landlords: 0,
      new_landlords_this_month: 0,
      mobile_landlords: 0,
      new_mobile_landlords_this_month: 0,
      web_landlords: 0,
      new_web_landlords_this_month: 0,
      landlords: [],
    },
  };
  const [state, setState] = useState<LandlordPageState>(initialState);
  const {
    gridView,
    total_pages,
    current_page,
    loading,
    error,
    landlordsPageData: {
      total_landlords,
      new_landlords_this_month,
      mobile_landlords,
      new_mobile_landlords_this_month,
      web_landlords,
      new_web_landlords_this_month,
      landlords,
    },
  } = state;

  const setGridView = () => {
    setState((state) => ({ ...state, gridView: true }));
  };

  const setListView = () => {
    setState((state) => ({ ...state, gridView: false }));
  };

  const [fetchedLandlordHelpInfo, setFetchedLandlordHelpInfo] =
    useState<LandlordHelpInfo>();

  // Fetch the landlords when the component mounts
  const fetchLandlords = useCallback(async () => {
    try {
      const data = await getAllLandlords(accessToken);
      setState((x) => ({ ...x, landlordsPageData: data }));
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error }));
    } finally {
      setState((x) => ({ ...x, loading: false }));
    }
  }, [accessToken]);

  const fetchLandlordHelpe = async () => {
    try {
      const data = await getLandlordsHelpInfo();
      console.log(data.res[0]);
      setFetchedLandlordHelpInfo(data.res[0]);
    } catch (error) {
      console.error("Error fetching landlord help info:", error);
    }
  };

  useEffect(() => {
    fetchLandlords();
    fetchLandlordHelpe();
  }, [fetchLandlords]);

  const handlePageChange = (page: number) => {
    setState((state) => ({ ...state, current_page: page }));
  };

  const onClickChat = (landlord: LandlordProps) => {
    console.log("Chat clicked for:", landlord);
    // Add your logic here to chat with the landlord
  };

  const states = getAllStates();

  const onStateSelect = (selectedState: string) => {
    const localGovernments = getLocalGovernments(selectedState);

    const updatedFilters = landlordFiltersWithDropdown.map((filter) => {
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

  const landlordFiltersWithDropdown = [
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

  const landlordFiltersRadio = [
    {
      label: "Landlord Type",
      value: [
        { label: "Mobile Landlord", value: "mobile_landlord" },
        { label: "Web Landlord", value: "web_landlord" },
        { label: "All Landlords", value: "all_landlords" },
      ],
    },
  ];

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add  logic here to filter landlords
  };

  const transformedLandlords = landlords.map((l) => ({
    ...l,
    full_name: (
      <p className="flex items-center">
        <span className="text-ellipsis line-clamp-1">{`${l.first_name} ${l.last_name}`}</span>
        <BadgeIcon color="red" />
      </p>
    ),
    user_tag: <UserTag type={l.user_tag} />,
    "manage/chat": (
      <div className="flex gap-x-[4%] items-center w-full text-white text-sm font-medium [&>*]:rounded-[4px] [&>*]:capitalize [&>*]:py-[8px] [&>*]:px-[32px] [&>*]:border-2 [&>*]:border-transparent">
        <a
          href={`/management/landlord/${l.id}/manage`}
          className="bg-brand-9 hover:bg-[#0033c4b3] active:text-brand-9 active:bg-transparent active:border-brand-9"
        >
          Manage
        </a>
        <button
          type="button"
          className="bg-brand-tertiary hover:bg-[#4892e5] active:bg-transparent active:text-brand-9 active:border-brand-tertiary"
          onClick={() => onClickChat(l)}
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
      cellStyle: { paddingLeft: "4px", fontWeight: 700, minWidth: 150 },
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

  if (loading) return <GlobalPageLoader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-8">
      <div className="page-header-container">
        <div className="hidden md:flex flex-wrap gap-5">
          <ManagementStatistcsCard
            title="Total Landlords"
            newData={new_landlords_this_month}
            total={total_landlords}
            className="w-[260px]"
          />
          <ManagementStatistcsCard
            title="Web Landlords"
            newData={new_web_landlords_this_month}
            total={web_landlords}
            className="w-[260px]"
          />
          <ManagementStatistcsCard
            title="Mobile Landlords"
            newData={new_mobile_landlords_this_month}
            total={mobile_landlords}
            className="w-[260px]"
          />
        </div>

        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + create new landlord
            </Button>
          </ModalTrigger>
          <ModalContent>
            <AddLandlordModal />
          </ModalContent>
        </Modal>
      </div>

      <FilterBar
        azFilter
        gridView={gridView}
        setGridView={setGridView}
        setListView={setListView}
        onStateSelect={onStateSelect}
        pageTitle="Landlords/Landladies (Owners)"
        aboutPageModalData={{
          title: fetchedLandlordHelpInfo?.slug || "",
          description: fetchedLandlordHelpInfo?.description || "",
          video: fetchedLandlordHelpInfo?.acf.video_link || "",
          readingLink: fetchedLandlordHelpInfo?.link || "",
        }}
        searchInputPlaceholder="Search for Landlords"
        handleFilterApply={handleFilterApply}
        isDateTrue
        filterOptionsWithRadio={landlordFiltersRadio}
        filterWithOptionsWithDropdown={landlordFiltersWithDropdown}
      />
      <section>
        {gridView ? (
          <AutoResizingGrid minWidth={284} gap={16}>
            {landlords.map((l) => (
              <Link href={`/management/landlord/${l.id}/manage`} key={l.id}>
                <LandlordCard {...l} cardType="landlord" />
              </Link>
            ))}
          </AutoResizingGrid>
        ) : (
          <CustomTable
            displayTableHead={false}
            fields={fields}
            data={transformedLandlords}
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

export default Landlord;
