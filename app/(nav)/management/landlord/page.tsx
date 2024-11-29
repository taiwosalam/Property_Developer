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
  landlordTableFields,
  type LandlordApiResponse,
  type LandlordsPageData,
  transformLandlordApiResponse,
  // landlordFiltersWithDropdown,
} from "./data";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { LandlordHelpInfo } from "./types";
import CustomLoader from "@/components/Loader/CustomLoader";
import useView from "@/hooks/useView";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { ExclamationMark } from "@/public/icons/icons";
import CardsLoading from "@/components/Loader/CardsLoading";
import TableLoading from "@/components/Loader/TableLoading";

const Landlord = () => {
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);

  const initialState: LandlordsPageData = {
    total_pages: 1,
    current_page: 1,
    total_landlords: 0,
    new_landlords_this_month: 0,
    mobile_landlords: 0,
    new_mobile_landlords_this_month: 0,
    web_landlords: 0,
    new_web_landlords_this_month: 0,
    landlords: [],
  };

  const [pageData, setPageData] = useState<LandlordsPageData>(initialState);
  const {
    total_pages,
    current_page,
    total_landlords,
    new_landlords_this_month,
    mobile_landlords,
    new_mobile_landlords_this_month,
    web_landlords,
    new_web_landlords_this_month,
    landlords,
  } = pageData;

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

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleFilterApply = (filters: any) => {
    console.log("Filter applied:", filters);
    // Add  logic here to filter landlords
  };

  const handlePageChange = (page: number) => {
    setSearchQuery("");
    setPageData((prevState) => ({
      ...prevState,
      current_page: page,
    }));
  };

  const handleSort = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  const handleSearch = async (query: string) => {
    if (!query && !searchQuery) return;
    setSearchQuery(query);
  };

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<LandlordApiResponse>(
    `landlords?page=${current_page}&search=${searchQuery}&sort_order=${sortOrder}`
  );

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({
        ...x,
        ...transformLandlordApiResponse(apiData),
      }));
    }
  }, [apiData]);

  // Listen for the refetch event
  useRefetchOnEvent("refetchLandlords", () => refetch({ silent: true }));

  const transformedLandlords = landlords.map((l) => ({
    ...l,
    full_name: (
      <p className="flex items-center whitespace-nowrap">
        <span>{l.name}</span>
        {l.badge_color && <BadgeIcon color={l.badge_color} />}
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
        {l.user_tag === "mobile" && (
          <Button
            variant="sky_blue"
            size="sm_medium"
            className="px-8 py-2 bg-brand-tertiary bg-opacity-50 text-white"
            // onClick={() => onClickChat(l)}
          >
            Chat
          </Button>
        )}
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

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

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
        gridView={view === "grid"}
        setGridView={() => setView("grid")}
        setListView={() => setView("list")}
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
        onSort={handleSort}

        // filterOptionsWithRadio={landlordFiltersRadio}
        // filterWithOptionsWithDropdown={landlordFiltersWithDropdown}
      />
      <section>
        {landlords.length === 0 && !silentLoading ? (
          searchQuery ? (
            "No Search Found"
          ) : (
            <EmptyList
              buttonText="+ Create New Landlord"
              modalContent={<AddLandlordModal />}
              title="The landlord and landlady files are empty"
              body={
                <p>
                  You can create a property by clicking on the &quot;Add
                  Property&quot; button. You can create two types of properties:
                  rental and facility properties. Rental properties are mainly
                  tailored for managing properties for rent, including landlord
                  and tenant management processes. Facility properties are
                  designed for managing occupants in gated estates, overseeing
                  their due payments, visitor access, and vehicle records.{" "}
                  <br />
                  <br />
                  Once a property is added to this page, this guide will
                  disappear. To learn more about this page in the future, you
                  can click on this icon{" "}
                  <span className="inline-block text-brand-10 align-text-top">
                    <ExclamationMark />
                  </span>{" "}
                  at the top left of the dashboard page.
                  <br />
                  <br />
                  Property creation involves several segments: property
                  settings, details, what to showcase on the dashboard or user
                  app, unit creation, permissions, and assigning staff.
                </p>
              }
            />
          )
        ) : (
          <>
            {view === "grid" ? (
              <AutoResizingGrid minWidth={284} gap={16}>
                {silentLoading ? (
                  <CardsLoading />
                ) : (
                  landlords.map((l) => (
                    <Link
                      href={`/management/landlord/${l.id}/manage`}
                      key={l.id}
                    >
                      <LandlordCard
                        picture_url={l.picture_url}
                        name={l.name}
                        user_tag={l.user_tag}
                        email={l.email}
                        phone_number={l.phone_number}
                        badge_color={l.badge_color}
                      />
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
                    displayTableHead={false}
                    fields={landlordTableFields}
                    data={transformedLandlords}
                    tableBodyCellSx={{ color: "#3F4247" }}
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

export default Landlord;
