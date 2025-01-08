"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import PropertyCard from "@/components/Management/Properties/property-card";
import Pagination from "@/components/Pagination/pagination";
import PropertyListItem from "@/components/Management/Properties/property-list-item";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useView from "@/hooks/useView";
import BackButton from "@/components/BackButton/back-button";
import { ExclamationMark, LocationIcon } from "@/public/icons/icons";
import useBranchStore from "@/store/branch-store";
import { initialState, PropertiesApiResponse, PropertiesFilterParams, PropertiesPageState, PropertyFilterResponse, transformPropertiesApiResponse } from "./data";
import { FilterResult } from "@/components/Management/Landlord/types";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import useFetch from "@/hooks/useFetch";
import EmptyList from "@/components/EmptyList/Empty-List";
import AddPropertyModal from "@/components/Management/Properties/add-property-modal";
import CardsLoading from "@/components/Loader/CardsLoading";
import TableLoading from "@/components/Loader/TableLoading";

const BranchProperties = () => {
    const storedView = useView();
    const [view, setView] = useState<string | null>(storedView);
    const { branch } = useBranchStore();
    useEffect(() => {
        setView(storedView);
    }, [storedView]);

    const [pageData, setPageData] = useState<PropertiesPageState>(initialState);
    const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
        options: [],
        menuOptions: {},
        startDate: null,
        endDate: null,
    });

    const {
        total_pages,
        current_page,
        total_properties,
        new_properties_count,
        total_rental_properties,
        new_rental_properties_count,
        total_facility_properties,
        new_facility_properties_count,
        properties,
    } = pageData;

    const isFilterApplied = useCallback(() => {
        const { options, menuOptions, startDate, endDate } = appliedFilters;
        return (
            options.length > 0 ||
            Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
            startDate !== null ||
            endDate !== null
        );
    }, [appliedFilters]);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"asc" | "desc" | "">("");

    // /branch/8/properties
    const endpoint =
        isFilterApplied() || search || sort ? "/property/filter" : `/branch/${branch.branch_id}/properties`;
    const config: AxiosRequestConfig = useMemo(() => {
        return {
            params: {
                page,
                date_from: appliedFilters.startDate
                    ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
                    : undefined,
                date_to: appliedFilters.endDate
                    ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
                    : undefined,
                search: search,
                branch_id: appliedFilters.menuOptions["Branch"] || [],
                state: appliedFilters.menuOptions["State"] || [],
                ...(appliedFilters.menuOptions["Property Type"]?.[0] &&
                    appliedFilters.menuOptions["Property Type"]?.[0] !== "all"
                    ? { property_type: appliedFilters.menuOptions["Property Type"]?.[0] }
                    : {}),
                sort_by: sort,
            } as PropertiesFilterParams,
        };
    }, [appliedFilters, search, sort, page]);

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const handleSort = (order: "asc" | "desc") => {
        setSort(order);
    };

    const handleSearch = (query: string) => {
        setSearch(query);
    };

    const handleFilterApply = (filters: FilterResult) => {
        setAppliedFilters(filters);
        setPage(1);
    };

    const {
        data: apiData,
        loading,
        silentLoading,
        isNetworkError,
        error,
    } = useFetch<PropertiesApiResponse | PropertyFilterResponse>(
        endpoint,
        config
    );

    useEffect(() => {
        if (apiData) {
            setPageData((x) => ({
                ...x,
                ...transformPropertiesApiResponse(apiData),
            }));
        }
    }, [apiData]);
    // console.log("Data gotten", pageData)

    if (loading)
        return (
            <CustomLoader layout="page" pageTitle="Properties" statsCardCount={3} />
        );

    if (isNetworkError) return <NetworkError />;

    if (error)
        return <p className="text-base text-red-500 font-medium">{error}</p>;

    return (
        <div className="space-y-9">
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
                pageTitle="Properties"
                aboutPageModalData={{
                    title: "Properties",
                    description:
                        "This page contains a list of properties on the platform.",
                }}
                searchInputPlaceholder="Search for Properties"
                handleFilterApply={() => { }}
                isDateTrue
            />
            <section className="capitalize">
                {properties.length === 0 && !silentLoading ? (
                    isFilterApplied() || search ? (
                        "No Search/Filter Found"
                    ) : (
                        <EmptyList
                            buttonText="+ Add Property"
                            modalContent={<AddPropertyModal />}
                            title="You have not creared any properties yet"
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
                            <AutoResizingGrid minWidth={284}>
                                {silentLoading ? (
                                    <CardsLoading />
                                ) : (
                                    properties.map((p) => <PropertyCard key={p.id} {...p} />)
                                )}
                            </AutoResizingGrid>
                        ) : (
                            <>
                                {silentLoading ? (
                                    <TableLoading />
                                ) : (
                                    <div className="space-y-4">
                                        {properties.map((p) => (
                                            <PropertyListItem key={p.id} {...p} />
                                        ))}
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
            <Pagination
                totalPages={10}
                currentPage={1}
                onPageChange={() => { }}
            />
        </div>
    );
};

export default BranchProperties;