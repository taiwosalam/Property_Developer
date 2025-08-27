"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Button from "@/components/Form/Button/button";
import ClientCard from "@/components/Management/landlord-and-tenant-card";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import Pagination from "@/components/Pagination/pagination";
import UserTag from "@/components/Tags/user-tag";
import AddTenantModal from "@/components/Management/Tenants/add-tenant-modal";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { getAllLocalGovernments, getAllStates } from "@/utils/states";
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
import { ClientPageData, ClientRequestParams } from "./types";
import { clientTableFields, dummyClientPageData } from "./data";
import AddClientModal from "@/components/Management/Clients/add-client-modal";

const states = getAllStates();
const localGovernments = getAllLocalGovernments();

const ClientsPageVariantA = () => {
  const searchParams = useSearchParams();
  const storedView = useView();
  const contentTopRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<string | null>(storedView);
  const [pageData, setPageData] = useState<ClientPageData>(dummyClientPageData);
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

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  const config = useMemo(() => {
    const queryParams: ClientRequestParams = { page, search: searchQuery };
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
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery);
    setPage(1);
  };

  const handleSort = (order: "asc" | "desc") => {
    setAppliedFilters((prev) => ({
      ...prev,
      menuOptions: { ...prev.menuOptions, Sort: [order] },
    }));
    setPage(1);
  };

  const transformedClients = pageData.clients.map((t) => ({
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
        <UserTag type={t.user_tag as "mobile" | "web"} />
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

  //   CHANGE THESE LATER

  const silentLoading = false;
  const infiniteScrollLoading = false;

  //   if (loading) {
  //     return (
  //       <CustomLoader
  //         layout="page"
  //         pageTitle="Tenants/Occupants (Users)"
  //         statsCardCount={3}
  //       />
  //     );
  //   }

  //   if (isNetworkError) return <NetworkError />;
  //   if (error) return <ServerError error={error} />;

  return (
    <div className="my-8">
      <div className="page-header-container my-4 md:m-0" ref={contentTopRef}>
        <div className="management-cardstat-wrapper">
          <ManagementStatistcsCard
            title="Total Clients"
            newData={pageData.new_clients_this_month}
            total={pageData.total_clients}
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Web Clients"
            newData={pageData.new_web_clients_this_month}
            total={pageData.web_clients}
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Mobile Clients"
            newData={pageData.new_mobile_clients_this_month}
            total={pageData.mobile_clients}
            colorScheme={3}
          />
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button
              type="button"
              className="page-header-button md:block hidden"
            >
              + create new client
            </Button>
          </ModalTrigger>
          <ModalContent>
            <AddClientModal />
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
            label: "Branch",
            value: [
              {
                label: "Branch 1",
                value: "branch_1",
              },
              {
                label: "Branch 2",
                value: "branch_2",
              },
              {
                label: "Branch 3",
                value: "branch_3",
              },
            ],
          },
          {
            label: "State",
            value: states.map((state) => ({
              label: state,
              value: state.toLowerCase(),
            })),
          },
          {
            label: "Local Government",
            value: localGovernments.map((lga) => ({
              label: lga,
              value: lga.toLowerCase(),
            })),
          } 
        ]}
      />
      <section className="mt-4">
        {pageData.clients.length === 0 && !silentLoading ? (
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
                  pageData.clients.map((c) => (
                    <Link
                      href={`/management/clients/${c.id}/manage`}
                      key={c.id}
                    >
                      <ClientCard
                        picture_url={c.picture_url}
                        name={c.name}
                        title={c.title}
                        user_tag={c.user_tag}
                        badge_color={c.badge_color}
                        email={c.email}
                        phone_number={c.phone_number}
                        note={c.note}
                        // is_flagged={c.flagged}
                      />
                    </Link>
                  ))
                )}
              </AutoResizingGrid>
            ) : (
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                <CustomTable
                  displayTableHead={false}
                  fields={clientTableFields}
                  data={transformedClients}
                  tableBodyCellSx={{ color: "#3F4247" }}
                />
                {/* {pageData.current_page < pageData.total_pages &&
                  view === "list" && (
                    <div
                      ref={lastElementRef}
                      style={{ height: "20px", background: "transparent" }}
                    />
                  )} */}
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
              <AddClientModal />
            </ModalContent>
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default ClientsPageVariantA;
