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
} from "../../../landlord/data";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomLoader from "@/components/Loader/CustomLoader";
import useView from "@/hooks/useView";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { ExclamationMark, LocationIcon } from "@/public/icons/icons";
import CardsLoading from "@/components/Loader/CardsLoading";
import TableLoading from "@/components/Loader/TableLoading";
import type { AllBranchesResponse } from "@/components/Management/Properties/types";
import useFetch from "@/hooks/useFetch";
import type { FilterResult } from "@/components/Management/Landlord/types";
import { AxiosRequestConfig } from "axios";
import { LandlordHelpInfo } from "../../../landlord/types";
import BackButton from "@/components/BackButton/back-button";
import useBranchStore from "@/store/branch-store";

const states = getAllStates();

const Landlord = () => {
    const storedView = useView();
    const { branch } = useBranchStore();
    const branchId = branch.branch_id
    const [view, setView] = useState<string | null>(storedView);
    const [pageData, setPageData] = useState<LandlordsPageData>(
        initialLandlordsPageData
    );

    console.log("branch", branchId)
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
    } = useFetch<LandlordApiResponse>(`/branch/${branchId}/landlords`, config);

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
            <div className="w-full gap-2 flex items-center justify-between flex-wrap">
                <BackButton reducePaddingTop as="div" className="items-start">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
                        {branch.branch_name}
                    </h1>
                    <div className="text-text-disabled flex items-center space-x-1">
                        <LocationIcon />
                        <p className="text-sm font-medium">{branch.address}</p>
                    </div>
                </BackButton>
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
                noExclamationMark
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
                            buttonText="+ New Landlord"
                            modalContent={<AddLandlordModal />}
                            title="No landlord or landlady has been assigned to this branch yet."
                            body={
                                <p>
                                    To add a landlord or landlady to this branch, click the &apos;Create New Landlord&apos; button to set up a profile. During property creation or editing, select this branch in the branch input section under property details, then assign the property owner in the landlord input field to link them to this branch.
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
