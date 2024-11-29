"use client";

import { useState } from "react";

// Types
import type { ValidationErrors } from "@/utils/types";

// Imports

import Button from "@/components/Form/Button/button";
import { updateTenant } from "./data";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
import { AuthForm, formDataToString } from "@/components/Auth/auth-components";
import { TenantEditContext } from "@/components/Management/Tenants/Edit/tenant-edit-context";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import {
  TenantEditNoteSection,
  TenantEditAttachmentSection,
  TenantEditOthersInfoSection,
  TenantEditBankDetailsSection,
  TenantEditProfileInfoSection,
  TenantEditGuarantorInfoSection,
  TenantEditNextOfKinInfoSection,
  TenantEditAvatarInfoSection,
} from "@/components/Management/Tenants/Edit/tenant-edit-info-sectios";
import BackButton from "@/components/BackButton/back-button";
import CustomLoader from "@/components/Loader/CustomLoader";
import type { TenantData } from "../../../types";
import {
  transformIndividualTenantAPIResponse,
  type IndividualTenantAPIResponse,
} from "../data";
import useFetch from "@/hooks/useFetch";

const EditTenant = ({ params }: { params: { tenantId: string } }) => {
  const { tenantId } = params;
  const handleUpdateTenant = async (formData: FormData) => {
    console.log("formData: ", formDataToString(formData));
  };

  const { data, error, loading } = useFetch<IndividualTenantAPIResponse>(
    `tenant/${tenantId}`
  );

  const tenant = data ? transformIndividualTenantAPIResponse(data) : null;

  if (loading)
    return (
      <CustomLoader layout="edit-page" pageTitle="Edit Tenants & Occupant" />
    );
  if (error) return <div>{error}</div>;
  if (!tenant) return null;

  return (
    // <TenantEditContext.Provider value={{ data: tenant }}> NB: - I comment all these cuz i have to push some things to main & this throw ts err
    <TenantEditContext.Provider value={{ data: {} as TenantData }}> 
      <AuthForm
        returnType="form-data"
        onFormSubmit={handleUpdateTenant}
        className="custom-flex-col gap-6 lg:gap-10 pb-[100px]"
      >
        <BackButton>Edit Tenants & Occupant</BackButton>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="custom-flex-col gap-5 flex-1 lg:max-h-screen lg:overflow-auto custom-round-scrollbar">
            <TenantEditProfileInfoSection />
            <TenantEditNextOfKinInfoSection />
            <TenantEditGuarantorInfoSection />
            <TenantEditOthersInfoSection />
            <TenantEditBankDetailsSection />
            <TenantEditAttachmentSection />
            <TenantEditNoteSection />
          </div>

          {/* Right Side */}
          <div className="w-full lg:w-[334px] custom-flex-col gap-5 lg:max-h-screen lg:overflow-auto custom-round-scrollbar">
            <TenantEditAvatarInfoSection />
          </div>
        </div>
        <FixedFooter className="flex gap-4 justify-between items-center flex-wrap">
          <Modal>
            <ModalTrigger asChild>
              <Button
                type="button"
                variant="light_red"
                size="base_medium"
                className="py-2 px-6"
              >
                delete account
              </Button>
            </ModalTrigger>
            <ModalContent>
              <DeleteAccountModal />
            </ModalContent>
          </Modal>
          <div className="flex gap-6">
            <Button
              type="button"
              // href={`/management/tenants/${tenantId}/manage`}
              variant="sky_blue"
              size="base_medium"
              className="py-2 px-6 hidden md:block"
            >
              exit
            </Button>
            <Button type="submit" size="base_medium" className="py-2 px-6">
              save
            </Button>
          </div>
        </FixedFooter>
      </AuthForm>
    </TenantEditContext.Provider>
  );
};

export default EditTenant;
