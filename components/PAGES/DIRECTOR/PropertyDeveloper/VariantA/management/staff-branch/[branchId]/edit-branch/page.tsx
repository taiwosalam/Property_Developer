"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Imports
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import PropertyCard from "@/components/Management/Properties/property-card";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import EditBranchForm from "@/components/Management/Staff-And-Branches/Branch/edit-branch-form";
import DeleteBranchModal from "@/components/Management/Staff-And-Branches/Branch/delete-branch-modal";
import BranchPropertyListItem from "@/components/Management/Staff-And-Branches/Branch/branch-property-list-item";
import LockBranchModal from "@/components/Management/Staff-And-Branches/Branch/lock-branch-modal";
import UnLockBranchModal from "@/components/Management/Staff-And-Branches/Branch/unlock-branch-modal";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import type { SingleBranchResponseType } from "../types";
import { transformSingleBranchAPIResponseToEditBranchFormDetails } from "../data";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import SettingsBank from "@/components/Settings/settings-bank";
import { toast } from "sonner";
import ServerError from "@/components/Error/ServerError";
import { updateBranch } from "./data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import BranchBankSettings from "@/components/Settings/branch-bank";
import { usePathname, useRouter } from "next/navigation";
import { useTourStore } from "@/store/tour-store";
import { ExclamationMark } from "@/public/icons/icons";

const EditBranch = ({ params }: { params: { branchId: string } }) => {
  const { branchId } = params;
  const router = useRouter();
  const [isGridView, setIsGridView] = useState(true);

  const [updateRequestLoading, setUpdateRequestLoading] = useState(false);

  const { data, error, loading, refetch } = useFetch<SingleBranchResponseType>(
    `branch/${branchId}`
  );
  useRefetchOnEvent("refectch-branch", () => refetch({ silent: true }));

  const branchData = data
    ? transformSingleBranchAPIResponseToEditBranchFormDetails(data)
    : null;

  // Function to update branch bank details
  const updateBranchBankDetails = async (details: {
    bank_name: string;
    account_name: string;
    account_number: string;
    bank_code: string;
  }) => {
    const branchID = branchData?.id;
    if (!branchID) return toast.error("Cannot Find Branch ID");
    const payload = {
      bank_name: details.bank_name,
      account_name: details.account_name,
      account_number: details.account_number,
      bank_code: details.bank_code,
    };
    try {
      setUpdateRequestLoading(true);
      const status = await updateBranch(
        objectToFormData(payload),
        branchData.id
      );
      if (status) {
        toast.success("Branch Bank Details Updated Successfully");
        window.dispatchEvent(new Event("refectch-branch"));
        router.push(`/management/staff-branch/${branchID}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateRequestLoading(false);
    }
  };

  const {
    setShouldRenderTour,
    setPersist,
    isTourCompleted,
    goToStep,
    restartTour,
  } = useTourStore();

  const pathname = usePathname();

  useEffect(() => {
    setPersist(false);
    if (!isTourCompleted("EditBranchTour")) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [setShouldRenderTour, setPersist, isTourCompleted]);

  if (loading) return <PageCircleLoader />;

  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-10">
      <div className="flex flex-col gap-8 mb-[150px]">
        <div className="flex gap-8 flex-col md:flex-row justify-between flex-wrap">
          <div className="flex gap-2 items-center">
            <BackButton>Edit Branch</BackButton>
            <button
              onClick={() => restartTour(pathname)}
              type="button"
              className="text-orange-normal"
            >
              <ExclamationMark />
            </button>
          </div>

          <div className="flex gap-3">
            {branchData &&
              (branchData?.isActive ? (
                <Modal>
                  <ModalTrigger asChild>
                    <Button
                      type="button"
                      size="sm_medium"
                      className="lock-branch-button py-2 px-8 border-status-caution-2 text-status-error-2"
                      variant="blank"
                    >
                      Lock Branch !
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <LockBranchModal branchId={branchData.id} />
                  </ModalContent>
                </Modal>
              ) : (
                <Modal>
                  <ModalTrigger asChild>
                    <Button
                      type="button"
                      variant="blank"
                      size="sm_medium"
                      className="py-2 px-8 border-status-success-2 text-brand-9"
                    >
                      Un-Lock Branch !
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <UnLockBranchModal branchId={branchData.id} />
                  </ModalContent>
                </Modal>
              ))}
          </div>
        </div>
        <EditBranchForm
          somedata={branchData}
          // setUpdateRequestLoading={setUpdateRequestLoading}
        />
        <BranchBankSettings
          branch_account_name={branchData?.account_name}
          branch_account_number={branchData?.account_number}
          branch_bank_name={branchData?.bank_name}
          action={updateBranchBankDetails}
        />
      </div>
      <FixedFooter className="flex justify-between items-center flex-wrap">
        <Modal>
          <ModalTrigger asChild>
            <Button
              type="button"
              variant="light_red"
              size="sm_medium"
              className="delete-branch-button py-2 px-4 sm:px-8 text-xs sm:text-sm"
            >
              Delete Branch
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteBranchModal
              branchId={branchId}
              hasMoney={branchData?.hasMoney}
            />
          </ModalContent>
        </Modal>
        <Button
          type="button"
          onClick={() => {
            router.back();
          }}
          size="sm_medium"
          className="update-branch-button py-2 px-8"
        >
          Save
        </Button>
      </FixedFooter>
    </div>
  );
};

export default EditBranch;
