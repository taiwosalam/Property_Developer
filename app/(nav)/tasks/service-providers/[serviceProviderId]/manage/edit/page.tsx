"use client";

import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
import { ServiceProviderEditContext } from "@/components/tasks/service-providers/service-provider-edit-context";
import { serviceProviderData as Mockdata } from "../data";
import BackButton from "@/components/BackButton/back-button";
import {
  ServiceProviderEditProfileInfoSection,
  ServiceProviderCompanyDetailsSection,
  ServiceProviderBankDetailsSection,
  ServiceProviderAttachmentSection,
  ServiceProviderNotesSection,
  ServiceProviderEditAvatarInfoSection,
} from "@/components/tasks/service-providers/service-provider-edit-info-sections";
import FixedFooter from "@/components/FixedFooter/fixed-footer";

const EditServiceProvider = () => {
  return (
    <ServiceProviderEditContext.Provider value={{ data: Mockdata }}>
      <div className="custom-flex-col gap-6 lg:gap-10 pb-[100px]">
        <BackButton>Edit Service Provider</BackButton>
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          <div className="custom-flex-col gap-5 flex-1 lg:max-h-screen lg:overflow-auto custom-round-scrollbar">
            <ServiceProviderEditProfileInfoSection />
            <ServiceProviderCompanyDetailsSection />
            <ServiceProviderBankDetailsSection />
            <ServiceProviderAttachmentSection />
            <ServiceProviderNotesSection />
          </div>
          <div className="w-full lg:w-[334px] custom-flex-col gap-5 lg:max-h-screen lg:overflow-auto custom-round-scrollbar">
            <ServiceProviderEditAvatarInfoSection />
          </div>
        </div>
        <FixedFooter className="flex justify-between items-center flex-wrap">
          <Modal>
            <ModalTrigger asChild>
              <Button size="custom" variant="light_red" className="py-2 px-6">
                delete account
              </Button>
            </ModalTrigger>
            <ModalContent>
              <DeleteAccountModal />
            </ModalContent>
          </Modal>
          <div className="flex gap-6">
            <Button
              href="/management/landlord/1/manage"
              size="base_medium"
              className="py-2 px-6 hidden md:block"
              variant="sky_blue"
            >
              Exit
            </Button>
            <Button size="base_medium" className="py-2 px-6">
              save
            </Button>
          </div>
        </FixedFooter>
      </div>
    </ServiceProviderEditContext.Provider>
  );
};

export default EditServiceProvider;
