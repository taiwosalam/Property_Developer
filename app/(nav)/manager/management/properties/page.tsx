"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { ExclamationMark } from "@/public/icons/icons";
import PropertyCard from "@/components/Management/Properties/property-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { ModalContent, ModalTrigger, Modal } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import Pagination from "@/components/Pagination/pagination";
import PropertyListItem from "@/components/Management/Properties/property-list-item";
import AddPropertyModal from "@/components/Management/Properties/add-property-modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CardsLoading from "@/components/Loader/CardsLoading";
import TableLoading from "@/components/Loader/TableLoading";
import {
  propertyFilterOptionsMenu,
  transformPropertiesApiResponse,
  initialState,
  type PropertiesPageState,
  type PropertiesApiResponse,
  type PropertyFilterResponse,
  type PropertiesFilterParams,
} from "./data";
import useView from "@/hooks/useView";
import useFetch from "@/hooks/useFetch";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import { FilterResult } from "@/components/Management/Landlord/types";
import type { AllBranchesResponse } from "@/components/Management/Properties/types";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useTourStore } from "@/store/tour-store";
import { useGlobalStore } from "@/store/general-store";
import ServerError from "@/components/Error/ServerError";

const Properties = () => {
  const storedView = useView();
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const [view, setView] = useState<string | null>(storedView);

  const { setShouldRenderTour, isTourCompleted } = useTourStore();
  const setGlobalInfoStore = useGlobalStore(
    (state) => state.setGlobalInfoStore
  );

  const [pageData, setPageData] = useState<PropertiesPageState>(() => {
    const savedPage = sessionStorage.getItem("properties_page");
    return {
      ...initialState,
      current_page: savedPage ? parseInt(savedPage, 10) : 1,
    };
  });
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

  // Save page number to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("properties_page", current_page.toString());
  }, [current_page]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tour: tourState } = useTourStore();

  // Sync modal state with tour
  useEffect(() => {
    if (
      tourState.tourKey === "PropertiesTour" &&
      tourState.run &&
      tourState.stepIndex === 2 &&
      !isModalOpen
    ) {
      console.log("Properties: Tour waiting for modal open");
    }
  }, [tourState, isModalOpen]);

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

  const config: AxiosRequestConfig = useMemo(() => {
    return {
      params: {
        page: current_page,
        date_from: appliedFilters.startDate
          ? dayjs(appliedFilters.startDate).format("YYYY-MM-DD")
          : undefined,
        date_to: appliedFilters.endDate
          ? dayjs(appliedFilters.endDate).format("YYYY-MM-DD")
          : undefined,
        search: search,
        state: appliedFilters.menuOptions["State"] || [],
        ...(appliedFilters.menuOptions["Property Type"]?.[0] &&
        appliedFilters.menuOptions["Property Type"]?.[0] !== "all"
          ? { property_type: appliedFilters.menuOptions["Property Type"]?.[0] }
          : {}),
        sort_by: sort,
      } as PropertiesFilterParams,
    };
  }, [appliedFilters, search, sort, current_page]);

  // Added a ref to the top of the content section
  const contentTopRef = useRef<HTMLDivElement>(null);
  const handlePageChange = (page: number) => {
    setPageData((prevData) => ({
      ...prevData,
      current_page: page,
      properties: storedView === "grid" ? [] : prevData.properties,
    }));
    // Scroll to the top where properties card start
    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSort = (order: "asc" | "desc") => {
    setSort(order);
    setPageData((prevData) => ({
      ...prevData,
      current_page: 1,
      properties: [],
    }));
    sessionStorage.setItem("properties_page", "1");
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    setPageData((prevData) => ({
      ...prevData,
      current_page: 1,
      properties: [],
    }));
    sessionStorage.setItem("properties_page", "1");
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    setPageData((prevData) => ({
      ...prevData,
      current_page: 1,
      properties: [],
    }));
    sessionStorage.setItem("properties_page", "1");
  };

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
  } = useFetch<PropertiesApiResponse | PropertyFilterResponse>(
    "/property/list",
    config
  );

  useEffect(() => {
    if (apiData) {
      const transformed = transformPropertiesApiResponse(apiData);
      setPageData((x) => ({ ...x, ...transformed }));
      setGlobalInfoStore("managementProperties", transformed.properties);
    }
  }, [apiData, setGlobalInfoStore]);

  // Tour logic for PropertiesTour
  useEffect(() => {
    if (loading) {
      // Wait for data to load
      setShouldRenderTour(false);
      return;
    }
    // Check if properties are empty and the tour hasn't been completed
    const shouldRunTour =
      properties.length === 0 && !isTourCompleted("PropertiesTour");

    if (shouldRunTour) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [properties, loading, setShouldRenderTour, isTourCompleted]);

  // Render an error message if BRANCH_ID is invalid
  // if (!BRANCH_ID || BRANCH_ID === 0) {
  //   return (
  //     <div className="text-base text-red-500 font-medium">
  //       Invalid branch ID. Please select a valid branch.
  //     </div>
  //   );
  // }

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Properties" statsCardCount={3} />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      {/* Header with statistics cards */}
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Properties"
            newData={new_properties_count}
            total={total_properties}
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Rental Properties"
            newData={new_rental_properties_count}
            total={total_rental_properties}
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Facility Properties"
            newData={new_facility_properties_count}
            total={total_facility_properties}
            colorScheme={3}
          />
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + create property
            </Button>
          </ModalTrigger>
          <ModalContent>
            <AddPropertyModal />
          </ModalContent>
        </Modal>
      </div>

      {/* Page Title with search */}
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
        handleFilterApply={handleFilterApply}
        isDateTrue
        filterOptionsMenu={[...propertyFilterOptionsMenu]}
        onSort={handleSort}
        handleSearch={handleSearch}
        appliedFilters={appliedFilters}
      />
      <section className="capitalize">
        {properties.length === 0 && !silentLoading ? (
          isFilterApplied() || search ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              buttonText="+ Add Property"
              modalContent={<AddPropertyModal />}
              title="You have not created any properties yet"
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
                  disappear.
                  <br />
                  To Learn more about this page later, click your profile
                  picture at the top right of the dashboard and select
                  Assistance & Support.
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
                  properties.map((p) => (
                    <PropertyCard key={p.id} {...p} isManagerPage />
                  ))
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
    </div>
  );
};

export default Properties;
