"use client";
import { useEffect, useState } from "react";
import PropertyCard from "@/components/Management/Properties/property-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { ModalContent, ModalTrigger, Modal } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import Pagination from "@/components/Pagination/pagination";
import PropertyListItem from "@/components/Management/Properties/property-list-item";
import AddPropertyModal from "@/components/Management/Properties/add-property-modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useSettingsStore from "@/store/settings";
import useView from "@/hooks/useView";
import BackButton from "@/components/BackButton/back-button";
import { LocationIcon } from "@/public/icons/icons";
import CreateStaffModal from "@/components/Management/Staff-And-Branches/create-staff-modal";

const BranchProperties = () => {
    const view = useView();
    const { selectedOptions, setSelectedOption } = useSettingsStore();
    const [selectedView, setSelectedView] = useState<string | null>(
        selectedOptions.view
    );
    // const grid = selectedView === "grid";

    const initialState = {
        gridView: selectedView === "grid",
        total_pages: 20,
        current_page: 1,
        isModalOpen: false,
    };
    const [state, setState] = useState(initialState);
    const { gridView, total_pages, current_page } = state;

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            gridView: selectedView === 'grid',
        }));
    }, [selectedView]);

    const setGridView = () => {
        setSelectedOption('view', 'grid');
        setSelectedView("grid");
    };

    const setListView = () => {
        setSelectedOption('view', 'list');
        setSelectedView("list");
    };

    const handlePageChange = (page: number) => {
        setState((state) => ({ ...state, current_page: page }));
    };


    return (
        <div className="space-y-9">
            <div className="w-full gap-2 flex items-center justify-between flex-wrap">
                <BackButton reducePaddingTop as="div" className="items-start">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
                        branchData.branch_name
                    </h1>
                    <div className="text-text-disabled flex items-center space-x-1">
                        <LocationIcon />
                        <p className="text-sm font-medium">branchData.address</p>
                    </div>
                </BackButton>
            </div>

            {/* Page Title with search */}
            <FilterBar
                azFilter
                gridView={view === 'grid' || gridView}
                setGridView={setGridView}
                setListView={setListView}
                // onStateSelect={() => {}}
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

            {/* Card / List View */}
            <section>
                {view === 'grid' || gridView ? (
                    <AutoResizingGrid minWidth={315}>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <PropertyCard
                                key={index}
                                address="123 Main St"
                                id={"1"}
                                property_name="Property Name"
                                total_returns={1000}
                                total_income={1000}
                                branch="Branch 1"
                                total_units={1}
                                isClickable
                                hasVideo
                                viewOnly={false}
                                images={[
                                    "/empty/SampleProperty.jpeg",
                                    "/empty/SampleProperty2.jpeg",
                                    "/empty/SampleProperty3.jpeg",
                                    "/empty/SampleProperty4.jpeg",
                                    "/empty/SampleProperty5.jpeg",
                                ]}
                                property_type={index % 2 === 0 ? "rental" : "facility"}
                                currency="naira"
                                total_unit_pictures={2}
                            />
                        ))}
                    </AutoResizingGrid>
                ) : (
                    <div className="space-y-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <PropertyListItem
                                key={index}
                                address="123 Main St"
                                property_name="Property Name"
                                total_returns={1000}
                                total_income={1000}
                                branch="Branch 1"
                                total_units={1}
                                hasVideo
                                id={"1"}
                                images={[
                                    "/empty/empty.svg",
                                    "/empty/empty.svg",
                                    "/empty/empty.svg",
                                    "/empty/empty.svg",
                                    "/empty/empty.svg",
                                ]}
                                property_type={index % 2 === 0 ? "rental" : "facility"}
                                currency="naira"
                                total_unit_pictures={2}
                            />
                        ))}
                    </div>
                )}
            </section>
            <Pagination
                totalPages={total_pages}
                currentPage={current_page}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default BranchProperties;