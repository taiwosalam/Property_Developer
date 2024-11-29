"use client";

import Button from "@/components/Form/Button/button";

import { LandlordEditContext } from "@/components/Management/Landlord/landlord-edit-context";
import {
  type IndividualLandlordAPIResponse,
  transformIndividualLandlordAPIResponse,
} from "../data";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
import BackButton from "@/components/BackButton/back-button";
import CustomLoader from "@/components/Loader/CustomLoader";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
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
import { useRouter } from "next/navigation"; //only web can edit profile
import useFetch from "@/hooks/useFetch";

const EditLandlord = ({ params }: { params: { landlordId: string } }) => {
  const { landlordId } = params;
  const { data, error, loading } = useFetch<IndividualLandlordAPIResponse>(
    `landlord/${landlordId}`
  );

  const landlord = data ? transformIndividualLandlordAPIResponse(data) : null;

  if (loading)
    return <CustomLoader layout="edit-page" pageTitle="Edit Landlord" />;
  if (error) return <div>{error}</div>;
  if (!landlord) return null;

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

          <Button size="base_medium" className="py-2 px-6">
            save
          </Button>
        </FixedFooter>
      </div>
    </LandlordEditContext.Provider>
  );
};

export default EditLandlord;
