import React, { useState } from "react";

// Imports
import Button from "../Form/Button/button";
import UserCard from "../Management/landlord-and-tenant-card";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import { FlaggedCard } from "./flagged-card";
import { toast } from "sonner";
import { rejectApplication } from "@/app/(nav)/tasks/applications/[applicationId]/manage/data";

interface IFlaggedModal {
  id?: number;
  setIsOpen?: (val: boolean) => void;
  flag_details?: {
    flagger_name: string;
    email: string;
    phone: string;
    tier_id: number;
    picture: string | null;
    is_flagged: boolean;
    reason: string | null;
    appeal_reason: string | null;
    company_name: string;
    status: "rejected" | "pending" | "evaluated" | "approved";
  }[];
}
const FlaggedApplicantAccountModal = ({
  flag_details,
  id,
  setIsOpen,
}: IFlaggedModal) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRejectApplication = async () => {
    if (!id) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await rejectApplication(id.toString());
      if (res) {
        toast.success("Application rejected");
        setIsOpen?.(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LandlordTenantModalPreset
      heading="Applicant Account Is Flagged"
      style={{ maxWidth: "900px" }}
    >
      <div className="custom-flex-col gap-6">
        <div className="custom-flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="custom-flex-col gap-2 flex-1">
              {flag_details?.map((flag, index) => (
                <FlaggedCard {...flag} key={index} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-end">
          <Button
            size="base_bold"
            variant="light_red"
            className="py-2 px-8"
            disabled={isLoading}
            onClick={handleRejectApplication}
          >
            {isLoading ? "please wait..." : "reject application"}
          </Button>
          <Button
            size="base_bold"
            className="py-2 px-8"
            href={`/tasks/applications/${id}/manage`}
          >
            skip
          </Button>
        </div>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default FlaggedApplicantAccountModal;
