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
    getClientsHelpInfo,
    clientTableFields,
    type ClientApiResponse,
    type ClientsPageData,
    type ClientRequestParams,
    transformClientApiResponse,
    initialClientsPageData,
    generateDummyClientApiResponse, // Add this import
} from "./data";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { ClientHelpInfo } from "./types";
import CustomLoader from "@/components/Loader/CustomLoader";
import useView from "@/hooks/useView";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { PlusIcon } from "@/public/icons/icons";
import CardsLoading from "@/components/Loader/CardsLoading";
import type { AllBranchesResponse } from "@/components/Management/Properties/types";
import useFetch from "@/hooks/useFetch";
import type { FilterResult } from "@/components/Management/Landlord/types.d.ts"; // Fix import path
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { NoteBlinkingIcon } from "@/public/icons/dashboard-cards/icons";
import ServerError from "@/components/Error/ServerError";
import { useSearchParams } from "next/navigation";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const states = getAllStates();

// Constants for better maintainability
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const BRANCHES_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const STATS_CARD_WIDTH = "w-[260px]";

const Clients = () => {
    const storedView = useView();
    const [view, setView] = useState<string | null>(storedView);
    const searchParams = useSearchParams();
    const contentTopRef = useRef<HTMLDivElement>(null);

    const [page, setPage] = useState(() => {
        const savedPage = sessionStorage.getItem("client_page");
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
    const [pageData, setPageData] = useState<ClientsPageData>(
        initialClientsPageData
    );
    // Remove unused state and function
    // const [fetchedClientHelpInfo, setFetchedClientHelpInfo] = useState<ClientHelpInfo>();


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
        if (appliedFilters.menuOptions["Client Type"]?.[0]) {
            queryParams.agent =
                appliedFilters.menuOptions["Client Type"][0];
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

    // Backend disabled for clients: use only dummy data
    const apiData = undefined;
    const loading = false;
    const silentLoading = false;
    const isNetworkError = false;
    const error = undefined as unknown as string | undefined;
    const fromCache = false;
    const clearCache = undefined as any;
    const refetch = (_?: any) => { };
    const branchesData = undefined;

    // Infinite scroll callback
    const handleInfiniteScroll = useCallback(async () => {
        setPage((prev) => {
            const nextPage = prev + 1;
            sessionStorage.setItem("client_page", nextPage.toString());
            return nextPage;
        });
    }, [page]);

    const { isLoading: infiniteScrollLoading, lastElementRef } =
        useInfiniteScroll({
            callback: handleInfiniteScroll,
            hasMore: pageData.current_page < pageData.total_pages,
        });


    // Remove unused fetchClientHelp function
    // const fetchClientHelp = useCallback(async () => {
    //     try {
    //         const data = await getClientsHelpInfo();
    //         setFetchedClientHelpInfo(data.res[0]);
    //     } catch (error) {
    //         console.error("fetchClientHelp error:", error);
    //     }
    // }, []);

    useEffect(() => {
        // fetchClientHelp();
    }, []);

    useEffect(() => {
        setView(storedView);
    }, [storedView]);

    useEffect(() => {
        sessionStorage.setItem("client_page", page.toString());
    }, [page]);

    useEffect(() => {
        setPage(1);
        sessionStorage.setItem("client_page", "1");
    }, [view]);

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
        sessionStorage.setItem("client_page", "1");
        clearCache?.();
    };

    const handlePageChange = (page: number) => {
        setPage(page);
        sessionStorage.setItem("client_page", page.toString());
        if (view === "grid" && contentTopRef.current) {
            contentTopRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPage(1);
        sessionStorage.setItem("client_page", "1");
        // clearCache?.();
    };

    const handleSort = (order: "asc" | "desc") => {
        setAppliedFilters((prev) => ({
            ...prev,
            menuOptions: { ...prev.menuOptions, Sort: [order] },
        }));
        setPage(1);
        sessionStorage.setItem("client_page", "1");
        clearCache?.();
    };

    useEffect(() => {
        const dummyData = generateDummyClientApiResponse(page, searchQuery);
        const transformedData = transformClientApiResponse(dummyData);
        setPageData((prevData) => {
            const updatedClients =
                view === "grid" || transformedData.current_page === 1
                    ? transformedData.clients
                    : [...prevData.clients, ...transformedData.clients];
            return {
                ...transformedData,
                clients: updatedClients,
                total_clients: dummyData.total_data_count,
                new_clients_this_month: dummyData.total_count_monthly,
                web_clients: dummyData.web_client_count,
                mobile_clients: dummyData.mobile_client_count,
                new_web_clients_this_month: dummyData.web_monthly_count,
                new_mobile_clients_this_month: dummyData.mobile_monthly_count,
            };
        });
    }, [view, page, searchQuery]);

    // const branchOptions = branchesData?.data?.map((branch: any) => ({
    //     label: branch.branch_name,
    //     value: branch.id,
    // })) || [];
    const branchOptions: { label: string; value: string | number }[] = [];


    const transformedClients = pageData.clients.map((l, index) => {
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
                        href={`/management/clients/${l.id}/manage`}
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

    if (!pageData || (page === 1 && pageData.clients.length === 0))
        return (
            <CustomLoader
                layout="page"
                statsCardCount={3}
                pageTitle="Clients"
            />
        );

    return (
        <div className="my-8">
            <div className="page-header-container" ref={contentTopRef}>
                <div className="management-cardstat-wrapper">
                    <ManagementStatistcsCard
                        title="Total Clients"
                        newData={pageData.new_clients_this_month}
                        total={pageData.total_clients}
                        className={STATS_CARD_WIDTH}
                        colorScheme={1}
                    />
                    <ManagementStatistcsCard
                        title="Web Clients"
                        newData={pageData.new_web_clients_this_month}
                        total={pageData.web_clients}
                        className={STATS_CARD_WIDTH}
                        colorScheme={2}
                    />
                    <ManagementStatistcsCard
                        title="Mobile Clients"
                        newData={pageData.new_mobile_clients_this_month}
                        total={pageData.mobile_clients}
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
                            + create new client
                        </Button>
                    </ModalTrigger>
                    <ModalContent>
                        {/* TODO: Replace with AddClientModal when available */}
                        <AddLandlordModal />
                    </ModalContent>
                </Modal>
            </div>

            <FilterBar
                azFilter
                gridView={view === "grid"}
                setGridView={() => setView("grid")}
                setListView={() => setView("list")}
                pageTitle="Clients"
                searchInputPlaceholder="Search for Clients"
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
                        label: "Client Type",
                        value: [
                            { label: "Mobile Client", value: "mobile" },
                            { label: "Web Client", value: "web" },
                            { label: "All Client", value: "all" },
                        ],
                    },
                    ...(branchOptions.length > 0
                        ? [{ label: "Branch", value: branchOptions as any }]
                        : []),
                ]}
            />
            <section className="mt-4">
                {pageData.clients.length === 0 && !silentLoading ? (
                    config.params.search || isFilterApplied() ? (
                        <SearchError />
                    ) : (
                        <EmptyList
                            noButton
                            modalContent={<AddLandlordModal />}
                            title="The client files are empty"
                            body={
                                <p>
                                    You don&apos;t have any client profiles yet.
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
                                    pageData.clients.map((l) => (
                                        <Link
                                            href={`/management/clients/${l.id}/manage`}
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
                                    fields={clientTableFields}
                                    data={transformedClients}
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
                            {/* TODO: Replace with AddClientModal when available */}
                            <AddLandlordModal />
                        </ModalContent>
                    </Modal>
                </div>
            </section>
        </div>
    );
};

export default Clients;
