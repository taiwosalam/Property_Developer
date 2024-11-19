"use client";

// Imports
import { useEffect, useState, useCallback } from "react";
import AddLandlordModal from "@/components/Management/Landlord/add-landlord-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import LandlordCard from "@/components/Management/landlord-and-tenant-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Link from "next/link";
import CustomTable from "@/components/Table/table";
import UserTag from "@/components/Tags/user-tag";
import Pagination from "@/components/Pagination/pagination";
import { getAllStates, getLocalGovernments } from "@/utils/states";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Button from "@/components/Form/Button/button";
import {
  getLandlordsHelpInfo,
  LandlordPageState,
  landlordTableFields,
  type LandlordApiResponse,
  transformLandlordApiResponse,
  // landlordFiltersWithDropdown,
} from "./data";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { LandlordHelpInfo } from "./types";
import CustomLoader from "@/components/Loader/CustomLoader";
import useView from "@/hooks/useView";
import useSettingsStore from "@/store/settings";
import useFetch from "@/hooks/useFetch";

const Landlord = () => {
  const view = useView();
  const { selectedOptions, setSelectedOption } = useSettingsStore();
  const [selectedView, setSelectedView] = useState<string | null>(
    selectedOptions.view
  );

  const initialState: LandlordPageState = {
    gridView: selectedView === "grid",
    landlordsPageData: {
      total_pages: 1,
      current_page: 1,
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
    landlordsPageData: {
      total_pages,
      current_page,
      total_landlords,
      new_landlords_this_month,
      mobile_landlords,
      new_mobile_landlords_this_month,
      web_landlords,
      new_web_landlords_this_month,
      landlords,
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

  const [fetchedLandlordHelpInfo, setFetchedLandlordHelpInfo] =
    useState<LandlordHelpInfo>();

  const fetchLandlordHelp = useCallback(async () => {
    try {
      const data = await getLandlordsHelpInfo();
      // console.log(data.res[0]);
      setFetchedLandlordHelpInfo(data.res[0]);
    } catch (error) {
      console.error("Error fetching landlord help info:", error);
    }
  }, []);

  useEffect(() => {
    fetchLandlordHelp();
  }, [fetchLandlordHelp]);

  // const onClickChat = () => {
  //   console.log("Chat clicked for:", landlord);
  // };

  const states = getAllStates();

  // const onStateSelect = (selectedState: string) => {
  //   const localGovernments = getLocalGovernments(selectedState);

  //   const updatedFilters = landlordFiltersWithDropdown.map((filter) => {
  //     if (filter.label === "Local Government") {
  //       return {
  //         ...filter,
  //         value: localGovernments.map((lg) => ({
  //           label: lg,
  //           value: lg.toLowerCase(),
  //         })),
  //       };
  //     }
  //     return filter;
  //   });
  // };

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

  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add  logic here to filter landlords
  };

  const handlePageChange = (page: number) => {
    setSearchQuery("");
    setState((prevState) => ({
      ...prevState,
      landlordsPageData: {
        ...prevState.landlordsPageData,
        current_page: page,
      },
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
  } = useFetch<LandlordApiResponse>(
    `landlords?page=${current_page}&search=${searchQuery}`
  );

  useEffect(() => {
    if (apiData) {
      setState((x) => ({
        ...x,
        landlordsPageData: transformLandlordApiResponse(apiData),
      }));
    }
  }, [apiData]);

  // Listen for the refetch event
  useEffect(() => {
    const handleRefetch = () => {
      refetch();
    };

    window.addEventListener("refetchLandlords", handleRefetch);
    return () => {
      window.removeEventListener("refetchLandlords", handleRefetch);
    };
  }, [refetch]);

  const transformedLandlords = landlords.map((l) => ({
    ...l,
    full_name: (
      <p className="flex items-center">
        <span className="text-ellipsis line-clamp-1">{l.name}</span>
        <BadgeIcon color={l.badge_color} />
      </p>
    ),
    user_tag: <UserTag type={l.user_tag} />,
    "manage/chat": (
      <div className="flex gap-x-[4%] items-center w-full">
        <Button
          href={`/management/landlord/${l.id}/manage`}
          size="sm_medium"
          className="px-8 py-2"
        >
          Manage
        </Button>
        <Button
          variant="sky_blue"
          size="sm_medium"
          className="px-8 py-2 bg-brand-tertiary bg-opacity-50 text-white"
          // onClick={() => onClickChat(l)}
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
        statsCardCount={3}
        pageTitle="Landlords/Landladies (Owners)"
      />
    );

  // if (error) return <div>{error}</div>;

  return (
    <div className="space-y-8">
      <div className="page-header-container">
        <div className="hidden md:flex flex-wrap gap-5">
          <ManagementStatistcsCard
            title="Total Landlords"
            newData={new_landlords_this_month}
            total={total_landlords}
            className="w-[260px]"
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Web Landlords"
            newData={new_web_landlords_this_month}
            total={web_landlords}
            className="w-[260px]"
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Mobile Landlords"
            newData={new_mobile_landlords_this_month}
            total={mobile_landlords}
            className="w-[260px]"
            colorScheme={3}
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
        gridView={view === "grid" || gridView}
        setGridView={setGridView}
        setListView={setListView}
        // onStateSelect={onStateSelect}
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
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        // filterOptionsWithRadio={landlordFiltersRadio}
        // filterWithOptionsWithDropdown={landlordFiltersWithDropdown}
      />
      <section>
        {view === "grid" || gridView ? (
          <AutoResizingGrid minWidth={284} gap={16}>
            {landlords.map((l) => (
              <Link href={`/management/landlord/${l.id}/manage`} key={l.id}>
                <LandlordCard
                  picture_url={l.picture_url || undefined}
                  name={l.name}
                  user_tag={l.user_tag}
                  email={l.email}
                  phone_number={l.phone_number || undefined}
                  badge_color={l.badge_color}
                />
              </Link>
            ))}
          </AutoResizingGrid>
        ) : (
          <CustomTable
            displayTableHead={false}
            fields={landlordTableFields}
            data={transformedLandlords}
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

export default Landlord;
