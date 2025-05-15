"use client";

import { useState } from "react";
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

const EditBranch = ({ params }: { params: { branchId: string } }) => {
  const { branchId } = params;
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
        window.dispatchEvent(new Event("refectch-branch"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateRequestLoading(false);
    }
  };

  if (loading) return <PageCircleLoader />;

  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-10">
      <div className="flex flex-col gap-8 mb-[150px]">
        <div className="flex gap-8 flex-col md:flex-row justify-between flex-wrap">
          <BackButton>Edit Branch</BackButton>
          <div className="flex gap-3">
            {branchData &&
              (branchData?.isActive ? (
                <Modal>
                  <ModalTrigger asChild>
                    <Button
                      type="button"
                      size="sm_medium"
                      className="py-2 px-8 border-status-caution-2 text-status-error-2"
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
          setUpdateRequestLoading={setUpdateRequestLoading}
        />
        {/* <SettingsBank
          branch
          branch_account_name={branchData?.account_name}
          branch_account_number={branchData?.account_number}
          branch_bank_name={branchData?.bank_name}
          action={updateBranchBankDetails}
        /> */}
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
              className="py-2 px-4 sm:px-8 text-xs sm:text-sm"
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
          type="submit"
          size="sm_medium"
          className="py-2 px-8"
          form="edit-branch-form"
          disabled={updateRequestLoading}
        >
          {updateRequestLoading ? "Updating..." : "Update"}
        </Button>
      </FixedFooter>
    </div>
  );
};

export default EditBranch;
