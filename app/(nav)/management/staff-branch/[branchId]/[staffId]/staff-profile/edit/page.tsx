"use client";
import {
  StaffEditProfileInfoSection,
  StaffEditAboutSection,
  StaffLockAccountSection,
  StaffEditChangePositionSection,
  StaffEditMoveToAnotherBranchSection,
  StaffEditAvatarInfoSection,
} from "@/components/Management/Staff-And-Branches/Branch/StaffProfile/edit-staff-info-sections";
import { StaffProfileProps } from "@/components/Management/Staff-And-Branches/Branch/StaffProfile/types";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import DeleteAccountModal from "@/components/Management/delete-account-modal";
import Button from "@/components/Form/Button/button";
import { StaffEditContext } from "@/components/Management/Staff-And-Branches/Branch/StaffProfile/staff-edit-context";

const mockdata: StaffProfileProps = {
  personal_title: "Evangelist",
  real_estate_title: "Realtor",
  full_name: "John Doe",
  email: "john@doe.com",
  phone_number: "08012345678",
  gender: "Male",
  position: "Evangelist",
  picture: "/empty/SampleLandlord.jpeg",
  about: "I am a software engineer",
};

const EditStaffProfile = () => {
  return (
    <StaffEditContext.Provider value={{ data: mockdata }}>
      <div className="custom-flex-col gap-6 lg:gap-10 pb-[100px]">
        <BackButton>Edit Staff</BackButton>
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          <div className="custom-flex-col gap-5 flex-1 lg:max-h-screen lg:overflow-auto custom-round-scrollbar">
            <StaffEditProfileInfoSection />
            <StaffEditMoveToAnotherBranchSection />
            <StaffEditChangePositionSection />
            <StaffEditAboutSection />
            <StaffLockAccountSection />
          </div>
          <div className="w-full lg:w-[334px] custom-flex-col gap-5 lg:max-h-screen lg:overflow-auto custom-round-scrollbar">
            <StaffEditAvatarInfoSection />
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
              <DeleteAccountModal accountType="staff" />
            </ModalContent>
          </Modal>

          <Button size="base_medium" className="py-2 px-6">
            save
          </Button>
        </FixedFooter>
      </div>
    </StaffEditContext.Provider>
  );
};

export default EditStaffProfile;
