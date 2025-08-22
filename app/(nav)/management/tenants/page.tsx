"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Button from "@/components/Form/Button/button";
import TenantCard from "@/components/Management/landlord-and-tenant-card";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import Pagination from "@/components/Pagination/pagination";
import UserTag from "@/components/Tags/user-tag";
import AddTenantModal from "@/components/Management/Tenants/add-tenant-modal";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { getAllStates } from "@/utils/states";
import {
  defaultTenantPageData,
  tenantTableFields,
  type TenantApiResponse,
  type TenantPageData,
  type TenantRequestParams,
  transformTenantApiResponse,
} from "./data";
import Link from "next/link";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomLoader from "@/components/Loader/CustomLoader";
import useView from "@/hooks/useView";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { ExclamationMark, PlusIcon } from "@/public/icons/icons";
import CardsLoading from "@/components/Loader/CardsLoading";
import { AxiosRequestConfig } from "axios";
import type { FilterResult } from "@/components/Management/Landlord/types";
import dayjs from "dayjs";
import { AllBranchesResponse } from "@/components/Management/Properties/types";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { NoteBlinkingIcon } from "@/public/icons/dashboard-cards/icons";
import ServerError from "@/components/Error/ServerError";
import { useSearchParams } from "next/navigation";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const states = getAllStates();

