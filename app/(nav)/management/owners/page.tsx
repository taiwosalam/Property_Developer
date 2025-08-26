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
  ownerTableFields,
  type OwnerApiResponse,
  type OwnersPageData,
  type OwnerRequestParams,
  transformOwnerApiResponse,
  initialOwnersPageData,
  generateDummyOwnerApiResponse,
} from "./data";
import EmptyList from "@/components/EmptyList/Empty-List";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomLoader from "@/components/Loader/CustomLoader";
import useView from "@/hooks/useView";
import { PlusIcon } from "@/public/icons/icons";
import CardsLoading from "@/components/Loader/CardsLoading";
import type { FilterResult } from "@/components/Management/Landlord/types.d.ts";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { NoteBlinkingIcon } from "@/public/icons/dashboard-cards/icons";
import { useSearchParams } from "next/navigation";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const states = getAllStates();

// Constants for better maintainability
const STATS_CARD_WIDTH = "w-[260px]";

const Owners = () => {
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);
  const searchParams = useSearchParams();
  const contentTopRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem("owner_page");
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
  const [pageData, setPageData] = useState<OwnersPageData>(
    initialOwnersPageData
  );

  const config = useMemo(() => {
    const queryParams: OwnerRequestParams = { page, search: searchQuery };
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
    if (appliedFilters.menuOptions["Owner Type"]?.[0]) {
      queryParams.agent =
        appliedFilters.menuOptions["Owner Type"][0];
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

  // Backend disabled for owners: use only dummy data
  const apiData = undefined;
  const loading = false;
  const silentLoading = false;
  const isNetworkError = false;
  const error = undefined as unknown as string | undefined;
  const fromCache = false;
  const clearCache = undefined;
  const refetch = (_?: any) => { };
  const branchesData = undefined;

  // Infinite scroll callback
  const handleInfiniteScroll = useCallback(async () => {
    setPage((prev) => {
      const nextPage = prev + 1;
      sessionStorage.setItem("owner_page", nextPage.toString());
      return nextPage;
    });
  }, [page]);

  const { isLoading: infiniteScrollLoading, lastElementRef } =
    useInfiniteScroll({
      callback: handleInfiniteScroll,
      hasMore: pageData.current_page < pageData.total_pages,
    });

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  useEffect(() => {
    sessionStorage.setItem("owner_page", page.toString());
  }, [page]);

  useEffect(() => {
    setPage(1);
    sessionStorage.setItem("owner_page", "1");
  }, [view]);

  // Populate dummy data in place of API
  useEffect(() => {
    const dummyData: OwnerApiResponse = generateDummyOwnerApiResponse(page, searchQuery);
    const transformedData = transformOwnerApiResponse(dummyData);
    setPageData((prevData) => {
      const updatedOwners =
        view === "grid" || transformedData.current_page === 1
          ? transformedData.owners
          : [...prevData.owners, ...transformedData.owners];
      return {
        ...transformedData,
        owners: updatedOwners,
        total_owners: dummyData.total_data_count,
        new_owners_this_month: dummyData.total_count_monthly,
        web_owners: dummyData.web_owner_count,
        mobile_owners: dummyData.mobile_owner_count,
        new_web_owners_this_month: dummyData.web_monthly_count,
        new_mobile_owners_this_month: dummyData.mobile_monthly_count,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery, appliedFilters, view]);

  const branchOptions: { label: string; value: string | number }[] = [];

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
    sessionStorage.setItem("owner_page", "1");
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    sessionStorage.setItem("owner_page", page.toString());
    if (view === "grid" && contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    sessionStorage.setItem("owner_page", "1");
  };

  const handleSort = (order: "asc" | "desc") => {
    setAppliedFilters((prev) => ({
      ...prev,
      menuOptions: { ...prev.menuOptions, Sort: [order] },
    }));
    setPage(1);
    sessionStorage.setItem("owner_page", "1");
  };

  const transformedOwners = pageData.owners.map((l) => {
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
            href={`/management/owners/${l.id}/manage`}
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

  // Keep initial loader to match landlord UX on first mount
  if (!pageData || (page === 1 && pageData.owners.length === 0))
    return (
      <CustomLoader
        layout="page"
        statsCardCount={3}
        pageTitle="Owners"
      />
    );

  return (
    <div className="my-8">
      <div className="page-header-container" ref={contentTopRef}>
        <div className="management-cardstat-wrapper">
          <ManagementStatistcsCard
            title="Total Owners"
            newData={pageData.new_owners_this_month}
            total={pageData.total_owners}
            className={STATS_CARD_WIDTH}
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Web Owners"
            newData={pageData.new_web_owners_this_month}
            total={pageData.web_owners}
            className={STATS_CARD_WIDTH}
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Mobile Owners"
            newData={pageData.new_mobile_owners_this_month}
            total={pageData.mobile_owners}
            className={STATS_CARD_WIDTH}
            colorScheme={3}
          />
        </div>

        <Modal>
          <ModalTrigger asChild>
            <Button
              type="button"
              className="page-header-button md:block hidden"
            >
              + create new owner
            </Button>
          </ModalTrigger>
          <ModalContent>
            {/* TODO: Replace with AddOwnerModal when available */}
            <AddLandlordModal />
          </ModalContent>
        </Modal>
      </div>

      <FilterBar
        azFilter
        gridView={view === "grid"}
        setGridView={() => setView("grid")}
        setListView={() => setView("list")}
        pageTitle="Owners"
        searchInputPlaceholder="Search for Owners"
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
            label: "Owner Type",
            value: [
              { label: "Mobile Owner", value: "mobile" },
              { label: "Web Owner", value: "web" },
              { label: "All Owners", value: "all" },
            ],
          },
          ...(branchOptions.length > 0
            ? [{ label: "Branch", value: branchOptions }]
            : []),
        ]}
      />
      <section className="mt-4">
        {pageData.owners.length === 0 ? (
          config.params.search || isFilterApplied() ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              modalContent={<AddLandlordModal />}
              title="The owner files are empty"
              body={
                <p>
                  You don&apos;t have any owner profiles yet.
                </p>
              }
            />
          )
        ) : (
          <>
            {view === "grid" ? (
              <AutoResizingGrid minWidth={284} gap={16}>
                {infiniteScrollLoading ? (
                  <CardsLoading />
                ) : (
                  pageData.owners.map((l) => (
                    <Link
                      href={`/management/owners/${l.id}/manage`}
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
                  fields={ownerTableFields}
                  data={transformedOwners}
                  tableBodyCellSx={{ color: "#3F4247" }}
                />
                {pageData.current_page < pageData.total_pages &&
                  view === "list" && (
                    <div
                      ref={lastElementRef}
                      style={{ height: "20px", background: "transparent" }}
                    />
                  )}
                {infiniteScrollLoading && page > 1 && (
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
              {/* TODO: Replace with AddOwnerModal when available */}
              <AddLandlordModal />
            </ModalContent>
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default Owners;