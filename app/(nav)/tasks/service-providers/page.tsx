"use client";
import { useEffect, useState } from "react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Link from "next/link";
import Pagination from "@/components/Pagination/pagination";
import Button from "@/components/Form/Button/button";
import ServiceProviderCard from "@/components/Management/landlord-and-tenant-card";
import DefaultLandlordAvatar from "@/public/empty/landlord-avatar.png";
import AddServiceProviderModal from "@/components/tasks/service-providers/add-service-provider-modal";
import { useAuthStore } from "@/store/authstrore";
import {
  getAllServiceProviders,
  serviceProviderFilterOptionsWithDropdown,
} from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";

const ServiceProviders = () => {
  const accessToken = useAuthStore((state) => state.access_token);
  const [state, setState] = useState({
    total_pages: 5,
    current_page: 1,
  });
  const { total_pages, current_page } = state;
  const handlePageChange = (page: number) => {
    setState((state) => ({ ...state, current_page: page }));
  };

  useEffect(() => {
    getAllServiceProviders(accessToken).then((response) => {
      console.log(response);
    });
  }, [accessToken]);

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Users"
            newData={30}
            total={40}
            className="w-[230px]"
          />
          <ManagementStatistcsCard
            title="Mobile Users"
            newData={40}
            total={40}
            className="w-[230px]"
          />
          <ManagementStatistcsCard
            title="Vacant Units"
            newData={40}
            total={40}
            className="w-[230px]"
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
        onStateSelect={() => {}}
        pageTitle="Service Provider"
        aboutPageModalData={{
          title: "Service Provider",
          description:
            "This page contains a list of Service Provider on the platform.",
        }}
        searchInputPlaceholder="Search for service provider"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptions={[]}
        filterWithOptionsWithDropdown={serviceProviderFilterOptionsWithDropdown}
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
              href={`/tasks/service-providers/${index + 1}/manage`}
              key={index}
            >
              <ServiceProviderCard
                id={index}
                first_name="Allys"
                last_name="Quantrill"
                email="aquantrill0@tinypic.com"
                user_tag={index % 2 === 0 ? "web" : "mobile"}
                phone_number="1787991995"
                picture_url={DefaultLandlordAvatar.src}
                service="Plumber, Electrician"
                cardType="service-provider"
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
