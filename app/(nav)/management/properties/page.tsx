"use client";
import { useEffect, useState, useMemo } from "react";
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
  type PropertiesRequestParams,
} from "./data";
import useView from "@/hooks/useView";
import useFetch from "@/hooks/useFetch";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import { FilterResult } from "@/components/Management/Landlord/types";

const Properties = () => {
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);
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

  const isFilterApplied = () => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  };

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
      sort_order: "asc",
    } as PropertiesRequestParams,
  });

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

  const handleSearch = (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const statesArray = menuOptions["State"] || [];
    const propertyType = menuOptions["Property Type"]?.[0];
    const branchIdsArray = menuOptions["Branch"] || [];

    const queryParams: PropertiesRequestParams = {
      page: 1,
      sort_order: "asc",
      search: "",
    };
    if (statesArray.length > 0) {
      queryParams.state = statesArray.join(",");
    }
    if (branchIdsArray.length > 0) {
      queryParams.branch_id = branchIdsArray.join(",");
    }
    if (propertyType && propertyType !== "all") {
      queryParams.property_type = propertyType;
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");
    }
    setConfig({
      params: queryParams,
    });
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
  } = useFetch<PropertiesApiResponse>("property/list", config);

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({
        ...x,
        ...transformPropertiesApiResponse(apiData),
      }));
    }
  }, [apiData]);

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Properties" statsCardCount={3} />
    );

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

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
        filterOptionsMenu={propertyFilterOptionsMenu}
        onSort={handleSort}
        handleSearch={handleSearch}
      />

      <section className="capitalize">
        {properties.length === 0 && !silentLoading ? (
          isFilterApplied() || config.params.search ? (
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
    </div>
  );
};

export default Properties;
