"use client";

import { useEffect, useState } from "react";

// Types
import type { ValidationErrors } from "@/utils/types";
import { DeleteIconOrange } from "@/public/icons/icons";

// Imports
import useTenantData from "@/hooks/useTenantData";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";

import { updateTenant } from "./data";
import { ASSET_URL, empty } from "@/app/config";
import { useAuthStore } from "@/store/authstrore";
import Avatars from "@/components/Avatars/avatars";
import { useImageUploader } from "@/hooks/useImageUploader";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
import { AuthForm, formDataToString } from "@/components/Auth/auth-components";
import { TenantEditContext } from "@/components/Management/Tenants/Edit/tenant-edit-context";
import { LandlordTenantInfoEditSection } from "@/components/Management/landlord-tenant-info-components";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import {
  TenantEditNoteSection,
  TenantEditAttachmentSection,
  TenantEditOthersInfoSection,
  TenantEditBankDetailsSection,
  TenantEditProfileInfoSection,
  TenantEditGuarantorInfoSection,
  TenantEditNextOfKinInfoSection,
} from "@/components/Management/Tenants/Edit/tenant-edit-info-sectios";
import BackButton from "@/components/BackButton/back-button";
import CustomLoader from "@/components/Loader/CustomLoader";
import { MockFunction } from "@/components/Management/Tenants/Edit/mock";

const EditTenant = () => {
  // const { tenant, tenantId, error, loading } = useTenantData();
  const { data: tenant, tenantId, error, loading } = MockFunction();

  const { preview, setPreview, inputFileRef, handleImageChange } =
    useImageUploader();

  const [activeAvatar, setActiveAvatar] = useState<string>("");

  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors | null>(null);

  const accessToken = useAuthStore((state) => state.access_token);

  const handleAvatarChange = (avatar: string) => {
    setPreview(avatar);
    setActiveAvatar(avatar);
    inputFileRef.current?.value && (inputFileRef.current.value = "");
  };

  const handleChangeButton = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleUpdateTenant = async (formData: FormData) => {
    console.log("formData: ", formDataToString(formData));

    const response = await updateTenant({
      id: tenantId as string,
      formData,
      accessToken,
    });

    console.log(response);
  };

  useEffect(() => {
    setPreview(`${ASSET_URL}${tenant?.picture}` || tenant?.avatar || empty);
  }, [tenant, setPreview]);

  if (loading)
    return (
      <CustomLoader layout="edit-page" pageTitle="Edit Tenants & Occupant" />
    );
  if (error) return <div>Error: {error.message}</div>;
  if (!tenant) return null;

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
          <div className="custom-flex-col gap-5 flex-1">
            <TenantEditProfileInfoSection />
            <TenantEditNextOfKinInfoSection />
            <TenantEditGuarantorInfoSection />
            <TenantEditOthersInfoSection />
            <TenantEditBankDetailsSection />
            <TenantEditAttachmentSection />
          </div>

          {/* Right Side */}
          <div className="w-full lg:w-[334px]">
            <div className="lg:sticky top-[175px] w-full lg:h-[calc(100vh-250px)] overflow-auto custom-flex-col gap-5 custom-round-scrollbar">
              <LandlordTenantInfoEditSection title="edit avatar">
                <div className="flex">
                  <div className="relative">
                    <Picture src={preview} alt="camera" size={90} rounded />
                    <input
                      type="file"
                      id="picture"
                      name="picture"
                      accept="image/*"
                      className="hidden pointer-events-none"
                      onChange={handleImageChange}
                      ref={inputFileRef}
                    />
                    <input type="hidden" name="avatar" value={activeAvatar} />
                    <button
                      type="button"
                      className="absolute top-0 right-0 translate-x-[5px] -translate-y-[5px]"
                    >
                      <DeleteIconOrange size={32} />
                    </button>
                  </div>
                </div>
                <div className="custom-flex-col gap-3">
                  <p className="text-black text-base font-medium">
                    Choose Avatar
                  </p>
                  <Avatars type="avatars" onClick={handleAvatarChange} />
                </div>
                <Button
                  size="base_medium"
                  className="py-2 px-6"
                  onClick={handleChangeButton}
                >
                  change photo
                </Button>
              </LandlordTenantInfoEditSection>
              <TenantEditNoteSection />
            </div>
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
              href="/management/tenants/1/manage"
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
