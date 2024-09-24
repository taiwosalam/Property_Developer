"use client";

import { useEffect, useState } from "react";

// Images
import Avatar from "@/public/empty/avatar-1.svg";
import OrangeCloseCircle from "@/public/icons/orange-close-circle.svg";

// Imports
import useTenantData from "@/hooks/useTenantData";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";

import { ASSET_URL, empty } from "@/app/config";
import Avatars from "@/components/Avatars/avatars";
import { useImageUploader } from "@/hooks/useImageUploader";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
import { TenantEditContext } from "@/components/Management/Tenants/Edit/tenant-edit-context";
import { LandlordTenantInfoEditSection } from "@/components/Management/landlord-tenant-info-components";

import {
  TenantEditNoteSection,
  TenantEditAttachmentSection,
  TenantEditOthersInfoSection,
  TenantEditBankDetailsSection,
  TenantEditProfileInfoSection,
  TenantEditGuarantorInfoSection,
} from "@/components/Management/Tenants/Edit/tenant-edit-info-sectios";

const EditTenant = () => {
  const { tenant } = useTenantData();

  const { preview, setPreview, inputFileRef, handleImageChange } =
    useImageUploader();

  const [activeAvatar, setActiveAvatar] = useState<string>("");

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

  useEffect(() => {
    setPreview(`${ASSET_URL}${tenant?.picture}` || tenant?.avatar || empty);
  }, [tenant, setPreview]);

  return (
    <TenantEditContext.Provider value={{ data: tenant }}>
      <div className="custom-flex-col gap-6 lg:gap-10 pb-[100px]">
        <h2 className="text-black text-xl font-medium">
          Edit Tenants & Occupant
        </h2>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="custom-flex-col gap-5 flex-1">
            <TenantEditProfileInfoSection />
            <TenantEditGuarantorInfoSection />
            <TenantEditOthersInfoSection />
            <TenantEditBankDetailsSection />
            <TenantEditAttachmentSection />
          </div>
          <div className="w-full lg:w-[334px] custom-flex-col gap-5">
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
                  <button className="absolute top-0 right-0 translate-x-[5px] -translate-y-[5px]">
                    <Picture
                      src={OrangeCloseCircle}
                      alt="close"
                      size={32}
                      style={{ objectFit: "contain" }}
                    />
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
        <div className="fixed bottom-0 right-0 w-full bg-white py-5 px-[60px] flex gap-6 justify-end">
          <Modal>
            <ModalTrigger asChild>
              <Button
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
              href="/management/tenants/1/manage"
              variant="sky_blue"
              size="base_medium"
              className="py-2 px-6"
            >
              exit
            </Button>
            <Button size="base_medium" className="py-2 px-6">
              save
            </Button>
          </div>
        </div>
      </div>
    </TenantEditContext.Provider>
  );
};

export default EditTenant;
