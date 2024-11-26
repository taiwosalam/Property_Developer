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
  propertyFilterOptionsRadio,
  propertyFilterOptionsWithDropdowns,
  transformPropertiesApiResponse,
  type PropertiesPageState,
  type PropertiesApiResponse,
} from "./data";
import useView from "@/hooks/useView";
import useFetch from "@/hooks/useFetch";

const Properties = () => {
  const storedView = useView();
  const [view, setView] = useState<string | null>(storedView);

  const initialState: PropertiesPageState = {
    total_pages: 1,
    current_page: 1,
    total_properties: 0,
    new_properties_count: 0,
    total_rental_properties: 0,
    new_rental_properties_count: 0,
    total_facility_properties: 0,
    new_facility_properties_count: 0,
    properties: [],
  };

  const [pageData, setPageData] = useState<PropertiesPageState>(initialState);

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

  const handlePageChange = (page: number) => {
    setPageData((state) => ({ ...state, current_page: page }));
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    setView(storedView);
  }, [storedView]);

  const config = useMemo(
    () => ({
      params: {
        page: current_page,
        search: searchQuery,
        sort_order: sortOrder,
      },
    }),
    [current_page, searchQuery, sortOrder]
  );

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
        onStateSelect={() => {}}
        pageTitle="Properties"
        aboutPageModalData={{
          title: "Properties",
          description:
            "This page contains a list of properties on the platform.",
        }}
        searchInputPlaceholder="Search for Properties"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptionsWithRadio={propertyFilterOptionsRadio}
        filterWithOptionsWithDropdown={propertyFilterOptionsWithDropdowns}
        onSort={handleSort}
        handleSearch={handleSearch}
      />

      <section className="capitalize">
        {properties.length === 0 && !silentLoading ? (
          searchQuery ? (
            "No Search Found"
          ) : (
            <EmptyList
              buttonText="+ Add Property"
              modalContent={<AddPropertyModal />}
              title="You have not creared any properties yet"
              body={
                <p>
                  You can create a property by clicking on the "Add Property"
                  button. You can create two types of properties: rental and
                  facility properties. Rental properties are mainly tailored for
                  managing properties for rent, including landlord and tenant
                  management processes. Facility properties are designed for
                  managing occupants in gated estates, overseeing their due
                  payments, visitor access, and vehicle records. <br />
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
                  properties.map((b) => (
                    <PropertyCard
                      key={b.id}
                      address="123 Main St"
                      id={1}
                      propertyId={1}
                      images={[
                        "/empty/SampleProperty.jpeg",
                        "/empty/SampleProperty2.jpeg",
                        "/empty/SampleProperty3.jpeg",
                        "/empty/SampleProperty4.jpeg",
                        "/empty/SampleProperty5.jpeg",
                      ]}
                      name="Property 1"
                      units={1}
                      price={1000}
                      propertyType={"facility"}
                      currency="Naira"
                    />
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
                      <PropertyListItem
                        key={p.id}
                        address="123 Main St"
                        id={1}
                        propertyId={1}
                        images={[
                          "/empty/empty.svg",
                          "/empty/empty.svg",
                          "/empty/empty.svg",
                          "/empty/empty.svg",
                          "/empty/empty.svg",
                        ]}
                        name="Property 1"
                        units={1}
                        price={1000}
                        propertyType={"facility"}
                        currency="Naira"
                      />
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
