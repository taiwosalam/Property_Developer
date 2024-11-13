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
import { MockFunction } from "@/components/Management/Tenants/Edit/mock";
import type { TenantData } from "../../../types";
const EditTenant = () => {
  const {
    data: tenant,
    error,
    loading,
    id: tenantId,
  } = MockFunction("tenant") as {
    data: TenantData;
    error: Error | null;
    loading: boolean;
    id: string;
  };

  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors | null>(null);

  const handleUpdateTenant = async (formData: FormData) => {
    console.log("formData: ", formDataToString(formData));
  };

  if (loading)
    return (
      <CustomLoader layout="edit-page" pageTitle="Edit Tenants & Occupant" />
    );
  if (error) return <div>Error: {error.message}</div>;
  if (!tenant) return null;

  // useEffect(() => {
  //   if (tenant?.user_tag === "mobile") {
  //     router.push(`/management/tenants/${tenant.id}/manage`);
  //   }
  // }, [tenant?.user_tag, router]);

  return (
    <TenantEditContext.Provider value={{ data: tenant }}>
      <AuthForm
        returnType="form-data"
        onFormSubmit={handleUpdateTenant}
        setValidationErrors={setErrorMsgs}
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
              href={`/management/tenants/${tenantId}/manage`}
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
