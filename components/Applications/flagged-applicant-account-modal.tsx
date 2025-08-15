import React, { useState } from "react";

// Imports
import Button from "../Form/Button/button";
import UserCard from "../Management/landlord-and-tenant-card";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import { FlaggedCard } from "./flagged-card";
import { toast } from "sonner";
import { rejectApplication } from "@/app/(nav)/tasks/applications/[applicationId]/manage/data";
import { useRouter } from "next/navigation";

interface IFlaggedModal {
  id?: number;
  type?: "pending" | "evaluated" | "approved" | "rejected" | "mobile";
  setIsOpen?: (val: boolean) => void;
  flag_details?: {
    flagger_id: number;
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
  type,
}: IFlaggedModal) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRejectApplication = async (
    path: string,
    appStatus?: "evaluated" | "rejected" | "pending" | "approved" | "mobile"
  ) => {
    if (!id) {
      return;
    }
    try {
      setIsLoading(true);
      if (path === "reject") {
        const res = await rejectApplication(id.toString(), "reject");
        if (res) {
          toast.success("Application rejected");
          setIsOpen?.(false);
        }
      } else {
        if (appStatus === "evaluated" || appStatus === "rejected") {
          return;
        }
        const res = await rejectApplication(id.toString(), "evaluate");
        if (res) {
          //toast.success("Application evaluate");
          setIsOpen?.(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LandlordTenantModalPreset
      heading="Applicant Account Is Flagged by;"
      style={{ maxWidth: "950px" }}
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

        <div className="flex flex-wrap gap-6 justify-between items-start mt-4">
          <div className="w-full lg:w-auto mx-auto">
            <p className="text-brand-9 text-center max-w-lg mx-auto font-semibold">
              Kindly advise the applicant to resolve any outstanding issues with
              their previous manager in order to lift the flag on their account.
            </p>
          </div>

          <div className="w-full flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 lg:w-auto">
            <Button
              size="base_bold"
              variant="light_red"
              className="py-2 px-8"
              disabled={isLoading}
              onClick={() => handleRejectApplication("reject")}
            >
              {isLoading ? "please wait..." : "reject application"}
            </Button>

            <Button
              size="base_bold"
              className="py-2 px-8"
              href={`/tasks/applications/${id}/manage`}
              onClick={() => {
                handleRejectApplication("evaluate", type);
                //router.push(`/tasks/applications/${id}/manage`);
              }}
            >
              skip
            </Button>
          </div>
        </div>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default FlaggedApplicantAccountModal;
