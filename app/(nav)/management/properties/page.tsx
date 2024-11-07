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
import { useAuthStore } from "@/store/authstrore";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  propertyFilterOptionsRadio,
  propertyFilterOptionsWithDropdowns,
} from "./data";

const Properties = () => {
  const acessToken = useAuthStore((state) => state.access_token);

  const initialState = {
    gridView: true,
    total_pages: 20,
    current_page: 1,
    isModalOpen: false,
  };
  const [state, setState] = useState(initialState);
  const { gridView, total_pages, current_page } = state;
  const setGridView = () => {
    setState((state) => ({ ...state, gridView: true }));
  };
  const setListView = () => {
    setState((state) => ({ ...state, gridView: false }));
  };
  const handlePageChange = (page: number) => {
    setState((state) => ({ ...state, current_page: page }));
  };

  // const [properties, setProperties] = useState<PropertyProps[]>([]);

  useEffect(() => {
    // getAllProperties(acessToken).then((data) => {
    //   setProperties(data);
    // });
  }, [acessToken]);

  return (
    <div className="space-y-9">
      {/* Header with statistics cards */}
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Properties"
            newData={30}
            total={657}
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Rental Properties"
            newData={2000}
            total={6570}
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Facility Properties"
            newData={200}
            total={657}
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
        gridView={gridView}
        setGridView={setGridView}
        setListView={setListView}
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
      />

      {/* Card / List View */}
      <section>
        {gridView ? (
          <AutoResizingGrid minWidth={315}>
            {/* {properties.length >= 1 &&
                properties.map((p) => <PropertyCard {...p} key={p.id} />)} */}
            {Array.from({ length: 10 }).map((_, index) => (
              <PropertyCard
                key={index}
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
                propertyType={index % 2 === 0 ? "rental" : "facility"}
                currency="Naira"
              />
            ))}
          </AutoResizingGrid>
        ) : (
          <div className="space-y-4">
            {/* {properties.length >= 1 &&
              properties.map((p) => <PropertyListItem key={p.id} {...p} />)} */}
            {Array.from({ length: 10 }).map((_, index) => (
              <PropertyListItem
                key={index}
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
                propertyType={index % 2 === 0 ? "rental" : "facility"}
                currency="Naira"
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

export default Properties;
