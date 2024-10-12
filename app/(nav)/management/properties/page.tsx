"use client";
import { useEffect, useState } from "react";
import PropertyCard from "@/components/Management/Properties/property-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { ModalContent, ModalTrigger, Modal } from "@/components/Modal/modal";
import clsx from "clsx";
import Button from "@/components/Form/Button/button";
import SearchInput from "@/components/SearchInput/search-input";
import PageTitle from "@/components/PageTitle/page-title";
import Pagination from "@/components/Pagination/pagination";
import { ListIcon, GridIcon } from "@/public/icons/icons";
import AboutPage from "@/components/AboutPage/about-page";
import PropertyListItem from "@/components/Management/Properties/property-list-item";
import AddPropertyModal from "@/components/Management/Properties/add-property-modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterButton from "@/components/FilterButton/filter-button";
import { PropertyProps } from "@/components/Management/Properties/types";
import { useAuthStore } from "@/store/authstrore";
import { getAllProperties } from "./data";

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
            newData={200}
            total={657}
          />
          <ManagementStatistcsCard
            title="Rental Properties"
            newData={200}
            total={657}
          />
          <ManagementStatistcsCard
            title="Gated Estate"
            newData={200}
            total={657}
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
      <div className="page-title-container">
        <PageTitle
          title="Properties"
          aboutPageModal={
            <AboutPage
              title="Properties"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer rhoncus nunc interdum turpis bibendum, quis molestie sapien convallis. Vivamus porta elementum nibh, vel placerat mauris vehicula non. Ut maximus vehicula tortor, nec pretium lacus venenatis id. Morbi pretium aliquet nisi, nec vestibulum nibh blandit in. "
            />
          }
        />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search for Properties" />
          <div className="flex items-center gap-x-3">
            <button
              type="button"
              aria-label="list-view"
              className={clsx(
                "p-1 rounded-md",
                !gridView
                  ? "bg-black text-white"
                  : "bg-transparent text-[unset]"
              )}
              onClick={setListView}
            >
              <ListIcon />
            </button>
            <button
              type="button"
              aria-label="grid-view"
              className={clsx(
                "p-1 rounded-md",
                gridView ? "bg-black text-white" : "bg-transparent text-[unset]"
              )}
              onClick={setGridView}
            >
              <GridIcon />
            </button>
          </div>

          <Modal>
            <ModalTrigger asChild>
              <FilterButton />
            </ModalTrigger>
            <ModalContent>
              <div>Hi</div>
            </ModalContent>
          </Modal>
        </div>
      </div>

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
                  "/empty/empty.svg",
                  "/empty/empty.svg",
                  "/empty/empty.svg",
                  "/empty/empty.svg",
                  "/empty/empty.svg",
                ]}
                name="Property 1"
                units={1}
                price={1000}
                type="rent"
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
                type="rent"
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
