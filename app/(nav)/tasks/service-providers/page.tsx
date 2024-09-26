"use client";
import { useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Link from "next/link";
import FilterButton from "@/components/FilterButton/filter-button";
import Pagination from "@/components/Pagination/pagination";
import Button from "@/components/Form/Button/button";
import ServiceProviderCard from "@/components/Management/landlord-and-tenant-card";
import DefaultLandlordAvatar from "@/public/empty/landlord-avatar.png";
import AddServiceProviderModal from "@/components/tasks/service-providers/add-service-provider-modal";
import useWindowWidth from "@/hooks/useWindowWidth";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";

const ServiceProviders = () => {
  const { isSmallTablet } = useWindowWidth();
  const [state, setState] = useState({
    total_pages: 5,
    current_page: 1,
  });
  const { total_pages, current_page } = state;
  const handlePageChange = (page: number) => {
    setState((state) => ({ ...state, current_page: page }));
  };

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        {!isSmallTablet && (
          <AutoResizingGrid minWidth={220} containerClassName="w-full">
            <ManagementStatistcsCard
              title="Total Users"
              newData={30}
              total={40}
            />
            <ManagementStatistcsCard
              title="Mobile Users"
              newData={40}
              total={40}
            />
            <ManagementStatistcsCard
              title="Vacant Units"
              newData={40}
              total={40}
            />
          </AutoResizingGrid>
        )}
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + Create New Service Provider
            </Button>
          </ModalTrigger>
          <ModalContent>
            <AddServiceProviderModal />
          </ModalContent>
        </Modal>
      </div>

      <div className="page-title-container">
        <PageTitle title="Service Provider" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search for providers" />
          <Modal>
            <ModalTrigger asChild>
              <FilterButton />
            </ModalTrigger>
            <ModalContent>Nothing here</ModalContent>
          </Modal>
        </div>
      </div>
      <section
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(284px, 1fr))",
        }}
      >
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Link
              href={`/tasks/service-providers/${index + 1}/manage`}
              key={index}
            >
              <ServiceProviderCard
                id={index}
                first_name="Allys"
                last_name="Quantrill"
                email="aquantrill0@tinypic.com"
                user_tag="web"
                phone_number="1787991995"
                picture_url={DefaultLandlordAvatar.src}
                service="Plumber, Electrician"
              />
            </Link>
          ))}
      </section>
      <Pagination
        totalPages={total_pages}
        currentPage={current_page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ServiceProviders;
