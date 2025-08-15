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
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";

const Profile = () => {
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const company_id = usePersonalInfoStore((state) => state.company_id);
  const { role } = useRole();

  // PERMISSIONS
  const canEditBranchProfile = usePermission(
    role,
    "Can view and edit branch profile"
  );
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
  if (error && canEditBranchProfile) return <ServerError error={error} />;

  return (
    <>
      <SettingsSection title="Branch Profile">
        <div
          className={`relative ${
            !canEditBranchProfile ? "pointer-events-none opacity-50" : ""
          }
    `}
        >
          <EditBranchForm somedata={branchData} page="manager" />
          {/* <div className="flex justify-end mt-4">
            <Button
              type="submit"
              size="sm_medium"
              className="update-branch-button py-2 px-8"
              form="edit-branch-form"
              disabled={updateRequestLoading}
            >
              {updateRequestLoading ? "Updating..." : "Update"}
            </Button>
          </div> */}

          {!canEditBranchProfile && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 rounded-md flex items-center justify-center text-center px-4">
              <p className="text-sm font-medium text-gray-700">
                ⚠️ You don’t have permission to edit this section.
              </p>
            </div>
          )}
        </div>
      </SettingsSection>
    </>
  );
};

export default Profile;
