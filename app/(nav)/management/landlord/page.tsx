"use client";

// Imports
import dayjs from "dayjs";
import { useEffect, useState, useCallback, useRef } from "react";
import AddLandlordModal from "@/components/Management/Landlord/add-landlord-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import LandlordCard from "@/components/Management/landlord-and-tenant-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Link from "next/link";
import CustomTable from "@/components/Table/table";
import UserTag from "@/components/Tags/user-tag";
import Pagination from "@/components/Pagination/pagination";
import { getAllStates } from "@/utils/states";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Button from "@/components/Form/Button/button";
import {
  getLandlordsHelpInfo,
  landlordTableFields,
  type LandlordApiResponse,
  type LandlordsPageData,
  type LandlordRequestParams,
  transformLandlordApiResponse,
  initialLandlordsPageData,
} from "./data";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { LandlordHelpInfo } from "./types";
import CustomLoader from "@/components/Loader/CustomLoader";
import useView from "@/hooks/useView";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { ExclamationMark } from "@/public/icons/icons";
import CardsLoading from "@/components/Loader/CardsLoading";
import TableLoading from "@/components/Loader/TableLoading";
import type { AllBranchesResponse } from "@/components/Management/Properties/types";
import useFetch from "@/hooks/useFetch";
import type { FilterResult } from "@/components/Management/Landlord/types";
import { AxiosRequestConfig } from "axios";
import SearchError from "@/components/SearchNotFound/SearchNotFound";

const states = getAllStates();

const Landlord = () => {
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);
  const [pageData, setPageData] = useState<LandlordsPageData>(
    initialLandlordsPageData
  );

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

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as LandlordRequestParams,
  });

  const [fetchedLandlordHelpInfo, setFetchedLandlordHelpInfo] =
    useState<LandlordHelpInfo>();

  const fetchLandlordHelp = useCallback(async () => {
    try {
      const data = await getLandlordsHelpInfo();
      //
      setFetchedLandlordHelpInfo(data.res[0]);
    } catch (error) {}
  }, []);

  const { data: branchesData } =
    useFetch<AllBranchesResponse>("/branches/select");

  useEffect(() => {
    fetchLandlordHelp();
  }, [fetchLandlordHelp]);

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

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
    const agent = menuOptions["Landlord Type"]?.[0];
    const branchIdsArray = menuOptions["Branch"] || [];

    const queryParams: LandlordRequestParams = {
      page: 1,
      search: "",
    };
    if (statesArray.length > 0) {
      queryParams.states = statesArray.join(",");
    }
    if (branchIdsArray.length > 0) {
      queryParams.branch_ids = branchIdsArray.join(",");
    }
    if (agent && agent !== "all") {
      queryParams.agent = agent;
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

  const branchOptions =
    branchesData?.data.map((branch) => ({
      label: branch.branch_name,
      value: branch.id,
    })) || [];

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<LandlordApiResponse>("landlords", config);
  useRefetchOnEvent("refetchLandlords", () => refetch({ silent: true }));

  // IF VIEW CHANGE., REFETCH DATA FROM PAGE 1
  useEffect(() => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      params: { ...prevConfig.params, page: 1 },
    }));
    setPageData((prevData) => ({
      ...prevData,
      landlords: [],
      current_page: 1,
    }));
    window.dispatchEvent(new Event("refetchLandlords"));
  }, [view]);

  useEffect(() => {
    if (apiData) {
      const transformedData = transformLandlordApiResponse(apiData);
      setPageData((prevData) => {
        const updatedLandlords =
          view === "grid" || transformedData.current_page === 1
            ? transformedData.landlords
            : [...prevData.landlords, ...transformedData.landlords];
        return { ...transformedData, landlords: updatedLandlords };
      });
    }
  }, [apiData, view]);

  // --- Infinite Scroll Logic ---
  // Create an observer to detect when the last row is visible
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
          // Load next page when the last row becomes visible
          handlePageChange(current_page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [current_page, total_pages, silentLoading]
  );

  // Transform landlord data to table rows.
  // Attach the lastRowRef to the last row if there are more pages.
  const transformedLandlords = landlords.map((l, index) => ({
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
          className="px-8 py-2 mx-auto"
        >
          Manage
        </Button>
        {l.user_tag === "mobile" && (
          <Button
            variant="sky_blue"
            size="sm_medium"
            className="px-8 py-2 bg-brand-tertiary bg-opacity-50 text-white mx-auto"
          >
            Chat
          </Button>
        )}
      </div>
    ),
    // Attach the lastRowRef to the final row if more pages exist.
    ref:
      index === landlords.length - 1 && current_page < total_pages
        ? lastRowRef
        : undefined,
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
        dateLabel="Registration Date"
        handleSearch={handleSearch}
        onSort={handleSort}
        appliedFilters={appliedFilters}
        filterOptionsMenu={[
          {
            label: "State",
            value: states.map((state) => ({
              label: state,
              value: state.toLowerCase(),
            })),
          },
          {
            radio: true,
            label: "Landlord/Landlady Type",
            value: [
              { label: "Mobile Landlord", value: "mobile" },
              { label: "Web Landlord", value: "web" },
              { label: "All Landlords", value: "all" },
            ],
          },
          ...(branchOptions.length > 0
            ? [
                {
                  label: "Branch",
                  value: branchOptions,
                },
              ]
            : []),
        ]}
      />
      <section>
        {landlords.length === 0 && !silentLoading ? (
          config.params.search || isFilterApplied() ? (
            <SearchError />
          ) : (
            <EmptyList
              buttonText="+ Create New Landlord"
              modalContent={<AddLandlordModal />}
              title="The landlord and landlady files are empty"
              body={
                <p>
                  You don&apos;t have any landlord or landlady profiles yet. You
                  can easily create one by clicking on the &quot;Create New
                  Landlord&quot; button and add them using their profile ID.
                  After adding profiles to this page, this guide will disappear.
                  <br />
                  <br />
                  To learn more about this page later, click your profile
                  picture at the top right of the dashboard and select
                  Assistance & Support.
                  <br />
                  <br />
                  Before creating or managing a rental property, you need to
                  create a profile for the landlord or landlady of the property.
                  You can invite them using their email and phone number for
                  registration. If you already have their list, you can add them
                  in bulk using an XML file or add them manually.
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
                {/* {silentLoading ? (
                  <TableLoading />
                ) : ( */}
                <CustomTable
                  displayTableHead={false}
                  fields={landlordTableFields}
                  data={transformedLandlords}
                  tableBodyCellSx={{ color: "#3F4247" }}
                />
                {/* )} */}
                {silentLoading && current_page > 1 && (
                  <div className="flex items-center justify-center py-4">
                    <div className="loader" />
                  </div>
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
