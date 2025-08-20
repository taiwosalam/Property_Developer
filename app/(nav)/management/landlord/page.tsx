"use client";

import dayjs from "dayjs";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
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
import { ExclamationMark, PlusIcon } from "@/public/icons/icons";
import CardsLoading from "@/components/Loader/CardsLoading";
import type { AllBranchesResponse } from "@/components/Management/Properties/types";
import useFetch from "@/hooks/useFetch";
import type { FilterResult } from "@/components/Management/Landlord/types";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { NoteBlinkingIcon } from "@/public/icons/dashboard-cards/icons";
import ServerError from "@/components/Error/ServerError";
import { useSearchParams } from "next/navigation";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const states = getAllStates();

const Landlord = () => {
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);
  const searchParams = useSearchParams();
  const contentTopRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem("landlord_page");
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q")?.trim() || ""
  );
  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });
  const [pageData, setPageData] = useState<LandlordsPageData>(
    initialLandlordsPageData
  );
  const [fetchedLandlordHelpInfo, setFetchedLandlordHelpInfo] =
    useState<LandlordHelpInfo>();

    
  const config = useMemo(() => {
    const queryParams: LandlordRequestParams = { page, search: searchQuery };
    const sort = appliedFilters.menuOptions["Sort"]?.[0];
    if (sort === "asc" || sort === "desc") {
      queryParams.sort_order = sort;
    } else {
      queryParams.sort_order = "asc";
    }

    if (appliedFilters.menuOptions["State"]?.length > 0) {
      queryParams.states = appliedFilters.menuOptions["State"].join(",");
    }
    if (appliedFilters.menuOptions["Branch"]?.length > 0) {
      queryParams.branch_ids = appliedFilters.menuOptions["Branch"].join(",");
    }
    if (appliedFilters.menuOptions["Landlord/Landlady Type"]?.[0]) {
      queryParams.agent =
        appliedFilters.menuOptions["Landlord/Landlady Type"][0];
    }
    if (appliedFilters.startDate) {
      queryParams.start_date = dayjs(appliedFilters.startDate).format(
        "YYYY-MM-DD"
      );
    }
    if (appliedFilters.endDate) {
      queryParams.end_date = dayjs(appliedFilters.endDate).format("YYYY-MM-DD");
    }

    return { params: queryParams };
  }, [page, searchQuery, appliedFilters]);

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
    fromCache,
    clearCache,
  } = useFetch<LandlordApiResponse>("landlords", {
    ...config,
    cache: {
      enabled: true,
      key: `landlords-page-${config.params.page}-search-${
        searchQuery || "none"
      }-states-${config.params.states || "none"}-branch_ids-${
        config.params.branch_ids || "none"
      }-agent-${config.params.agent || "none"}-dates-${
        config.params.start_date || "none"
      }-${config.params.end_date || "none"}-sort-${
        config.params.sort_order || "none"
      }`,
      ttl: 5 * 60 * 1000,
    },
  });

  const { data: branchesData } = useFetch<AllBranchesResponse>(
    "/branches/select",
    {
      cache: {
        enabled: true,
        key: "branches-select",
        ttl: 10 * 60 * 1000,
      },
    }
  );

  useRefetchOnEvent("refetchLandlords", () => {
    clearCache?.();
    refetch({ silent: true });
  });

  // Infinite scroll callback
  const handleInfiniteScroll = useCallback(async () => {
    setPage((prev) => {
      const nextPage = prev + 1;
      sessionStorage.setItem("landlord_page", nextPage.toString());
      return nextPage;
    });
  }, [page]);

  const { isLoading: infiniteScrollLoading, lastElementRef } =
    useInfiniteScroll({
      callback: handleInfiniteScroll,
      hasMore: pageData.current_page < pageData.total_pages,
    });

  // useEffect(() => {
  //   console.log("Infinite scroll state:", {
  //     page,
  //     currentPage: pageData.current_page,
  //     totalPages: pageData.total_pages,
  //     hasMore: pageData.current_page < pageData.total_pages,
  //     infiniteScrollLoading,
  //     silentLoading,
  //     fromCache,
  //   });
  // }, [
  //   page,
  //   pageData.current_page,
  //   pageData.total_pages,
  //   infiniteScrollLoading,
  //   silentLoading,
  //   fromCache,
  // ]);

  const fetchLandlordHelp = useCallback(async () => {
    try {
      const data = await getLandlordsHelpInfo();
      setFetchedLandlordHelpInfo(data.res[0]);
    } catch (error) {
      console.error("fetchLandlordHelp error:", error);
    }
  }, []);

  useEffect(() => {
    fetchLandlordHelp();
  }, [fetchLandlordHelp]);

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  useEffect(() => {
    sessionStorage.setItem("landlord_page", page.toString());
  }, [page]);

  useEffect(() => {
    setPage(1);
    sessionStorage.setItem("landlord_page", "1");
    clearCache?.();
    refetch({ silent: true });
  }, [view, clearCache, refetch]);

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
    setPage(1);
    sessionStorage.setItem("landlord_page", "1");
    clearCache?.();
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    sessionStorage.setItem("landlord_page", page.toString());
    if (view === "grid" && contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    sessionStorage.setItem("landlord_page", "1");
    // clearCache?.();
  };

  const handleSort = (order: "asc" | "desc") => {
    setAppliedFilters((prev) => ({
      ...prev,
      menuOptions: { ...prev.menuOptions, Sort: [order] },
    }));
    setPage(1);
    sessionStorage.setItem("landlord_page", "1");
    clearCache?.();
  };

  useEffect(() => {
    if (apiData?.data && Array.isArray(apiData.data.landlords)) {
      console.log("API data received:", {
        page: config.params.page,
        total_pages: apiData.data.pagination.total_pages,
        landlords: apiData.data.landlords.length,
        fromCache,
        apiData, // Log full apiData for debugging
      });
      const transformedData = transformLandlordApiResponse(apiData);
      setPageData((prevData) => {
        const updatedLandlords =
          view === "grid" || transformedData.current_page === 1
            ? transformedData.landlords
            : [...prevData.landlords, ...transformedData.landlords];
        return {
          ...transformedData,
          landlords: updatedLandlords,
          total_landlords: apiData.total_data_count,
          new_landlords_this_month: apiData.total_count_monthly,
          web_landlords: apiData.web_landlord_count,
          mobile_landlords: apiData.mobile_landlord_count,
          new_web_landlords_this_month: apiData.web_monthly_count,
          new_mobile_landlords_this_month: apiData.mobile_monthly_count,
        };
      });
    } else {
      console.warn(
        "apiData is invalid or data.landlords is not an array:",
        apiData
      );
    }
  }, [apiData, view, fromCache]);

  const branchOptions =
    branchesData?.data.map((branch) => ({
      label: branch.branch_name,
      value: branch.id,
    })) || [];

  const transformedLandlords = pageData.landlords.map((l, index) => {
    const row = {
      ...l,
      full_name: (
        <p className="flex items-center whitespace-nowrap">
          <span>{l.name}</span>
          <div className="flex gap-2 items-center">
            {l.badge_color && <BadgeIcon color={l.badge_color} />}
            {l.note && <NoteBlinkingIcon size={20} className="blink-color" />}
          </div>
        </p>
      ),
      user_tag: (
        <div className="flex gap-2 mb-2 items-center">
          <UserTag type={l.user_tag} />
        </div>
      ),
      "manage/chat": (
        <div className="flex gap-x-[4%] items-center justify-end w-full">
          {l.user_tag === "mobile" && (
            <Button
              variant="sky_blue"
              size="sm_medium"
              className="px-8 py-2 border-[1px] border-brand-9 bg-brand-tertiary bg-opacity-50 text-white mx-auto"
            >
              Chat
            </Button>
          )}
          <Button
            href={`/management/landlord/${l.id}/manage`}
            size="sm_medium"
            className="px-8 py-2"
          >
            Manage
          </Button>
        </div>
      ),
    };
    return row;
  });

  if (loading)
    return (
      <CustomLoader
        layout="page"
        statsCardCount={3}
        pageTitle="Landlords/Landladies (Owners)"
      />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="my-8">
      <div className="page-header-container" ref={contentTopRef}>
        <div className="management-cardstat-wrapper">
          <ManagementStatistcsCard
            title="Total Landlords"
            newData={pageData.new_landlords_this_month}
            total={pageData.total_landlords}
            className="w-[260px]"
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Web Landlords"
            newData={pageData.new_web_landlords_this_month}
            total={pageData.web_landlords}
            className="w-[260px]"
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Mobile Landlords"
            newData={pageData.new_mobile_landlords_this_month}
            total={pageData.mobile_landlords}
            className="w-[260px]"
            colorScheme={3}
          />
        </div>

        <Modal>
          <ModalTrigger asChild>
            <Button
              type="button"
              className="page-header-button md:block hidden"
            >
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
            ? [{ label: "Branch", value: branchOptions }]
            : []),
        ]}
      />
      <section className="mt-4">
        {pageData.landlords.length === 0 && !silentLoading ? (
          config.params.search || isFilterApplied() ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              modalContent={<AddLandlordModal />}
              title="The landlord and landlady files are empty"
              body={
                <p>
                  You don&apos;t have any landlord or landlady profiles yet.
                </p>
              }
            />
          )
        ) : (
          <>
            {view === "grid" ? (
              <AutoResizingGrid minWidth={284} gap={16}>
                {silentLoading || infiniteScrollLoading ? (
                  <CardsLoading />
                ) : (
                  pageData.landlords.map((l) => (
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
                        note={l.note}
                      />
                    </Link>
                  ))
                )}
              </AutoResizingGrid>
            ) : (
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                <CustomTable
                  displayTableHead={false}
                  fields={landlordTableFields}
                  data={transformedLandlords}
                  tableBodyCellSx={{ color: "#3F4247" }}
                />
                {pageData.current_page < pageData.total_pages &&
                  view === "list" && (
                    <div
                      ref={lastElementRef}
                      style={{ height: "20px", background: "transparent" }}
                    />
                  )}
                {(silentLoading || infiniteScrollLoading) && page > 1 && (
                  <div className="flex items-center justify-center py-4">
                    <div className="loader" />
                  </div>
                )}
              </div>
            )}
            {view === "grid" && (
              <Pagination
                totalPages={pageData.total_pages}
                currentPage={pageData.current_page}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        <div className="bottom-5 right-5 fixed rounded-full z-[99] shadow-lg md:hidden block">
          <Modal>
            <ModalTrigger asChild>
              <button className="bg-brand-9 rounded-full text-white p-4 shadow-lg">
                <PlusIcon />
              </button>
            </ModalTrigger>
            <ModalContent>
              <AddLandlordModal />
            </ModalContent>
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default Landlord;
