"use client"
import React from "react";

// Images
import { ExclamationMark } from "@/public/icons/icons";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import SearchInput from "@/components/SearchInput/search-input";
import DocumentCard from "@/components/Documents/document-card";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CreateTenancyAggrementModal, { DrawerComponent } from "@/components/BadgeIcon/create-tenancy-aggrement-modal";
import SortButton from "@/components/FilterButton/sort-button";
import FilterButton from "@/components/FilterButton/filter-button";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import { DocumentssFilterOptionsWithDropdown } from "./data";

const Documents = () => {
  return (
    <div className="custom-flex-col gap-8">
      <AutoResizingGrid minWidth={240}>
        <ManagementStatistcsCard
          title="Total Document"
          newData={34}
          total={657}
        />
      </AutoResizingGrid>
      <div className="custom-flex-col gap-6">
        <div className="flex gap-4 sm:gap-0 flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex gap-1 items-center">
            <h1 className="text-black text-2xl font-medium dark:text-white">Document</h1>
            <ExclamationMark />
          </div>
          <Modal>
            <ModalTrigger asChild>
              <Button type="button" className="page-header-button">
                + create tenancy aggreement
              </Button>
            </ModalTrigger>
            <ModalContent>
              <CreateTenancyAggrementModal />
            </ModalContent>
          </Modal>
          <DrawerComponent />
        </div>
        <div className="page-title-container">
          <div></div>
          <div className="flex flex-wrap items-center gap-4">
            <SearchInput placeholder="Document Search" />
            <SortButton />
            <Modal>
              <ModalTrigger asChild>
                <FilterButton />
              </ModalTrigger>
              <ModalContent>
                <FilterModal
                  filterOptionsWithDropdown={DocumentssFilterOptionsWithDropdown}
                  filterOptions={[]}
                  onApply={() => { }
                  }
                  onStateSelect={() => { }}
                  date
                />
              </ModalContent>
            </Modal>
          </div>
        </div>
        <AutoResizingGrid minWidth={560}>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <DocumentCard key={index} />
            ))}
        </AutoResizingGrid>
      </div>
    </div>
  );
};

export default Documents;
