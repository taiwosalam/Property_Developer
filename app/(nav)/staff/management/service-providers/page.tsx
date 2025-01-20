"use client";
import { useEffect, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Link from "next/link";
import Pagination from "@/components/Pagination/pagination";
import Button from "@/components/Form/Button/button";
import ServiceProviderCard from "@/components/Management/landlord-and-tenant-card";
import DefaultLandlordAvatar from "@/public/empty/landlord-avatar.png";
import {
  getAllServiceProviders,
  serviceProviderFilterOptionsWithDropdown,
} from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import AddServiceProviderModal from "@/components/tasks/service-providers/add-service-provider-modal";

const ServiceProviders = () => {
  const [state, setState] = useState({
    total_pages: 5,
    current_page: 1,
  });
  const { total_pages, current_page } = state;
  const handlePageChange = (page: number) => {
    setState((state) => ({ ...state, current_page: page }));
  };

  useEffect(() => {
    // getAllServiceProviders
  }, []);

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Users"
            newData={30}
            total={40}
            className="w-[230px]"
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Mobile Users"
            newData={40}
            total={40}
            className="w-[230px]"
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Vacant Units"
            newData={40}
            total={40}
            className="w-[230px]"
            colorScheme={3}
          />
        </div>
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
      <FilterBar
        azFilter
        pageTitle="Service Provider"
        noExclamationMark
        searchInputPlaceholder="Search for service provider"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptionsMenu={serviceProviderFilterOptionsWithDropdown}
        hasGridListToggle={false}
      />
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
              href={{
                // remove this pathname and query shit
                pathname: `/accountant/management/service-providers/${index + 1}/manage`,
                query: {
                  user_tag: index % 2 === 0 ? "web" : "mobile",
                },
              }}
              key={index}
            >
              <ServiceProviderCard
                name="Allys Quantrill"
                email="aquantrill0@tinypic.com"
                user_tag={index % 2 === 0 ? "web" : "mobile"}
                badge_color="yellow"
                phone_number="1787991995"
                picture_url={DefaultLandlordAvatar.src}
                other_info="Plumber, Electrician"
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