const Tenants = () => {
  const searchParams = useSearchParams();
  const storedView = useView();
  const contentTopRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<string | null>(storedView);
  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem("tenant_page");
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
  const [pageData, setPageData] = useState<TenantPageData>(
    defaultTenantPageData
  );

  const config = useMemo(() => {
    const queryParams: TenantRequestParams = { page, search: searchQuery };
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
    if (appliedFilters.menuOptions["Tenant/Occupants Type"]?.[0]) {
      queryParams.agent =
        appliedFilters.menuOptions["Tenant/Occupants Type"][0];
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
  } = useFetch<TenantApiResponse>("tenants", {
    ...config,
    cache: {
      enabled: true,
      key: `tenants-page-${config.params.page}-search-${
        config.params.search || "none"
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

  useRefetchOnEvent("refetchTenants", () => {
    clearCache?.();
    refetch({ silent: true });
  });

  // Infinite scroll callback
  const handleInfiniteScroll = useCallback(async () => {
    console.log("handleInfiniteScroll called, current page:", page);
    setPage((prev) => {
      const nextPage = prev + 1;
      console.log("Incrementing to page:", nextPage);
      sessionStorage.setItem("tenant_page", nextPage.toString());
      return nextPage;
    });
  }, [page]);

  const { isLoading: infiniteScrollLoading, lastElementRef } =
    useInfiniteScroll({
      callback: handleInfiniteScroll,
      hasMore: pageData.current_page < pageData.total_pages,
    });

  useEffect(() => {
    console.log("Infinite scroll state:", {
      page,
      currentPage: pageData.current_page,
      totalPages: pageData.total_pages,
      hasMore: pageData.current_page < pageData.total_pages,
      infiniteScrollLoading,
      silentLoading,
      fromCache,
    });
  }, [
    page,
    pageData.current_page,
    pageData.total_pages,
    infiniteScrollLoading,
    silentLoading,
    fromCache,
  ]);

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  useEffect(() => {
    sessionStorage.setItem("tenant_page", page.toString());
  }, [page]);

  useEffect(() => {
    setPage(1);
    sessionStorage.setItem("tenant_page", "1");
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
    sessionStorage.setItem("tenant_page", "1");
    clearCache?.();
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    sessionStorage.setItem("tenant_page", page.toString());
    if (view === "grid" && contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery);
    setPage(1);
    sessionStorage.setItem("tenant_page", "1");
    clearCache?.();
  };

  const handleSort = (order: "asc" | "desc") => {
    setAppliedFilters((prev) => ({
      ...prev,
      menuOptions: { ...prev.menuOptions, Sort: [order] },
    }));
    setPage(1);
    sessionStorage.setItem("tenant_page", "1");
    clearCache?.();
  };

  useEffect(() => {
    if (apiData?.data && Array.isArray(apiData.data.tenants)) {
      console.log("API data received:", {
        page: config.params.page,
        total_pages: apiData.data.pagination.total_pages,
        tenants: apiData.data.tenants.length,
        fromCache,
        apiData,
      });
      const transformedData = transformTenantApiResponse(apiData);
      setPageData((prevData) => {
        const updatedTenants =
          view === "grid" || transformedData.current_page === 1
            ? transformedData.tenants
            : [...prevData.tenants, ...transformedData.tenants];
        return {
          ...transformedData,
          tenants: updatedTenants,
          total_tenants: apiData.total_data_count,
          new_tenants_this_month: apiData.total_count_monthly,
          web_tenants: apiData.web_tenant_count,
          mobile_tenants: apiData.mobile_tenant_count,
          new_web_tenants_this_month: apiData.web_monthly_count,
          new_mobile_tenants_this_month: apiData.mobile_monthly_count,
        };
      });
    } else {
      console.warn(
        "apiData is invalid or data.tenants is not an array:",
        apiData
      );
    }
  }, [apiData, view, fromCache]);

  const branchOptions =
    branchesData?.data.map((branch) => ({
      label: branch.branch_name,
      value: branch.id,
    })) || [];

  const transformedTenants = pageData.tenants.map((t) => ({
    ...t,
    full_name: (
      <p className="flex items-center whitespace-nowrap">
        <span>{t.name}</span>
        <div className="flex gap-2 items-center">
          {t.badge_color && <BadgeIcon color={t.badge_color} />}
          {t.note && <NoteBlinkingIcon size={20} className="blink-color" />}
        </div>
      </p>
    ),
    user_tag: (
      <div className="flex gap-2 mb-2 items-center">
        <UserTag type={t.user_tag} />
      </div>
    ),
    "manage/chat": (
      <div className="flex gap-x-[4%] items-center justify-end w-full">
        {t.user_tag === "mobile" && (
          <Button
            variant="sky_blue"
            size="sm_medium"
            className="px-8 py-2 border-[1px] border-brand-9 bg-brand-tertiary bg-opacity-50 text-white"
          >
            Chat
          </Button>
        )}
        <Button
          href={`/management/tenants/${t.id}/manage`}
          size="sm_medium"
          className="px-8 py-2"
        >
          Manage
        </Button>
      </div>
    ),
  }));

  if (loading) {
    return (
      <CustomLoader
        layout="page"
        pageTitle="Tenants/Occupants (Users)"
        statsCardCount={3}
      />
    );
  }

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="my-8">
      <div className="page-header-container my-4 md:m-0" ref={contentTopRef}>
        <div className="management-cardstat-wrapper">
          <ManagementStatistcsCard
            title="Total Users"
            newData={pageData.new_tenants_this_month}
            total={pageData.total_tenants}
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Web Tenants"
            newData={pageData.new_web_tenants_this_month}
            total={pageData.web_tenants}
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Mobile Tenants"
            newData={pageData.new_mobile_tenants_this_month}
            total={pageData.mobile_tenants}
            colorScheme={3}
          />
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button
              type="button"
              className="page-header-button md:block hidden"
            >
              + create new tenant
            </Button>
          </ModalTrigger>
          <ModalContent>
            <AddTenantModal />
          </ModalContent>
        </Modal>
      </div>

      <FilterBar
        azFilter
        gridView={view === "grid"}
        setGridView={() => setView("grid")}
        setListView={() => setView("list")}
        pageTitle="Tenants/Occupants (Users)"
        aboutPageModalData={{
          title: "Tenants/Occupants (Users)",
          description: "This page contains a list of all tenants and occupants",
        }}
        searchInputPlaceholder="Search for Tenants & Occupants"
        dateLabel="Registration Date"
        handleFilterApply={handleFilterApply}
        isDateTrue
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
            label: "Tenant/Occupants Type",
            value: [
              { label: "Mobile Tenant", value: "mobile" },
              { label: "Web Tenant", value: "web" },
              { label: "All Tenants", value: "all" },
            ],
          },
          ...(branchOptions.length > 0
            ? [{ label: "Branch", value: branchOptions }]
            : []),
        ]}
      />
      <section className="mt-4">
        {pageData.tenants.length === 0 && !silentLoading ? (
          config.params.search || isFilterApplied() ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              modalContent={<AddTenantModal />}
              title="The tenants and occupants profile files are empty."
              body={
                <p>
                  You don&apos;t have any profiles for tenants and occupants
                  yet.
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
                  pageData.tenants.map((t) => (
                    <Link
                      href={`/management/tenants/${t.id}/manage`}
                      key={t.id}
                    >
                      <TenantCard
                        picture_url={t.picture_url}
                        name={t.name}
                        title={t.title}
                        user_tag={t.user_tag}
                        badge_color={t.badge_color}
                        email={t.email}
                        phone_number={t.phone_number}
                        note={t.note}
                        is_flagged={t.flagged}
                      />
                    </Link>
                  ))
                )}
              </AutoResizingGrid>
            ) : (
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                <CustomTable
                  displayTableHead={false}
                  fields={tenantTableFields}
                  data={transformedTenants}
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
              <AddTenantModal />
            </ModalContent>
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default Tenants;
