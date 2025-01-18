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
import { useParams } from "next/navigation";
import useBranchStore from "@/store/branch-store";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { StaffAPIResponse } from "../type";
import { staffData, transformStaffAPIResponse, yesNoToActiveInactive } from "../data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { deleteStaff } from "./data";
import { useRouter } from "next/navigation";

const EditStaffProfile = () => {
  const { branchId, staffId } = useParams();
  const { branch } = useBranchStore();
  const router = useRouter()

  const [pageData, setPageData] = useState<StaffProfileProps>(staffData);
  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<StaffAPIResponse>(`/staff/${staffId}`);
  useRefetchOnEvent("staff-updated", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setPageData(
        {
          id: apiData.data.id,
          branch_id: branchId as string,
          personal_title: apiData.data.title,
          real_estate_title: apiData.data.real_estate_title,
          full_name: apiData.data.name,
          email: apiData.data.email,
          phone_number: apiData.data.phone,
          gender: apiData.data.gender,
          position: apiData.data.position,
          picture: apiData.data.picture,
          about: apiData.data.about_staff,
          status: yesNoToActiveInactive(apiData.data.status),
        }
      )
    }
  }, [apiData, branchId]);

  const handleDeleteStaffAccount = () => {
    try{
    }catch(error){
      console.log(error);
    }
  }

  console.log("data -", apiData);
  // console.log("page -", pageData);

  if (loading)
    return <CustomLoader layout="edit-page" pageTitle="Edit Staff" />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <div>{error}</div>;
  if (!apiData) return null;

  return (
    <StaffEditContext.Provider value={{ data: pageData }}>
      <div className="custom-flex-col gap-6 lg:gap-10 pb-[100px]">
        <BackButton>Edit Staff</BackButton>
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          <div className="custom-flex-col gap-5 flex-1 lg:max-h-screen lg:overflow-auto custom-round-scrollbar">
            <StaffEditProfileInfoSection />
            <StaffEditAboutSection />
            <StaffEditMoveToAnotherBranchSection />
            <StaffEditChangePositionSection />
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
              <DeleteAccountModal
               action={async () => await deleteStaff(pageData.id)}
               afterAction={() => router.push("/management/staff-branch")}
               />
            </ModalContent>
          </Modal>

          <Button 
            size="base_medium" 
            className="py-2 px-6" 
            onClick={() => router.back()}
          >
            save
          </Button>
        </FixedFooter>
      </div>
    </StaffEditContext.Provider>
  );
};

export default EditStaffProfile;
