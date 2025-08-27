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
  referralTableFields,
  generateDummyReferralApiResponse,
  transformReferralApiResponse,
  initialReferralsPageData,
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

const Referrals = () => {
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);
  const searchParams = useSearchParams();
  const contentTopRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem("referral_page");
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
  const [pageData, setPageData] = useState(initialReferralsPageData);

  const config = useMemo(() => {
    const queryParams: any = { page, search: searchQuery };
    const sort = appliedFilters.menuOptions["Sort"]?.[0];
    queryParams.sort_order = sort === "asc" || sort === "desc" ? sort : "asc";

    if (appliedFilters.menuOptions["State"]?.length > 0) {
      queryParams.states = appliedFilters.menuOptions["State"].join(",");
    }
    if (appliedFilters.menuOptions["Referral Source"]?.[0]) {
      queryParams.source = appliedFilters.menuOptions["Referral Source"][0];
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
      sessionStorage.setItem("referral_page", nextPage.toString());
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
    sessionStorage.setItem("referral_page", page.toString());
  }, [page]);

  useEffect(() => {
    setPage(1);
    sessionStorage.setItem("referral_page", "1");
  }, [view]);

  useEffect(() => {
    const dummy = generateDummyReferralApiResponse(page, searchQuery);
    const transformed = transformReferralApiResponse(dummy);
    setPageData((prev) => {
      const updated = view === "grid" || transformed.current_page === 1
        ? transformed.referrals
        : [...prev.referrals, ...transformed.referrals];
      return { ...transformed, referrals: updated } as any;
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
    sessionStorage.setItem("referral_page", "1");
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    sessionStorage.setItem("referral_page", p.toString());
    if (view === "grid" && contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    sessionStorage.setItem("referral_page", "1");
  };

  const handleSort = (order: "asc" | "desc") => {
    setAppliedFilters((prev) => ({
      ...prev,
      menuOptions: { ...prev.menuOptions, Sort: [order] },
    }));
    setPage(1);
    sessionStorage.setItem("referral_page", "1");
  };

  const transformedReferrals = pageData.referrals.map((r) => ({
    ...r,
    full_name: (
      <p className="flex items-center whitespace-nowrap">
        <span>{r.name}</span>
        <div className="flex gap-2 items-center">
          {r.badge_color && <BadgeIcon color={r.badge_color} />}
          {r.note && <span className="blink-color" />}
        </div>
      </p>
    ),
    user_tag: (
      <div className="flex gap-2 mb-2 items-center">
        <UserTag type={r.user_tag} />
      </div>
    ),
    "manage/chat": (
      <div className="flex gap-x-[4%] items-center justify-end w-full">
        <Button href={`/management/referrals/${r.id}/manage`} size="sm_medium" className="px-8 py-2">
          Manage
        </Button>
      </div>
    ),
  }));

  if (!pageData || (page === 1 && pageData.referrals.length === 0)) {
    return (
      <CustomLoader layout="page" statsCardCount={3} pageTitle="Referrals" />
    );
  }

  return (
    <div className="my-8">
      <div className="page-header-container" ref={contentTopRef}>
        <div className="management-cardstat-wrapper">
          <ManagementStatistcsCard title="Total Referrals" newData={pageData.new_referrals_this_month} total={pageData.total_referrals} className={STATS_CARD_WIDTH} colorScheme={1} />
          <ManagementStatistcsCard title="Web Referrals" newData={pageData.new_web_referrals_this_month} total={pageData.web_referrals} className={STATS_CARD_WIDTH} colorScheme={2} />
          <ManagementStatistcsCard title="Mobile Referrals" newData={pageData.new_mobile_referrals_this_month} total={pageData.mobile_referrals} className={STATS_CARD_WIDTH} colorScheme={3} />
        </div>

        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button md:block hidden">
              + create new referral
            </Button>
          </ModalTrigger>
          <ModalContent>
            {/* Placeholder modal */}
            <div className="p-8">Create Referral (Coming Soon)</div>
          </ModalContent>
        </Modal>
      </div>

      <FilterBar
        azFilter
        gridView={view === "grid"}
        setGridView={() => setView("grid")}
        setListView={() => setView("list")}
        pageTitle="Referrals"
        searchInputPlaceholder="Search for Referrals"
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
            label: "Referral Source",
            value: [
              { label: "Social Media", value: "social_media" },
              { label: "Friend", value: "friend" },
              { label: "Website", value: "website" },
              { label: "Advertisement", value: "advertisement" },
              { label: "Agent", value: "agent" },
            ],
          },
        ]}
      />

      <section className="mt-4">
        {pageData.referrals.length === 0 ? (
          config.params.search || isFilterApplied() ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              modalContent={<div />}
              title="The referral files are empty"
              body={<p>You don&apos;t have any referral profiles yet.</p>}
            />
          )
        ) : (
          <>
            {view === "grid" ? (
              <AutoResizingGrid minWidth={284} gap={16}>
                {infiniteScrollLoading ? (
                  <CardsLoading />
                ) : (
                  pageData.referrals.map((r) => (
                    <Link href={`/management/referrals/${r.id}/manage`} key={r.id}>
                      <LandlordCard
                        picture_url={r.picture_url}
                        name={r.name}
                        user_tag={r.user_tag}
                        email={r.email}
                        phone_number={r.phone_number}
                        badge_color={r.badge_color}
                        note={r.note as any}
                      />
                    </Link>
                  ))
                )}
              </AutoResizingGrid>
            ) : (
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                <CustomTable displayTableHead={false} fields={referralTableFields} data={transformedReferrals} tableBodyCellSx={{ color: "#3F4247" }} />
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
              <div className="p-8">Create Referral (Coming Soon)</div>
            </ModalContent>
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default Referrals;