"use client";
import { useState } from "react";
import PropertyCard from "@/components/Management/Properties/property-card";
import { properties } from "./data";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { ModalContent, ModalTrigger, Modal } from "@/components/Modal/modal";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import Button from "@/components/Form/Button/button";
import Image from "next/image";
import SearchInput from "@/components/SearchInput/search-input";
import PageTitle from "@/components/PageTitle/page-title";
import Pagination from "@/components/Pagination/pagination";
import { ListIcon, GridIcon } from "@/public/icons/icons";
import AboutPage from "@/components/AboutPage/about-page";
import PropertyListItem from "@/components/Management/Properties/property-list-item";
import AddPropertyModal from "@/components/Management/Properties/add-property-modal";

const Property = () => {
  const router = useRouter();
  const initialState = {
    gridView: true,
    total_pages: 50,
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
  const handleClickPreview = (id: string | number) => {
    router.push(`/management/properties/${id}`);
  };
  const handleClickManage = (id: string | number) => {
    // router.push(`/management/property/${id}`);
  };

  return (
    <div className="space-y-9">
      {/* Header with statistics cards */}
      <div className="page-header-container">
        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
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
          <div className="hidden md:block xl:hidden">
            <div className="flex items-center justify-center w-full h-full">
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
          </div>
        </div>
        <div className="md:hidden xl:flex lg:ml-4">
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
      </div>
      {/*  */}
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
        <div className="flex items-center gap-x-4">
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
          <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
            <Modal>
              <ModalTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Image
                    src="/icons/sliders.svg"
                    alt="filter"
                    width={20}
                    height={20}
                  />
                  <p>Filters</p>
                </div>
              </ModalTrigger>
              <ModalContent>
                <div>Hi</div>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>

      {/* Card / List View */}
      <section>
        {gridView ? (
          <div
            className="grid gap-x-[30px] gap-y-5"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(370px, 1fr))",
            }}
          >
            {properties.slice(0, 30).map((p) => (
              <PropertyCard
                {...p}
                key={p.id}
                handleClickPreview={handleClickPreview}
                handleClickManage={handleClickManage}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {properties.slice(0, 30).map((p) => (
              <PropertyListItem
                key={p.id}
                {...p}
                handleClickPreview={handleClickPreview}
                handleClickManage={handleClickManage}
              />
            ))}
          </div>
        )}
        <Pagination
          totalPages={total_pages}
          currentPage={current_page}
          onPageChange={handlePageChange}
          className="mt-8 text-xs font-medium"
        />
      </section>
    </div>
  );
};

export default Property;
