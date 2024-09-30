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
import CreateTenancyAggrementModal from "@/components/BadgeIcon/create-tenancy-aggrement-modal";

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
        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-center">
            <h1 className="text-black text-2xl font-medium">Document</h1>
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
        </div>
        <div className="page-title-container">
          <div></div>
          <div className="flex items-center gap-4">
            <SearchInput placeholder="Search for Staff and Branch" />
            <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
              <button>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Picture src="/icons/sliders.svg" alt="filters" size={20} />
                  <p className="text-[#344054] text-base font-medium">
                    Filters
                  </p>
                </div>
              </button>
            </div>
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
