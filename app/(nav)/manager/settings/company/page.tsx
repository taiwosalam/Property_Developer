"use client";

import React, { useState } from "react";

// Imports
import SettingsSection from "@/components/Settings/settings-section";

import { SettingsUpdateButton } from "@/components/Settings/settings-components";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import NetworkError from "@/components/Error/NetworkError";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import EditBranchForm from "@/components/Management/Staff-And-Branches/Branch/edit-branch-form";
import { SingleBranchResponseType } from "@/app/(nav)/management/staff-branch/[branchId]/types";
import { transformSingleBranchAPIResponseToEditBranchFormDetails } from "@/app/(nav)/management/staff-branch/[branchId]/data";
import ServerError from "@/components/Error/ServerError";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import Button from "@/components/Form/Button/button";

const Profile = () => {
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const company_id = usePersonalInfoStore((state) => state.company_id);

  const [updateRequestLoading, setUpdateRequestLoading] = useState(false);

  // Conditionally set the URL only if BRANCH_ID is valid
  const fetchUrl = BRANCH_ID && BRANCH_ID !== 0 ? `/branch/${BRANCH_ID}` : null;
  const { data, error, loading, refetch, isNetworkError } =
    useFetch<SingleBranchResponseType>(fetchUrl);
  useRefetchOnEvent("refectch-branch", () => refetch({ silent: true }));

  const branchData = data
    ? transformSingleBranchAPIResponseToEditBranchFormDetails(data)
    : null;

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <>
      <SettingsSection title="Branch Pofile">
        <EditBranchForm
          somedata={branchData}
          // setUpdateRequestLoading={setUpdateRequestLoading}
          page="manager"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm_medium"
            className="update-branch-button py-2 px-8"
            form="edit-branch-form"
            disabled={updateRequestLoading}
          >
            {updateRequestLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </SettingsSection>
    </>
  );
};

export default Profile;
