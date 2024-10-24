"use client";

// Images

import Button from "@/components/Form/Button/button";

import { LandlordEditContext } from "@/components/Management/Landlord/landlord-edit-context";

import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
import useLandlordData from "@/hooks/useLandlordData";
import { useAuthStore } from "@/store/authstrore";
import BackButton from "@/components/BackButton/back-button";
import CustomLoader from "@/components/Loader/CustomLoader";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { MockFunction } from "@/components/Management/Tenants/Edit/mock";
import type { LandlordPageData } from "@/app/(nav)/management/landlord/types";
import {
  LandlordEditProfileInfoSection,
  LandlordEditNextOfKinInfoSection,
  LandlordEditGuarantorInfoSection,
  LandlordEditBankDetailsInfoSection,
  LandlordEditOthersInfoSection,
  LandlordEditAttachmentInfoSection,
  LandlordEditNoteInfoSection,
  LandlordEditAvatarInfoSection,
} from "@/components/Management/Landlord/Edit/landlord-edit-info-sections";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const EditLandlord = () => {
  // const { landlord, landlordId, error, loading } = useLandlordData();
  const router = useRouter();
  const {
    data: landlord,
    error,
    loading,
  } = MockFunction("landlord") as {
    data: LandlordPageData;
    error: Error | null;
    loading: boolean;
  };
  const accessToken = useAuthStore((state) => state.access_token);

  if (loading)
    return <CustomLoader layout="edit-page" pageTitle="Edit Landlord" />;
  if (error) return <div>Error: {error.message}</div>;
  if (!landlord) return null;

  useEffect(() => {
    if (landlord?.user_tag === "mobile") {
      router.push(`/management/landlord/${landlord.id}/manage`);
    }
  }, [landlord?.user_tag, router]);

  return (
    <LandlordEditContext.Provider value={{ data: landlord }}>
      <div className="custom-flex-col gap-6 lg:gap-10 pb-[100px]">
        <BackButton>Edit Landlord</BackButton>
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          {/* Left Side */}
          <div className="custom-flex-col gap-5 flex-1 lg:max-h-screen lg:overflow-auto custom-round-scrollbar">
            <LandlordEditProfileInfoSection />
            <LandlordEditNextOfKinInfoSection />
            <LandlordEditGuarantorInfoSection />
            <LandlordEditOthersInfoSection />
            <LandlordEditBankDetailsInfoSection />
            <LandlordEditAttachmentInfoSection />
            <LandlordEditNoteInfoSection />
          </div>

          {/* Right Side */}
          <div className="w-full lg:w-[334px] custom-flex-col gap-5 lg:max-h-screen lg:overflow-auto custom-round-scrollbar">
            <LandlordEditAvatarInfoSection />
          </div>
        </div>
        <FixedFooter className="flex justify-between items-center flex-wrap">
          <Modal>
            <ModalTrigger asChild>
              <Button
                size="base_medium"
                className="py-2 px-6"
                variant="light_red"
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
              href={`/management/landlord/${landlord.id}/manage`}
              size="base_medium"
              className="py-2 px-6 hidden md:block"
              variant="sky_blue"
            >
              exit
            </Button>
            <Button size="base_medium" className="py-2 px-6">
              save
            </Button>
          </div>
        </FixedFooter>
      </div>
    </LandlordEditContext.Provider>
  );
};

export default EditLandlord;
