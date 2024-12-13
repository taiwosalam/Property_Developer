"use client";

// Imports
import dayjs from "dayjs";
import { useEffect, useState, useCallback } from "react";
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
      // sort_order: "asc",
    } as LandlordRequestParams,
  });

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
      // sort_order: "asc",
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
          className="px-8 py-2 mx-auto"
        >
          Manage
        </Button>
        {l.user_tag === "mobile" && (
          <Button
            variant="sky_blue"
            size="sm_medium"
            className="px-8 py-2 bg-brand-tertiary bg-opacity-50 text-white mx-auto"
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
            label: "Landlord Type",
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
            "No Search/Filter Found"
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
