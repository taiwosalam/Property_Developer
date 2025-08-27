"use client";

import dayjs from "dayjs";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
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
  investorTableFields,
  generateDummyInvestorApiResponse,
  transformInvestorApiResponse,
  initialInvestorsPageData,
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
const STATS_CARD_WIDTH = "w-[260px]";

const InvestorsPageVariantA = () => {
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);
  const searchParams = useSearchParams();
  const contentTopRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem("investor_page");
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
  const [pageData, setPageData] = useState(initialInvestorsPageData);

  const config = useMemo(() => {
    const queryParams: any = { page, search: searchQuery };
    const sort = appliedFilters.menuOptions["Sort"]?.[0];
    queryParams.sort_order = sort === "asc" || sort === "desc" ? sort : "asc";

    if (appliedFilters.menuOptions["State"]?.length > 0) {
      queryParams.states = appliedFilters.menuOptions["State"].join(",");
    }
    if (appliedFilters.menuOptions["Investor Type"]?.[0]) {
      queryParams.agent = appliedFilters.menuOptions["Investor Type"][0];
    }
    if (appliedFilters.startDate) {
      queryParams.start_date = dayjs(appliedFilters.startDate).format("YYYY-MM-DD");
    }
    if (appliedFilters.endDate) {
      queryParams.end_date = dayjs(appliedFilters.endDate).format("YYYY-MM-DD");
    }

    return { params: queryParams };
  }, [page, searchQuery, appliedFilters]);

  const handleInfiniteScroll = useCallback(async () => {
    setPage((prev) => {
      const nextPage = prev + 1;
      sessionStorage.setItem("investor_page", nextPage.toString());
      return nextPage;
    });
  }, [page]);

  const { isLoading: infiniteScrollLoading, lastElementRef } = useInfiniteScroll({
    callback: handleInfiniteScroll,
    hasMore: pageData.current_page < pageData.total_pages,
  });

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  useEffect(() => {
    sessionStorage.setItem("investor_page", page.toString());
  }, [page]);

  useEffect(() => {
    setPage(1);
    sessionStorage.setItem("investor_page", "1");
  }, [view]);

  useEffect(() => {
    const dummy = generateDummyInvestorApiResponse(page, searchQuery);
    const transformed = transformInvestorApiResponse(dummy);
    setPageData((prev) => {
      const updated = view === "grid" || transformed.current_page === 1
        ? transformed.investors
        : [...prev.investors, ...transformed.investors];
      return { ...transformed, investors: updated } as any;
    });
  }, [page, searchQuery, appliedFilters, view]);

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
    sessionStorage.setItem("investor_page", "1");
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    sessionStorage.setItem("investor_page", p.toString());
    if (view === "grid" && contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    sessionStorage.setItem("investor_page", "1");
  };

  const handleSort = (order: "asc" | "desc") => {
    setAppliedFilters((prev) => ({
      ...prev,
      menuOptions: { ...prev.menuOptions, Sort: [order] },
    }));
    setPage(1);
    sessionStorage.setItem("investor_page", "1");
  };

  const transformedInvestors = pageData.investors.map((l) => ({
    ...l,
    full_name: (
      <p className="flex items-center whitespace-nowrap">
        <span>{l.name}</span>
        <div className="flex gap-2 items-center">
          {l.badge_color && <BadgeIcon color={l.badge_color} />}
          {l.note && <span className="blink-color" />}
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
        <Button href={`/management/investors/${l.id}/manage`} size="sm_medium" className="px-8 py-2">
          Manage
        </Button>
      </div>
    ),
  }));

  if (!pageData || (page === 1 && pageData.investors.length === 0)) {
    return (
      <CustomLoader layout="page" statsCardCount={3} pageTitle="Investors" />
    );
  }

  return (
    <div className="my-8">
      <div className="page-header-container" ref={contentTopRef}>
        <div className="management-cardstat-wrapper">
          <ManagementStatistcsCard title="Total Investors" newData={pageData.new_investors_this_month} total={pageData.total_investors} className={STATS_CARD_WIDTH} colorScheme={1} />
          <ManagementStatistcsCard title="Web Investors" newData={pageData.new_web_investors_this_month} total={pageData.web_investors} className={STATS_CARD_WIDTH} colorScheme={2} />
          <ManagementStatistcsCard title="Mobile Investors" newData={pageData.new_mobile_investors_this_month} total={pageData.mobile_investors} className={STATS_CARD_WIDTH} colorScheme={3} />
        </div>

        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button md:block hidden">
              + create new investor
            </Button>
          </ModalTrigger>
          <ModalContent>
            {/* Placeholder modal */}
            <div className="p-8">Create Investor (Coming Soon)</div>
          </ModalContent>
        </Modal>
      </div>

      <FilterBar
        azFilter
        gridView={view === "grid"}
        setGridView={() => setView("grid")}
        setListView={() => setView("list")}
        pageTitle="Investors"
        searchInputPlaceholder="Search for Investors"
        handleFilterApply={handleFilterApply}
        isDateTrue
        dateLabel="Registration Date"
        handleSearch={handleSearch}
        onSort={handleSort}
        appliedFilters={appliedFilters}
        filterOptionsMenu={[
          {
            label: "State",
            value: states.map((state) => ({ label: state, value: state.toLowerCase() })),
          },
          {
            radio: true,
            label: "Investor Type",
            value: [
              { label: "Mobile Investor", value: "mobile" },
              { label: "Web Investor", value: "web" },
              { label: "All Investors", value: "all" },
            ],
          },
        ]}
      />

      <section className="mt-4">
        {pageData.investors.length === 0 ? (
          config.params.search || isFilterApplied() ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              modalContent={<div />}
              title="The investor files are empty"
              body={<p>You don&apos;t have any investor profiles yet.</p>}
            />
          )
        ) : (
          <>
            {view === "grid" ? (
              <AutoResizingGrid minWidth={284} gap={16}>
                {infiniteScrollLoading ? (
                  <CardsLoading />
                ) : (
                  pageData.investors.map((l) => (
                    <Link href={`/management/investors/${l.id}/manage`} key={l.id}>
                      <LandlordCard
                        picture_url={l.picture_url}
                        name={l.name}
                        user_tag={l.user_tag}
                        email={l.email}
                        phone_number={l.phone_number}
                        badge_color={l.badge_color}
                        note={l.note as any}
                      />
                    </Link>
                  ))
                )}
              </AutoResizingGrid>
            ) : (
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                <CustomTable displayTableHead={false} fields={investorTableFields} data={transformedInvestors} tableBodyCellSx={{ color: "#3F4247" }} />
                {pageData.current_page < pageData.total_pages && view === "list" && (
                  <div ref={lastElementRef} style={{ height: "20px", background: "transparent" }} />
                )}
                {infiniteScrollLoading && page > 1 && (
                  <div className="flex items-center justify-center py-4">
                    <div className="loader" />
                  </div>
                )}
              </div>
            )}
            {view === "grid" && (
              <Pagination totalPages={pageData.total_pages} currentPage={pageData.current_page} onPageChange={handlePageChange} />
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
              <div className="p-8">Create Investor (Coming Soon)</div>
            </ModalContent>
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default InvestorsPageVariantA;