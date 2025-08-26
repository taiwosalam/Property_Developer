"use client";

import Button from "@/components/Form/Button/button";
import { useEffect, useState } from "react";
import { LandlordEditContext } from "@/components/Management/Landlord/landlord-edit-context";
import {
  type IndividualClientAPIResponse,
  transformIndividualClientAPIResponse,
} from "../data";
// import { LandlordPageData } from "../../../types";
import { ClientPageData } from "../../../types";
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
import { usePathname, useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { deleteLandlord } from "./data";
import { useTourStore } from "@/store/tour-store";
import { ExclamationMark } from "@/public/icons/icons";

const EditLandlord = ({ params }: { params: { landlordId: string } }) => {
  const { landlordId } = params;
  const router = useRouter();
  const [landlordData, setLandlordData] = useState<ClientPageData | null>(
    null
  );

  const { data, error, loading, refetch } =
    useFetch<IndividualClientAPIResponse>(`landlord/${landlordId}`);

  useRefetchOnEvent("landlord-updated", () => refetch({ silent: true }));

  useEffect(() => {
    if (data) {
      setLandlordData(transformIndividualClientAPIResponse(data));
    }
  }, [data]);

  const pathname = usePathname();
  const {
    setShouldRenderTour,
    setPersist,
    isTourCompleted,
    goToStep,
    restartTour,
  } = useTourStore();

  useEffect(() => {
    setPersist(false);
    if (!isTourCompleted("editLandlordSteps")) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [setShouldRenderTour, setPersist, isTourCompleted]);

  if (loading)
    return <CustomLoader layout="edit-page" pageTitle="Edit Landlord" />;
  if (error) return <div>{error}</div>;
  if (!landlordData) return null;

  return (
    <LandlordEditContext.Provider value={{ data: landlordData }}>
      <div className="custom-flex-col gap-6 lg:gap-10 pb-[100px]">
        <div className="flex gap-2 items-center">
          <BackButton>Edit Landlord</BackButton>
          <button
            onClick={() => restartTour(pathname)}
            type="button"
            className="text-orange-normal"
          >
            <ExclamationMark />
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          {/* Left Side */}
          <div className="custom-flex-col gap-5 flex-1 lg:max-h-screen lg:overflow-auto custom-round-scrollbar">
            <LandlordEditProfileInfoSection />
            <LandlordEditNextOfKinInfoSection />
            {/* <LandlordEditGuarantorInfoSection /> */}
            {/* will handle guarantor for mobile users later */}
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
                className="delete-button py-2 px-6"
                variant="light_red"
              >
                delete account
              </Button>
            </ModalTrigger>
            <ModalContent>
              <DeleteAccountModal
                accountType="landlord"
                action={async () => await deleteLandlord(landlordId)}
                afterAction={() => router.push("/management/landlord")}
              />
            </ModalContent>
          </Modal>

          <Button
            size="base_medium"
            className="save-button py-2 px-6"
            onClick={() => {
              // router.push(`/management/landlord/${landlordId}`);
              router.push(`/management/landlord`);
            }}
          >
            save
          </Button>
        </FixedFooter>
      </div>
    </LandlordEditContext.Provider>
  );
};

export default EditLandlord;
