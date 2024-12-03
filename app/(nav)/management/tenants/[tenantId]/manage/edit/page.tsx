"use client";

// Imports
import { useState, useEffect } from "react";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
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

  const [tenantData, setTenantData] = useState<TenantData | null>(null);

  const { data, error, loading } = useFetch<IndividualTenantAPIResponse>(
    `tenant/${tenantId}`
  );

  useEffect(() => {
    if (data) {
      setTenantData(transformIndividualTenantAPIResponse(data));
    }
  }, [data]);

  if (loading)
    return (
      <CustomLoader layout="edit-page" pageTitle="Edit Tenants & Occupant" />
    );
  if (error) return <div>{error}</div>;
  if (!tenantData) return null;

  return (
    <TenantEditContext.Provider value={{ data: tenantData }}>
      <div className="custom-flex-col gap-6 lg:gap-10 pb-[100px]">
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

          <Button type="submit" size="base_medium" className="py-2 px-6">
            save
          </Button>
        </FixedFooter>
      </div>
    </TenantEditContext.Provider>
  );
};

export default EditTenant;
