"use client";

// Imports
import Button from "@/components/Form/Button/button";
import DocumentCard from "@/components/Documents/document-card";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CreateTenancyAggrementModal, {
  DrawerComponent,
} from "@/components/BadgeIcon/create-tenancy-aggrement-modal";
import { DocumentssFilterOptionsWithDropdown } from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";

const Documents = () => {
  return (
    <div className="custom-flex-col gap-8">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Document"
            newData={34}
            total={657}
            colorScheme={1}
          />
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + create document
            </Button>
          </ModalTrigger>
          <ModalContent>
            <CreateTenancyAggrementModal />
          </ModalContent>
        </Modal>
        <DrawerComponent />
      </div>
      <div className="custom-flex-col gap-6">
        <FilterBar
          handleFilterApply={() => {}}
          pageTitle="Document"
          searchInputPlaceholder="Document Search"
          filterWithOptionsWithDropdown={DocumentssFilterOptionsWithDropdown}
          azFilter
          isDateTrue
        />
        <AutoResizingGrid minWidth={500}>
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
