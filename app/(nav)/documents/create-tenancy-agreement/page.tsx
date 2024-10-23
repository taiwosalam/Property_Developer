import React from "react";

// Imports
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteDocumentModal from "@/components/Documents/delete-document-modal";
import { LandlordTenantInfoBox } from "@/components/Management/landlord-tenant-info-components";
import DocumentTenancyAgreements from "@/components/Documents/document-tenancy-agreements";

const CreateTenancyAggrement = () => {
  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-6">
        <BackButton>Create Tenancy Agreement</BackButton>
        <LandlordTenantInfoBox className="custom-flex-col gap-[10px]">
          <h2 className="text-primary-navy dark:text-darkText-1 text-xl font-bold">
            Property Details
          </h2>
          <SectionSeparator />
          <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
            <KeyValueList
              data={{}}
              chunkSize={2}
              referenceObject={{
                "property description": "",
                "property address": "",
                "annual rent": "",
                "caution deposit": "",
              }}
            />
          </div>
        </LandlordTenantInfoBox>
        <LandlordTenantInfoBox className="custom-flex-col gap-[10px]">
          <h2 className="text-primary-navy dark:text-darkText-1 text-xl font-bold">
            Landlord/Landlady Details
          </h2>
          <SectionSeparator />
          <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
            <KeyValueList
              data={{}}
              chunkSize={2}
              referenceObject={{
                "Landlord/Landlady Name": "",
                "Landlord/Landlady ID": "",
                "Landlord/Landlady Address": "",
                "account type": "",
              }}
            />
          </div>
        </LandlordTenantInfoBox>
      </div>
      <div className="custom-flex-col gap-8">
        <div className="custom-flex-col gap-4">
          <div className="custom-flex-col gap-1">
            <h2 className="text-primary-navy dark:text-darkText-1 text-xl font-bold">
              Agreement Customization
            </h2>
            <p className="text-text-disabled text-sm font-normal">
              Please select any of the options below that applies to the
              agreement
            </p>
          </div>
          <SectionSeparator />
        </div>
        <DocumentTenancyAgreements />
      </div>
      <div className="fixed bottom-0 right-0 w-full bg-white dark:bg-darkText-primary py-5 px-[60px] flex gap-6 justify-end">
        <Modal>
          <ModalTrigger asChild>
            <Button variant="light_red" size="base_bold" className="py-2 px-6">
              delete account
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteDocumentModal />
          </ModalContent>
        </Modal>
        <div className="flex gap-6">
          <Button variant="sky_blue" size="base_bold" className="py-2 px-6">
            print & preview
          </Button>
          <Button size="base_bold" className="py-2 px-6">
            save as draft
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTenancyAggrement;
