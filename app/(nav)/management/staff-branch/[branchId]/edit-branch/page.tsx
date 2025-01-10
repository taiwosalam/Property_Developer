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

const EditBranch = ({ params }: { params: { branchId: string } }) => {
  const { branchId } = params;
  const [isGridView, setIsGridView] = useState(true);

  const [updateRequestLoading, setUpdateRequestLoading] = useState(false);

  const { data, error, loading } = useFetch<SingleBranchResponseType>(
    `branch/${branchId}`
  );

  const branchData = data
    ? transformSingleBranchAPIResponseToEditBranchFormDetails(data)
    : null;

  if (loading) return <PageCircleLoader />;

  if (error) return <div>{error}</div>;

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
                    <LockBranchModal branchId={branchId} />
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
                    <UnLockBranchModal branchId={branchId} />
                  </ModalContent>
                </Modal>
              ))}
          </div>
        </div>
        <EditBranchForm
          somedata={branchData}
          setUpdateRequestLoading={setUpdateRequestLoading}
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
            <DeleteBranchModal branchId={branchId} />
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
