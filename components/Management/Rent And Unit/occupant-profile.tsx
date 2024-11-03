import React from "react";
import { OccupantProfileProps } from "./types";
import { MatchedProfile } from "./matched-profile";
import { FeeBreakdown } from "./fee-breakdown";
import { ProfileForm } from "./profile-form";

export const OccupantProfile: React.FC<OccupantProfileProps> = ({
  occupant,
  feeDetails,
  onEdit,
  title,
  title1,
  title2,
}) => {
  return (
    <div className="py-6 rounded-md space-y-4">
      <h6 className="font-bold text-[#092C4C] dark:text-white text-xl">
        {title} Profile
      </h6>
      <div className="lg:flex lg:gap-8">
        {/* Left Column */}
        <div className="lg:w-3/5 space-y-5">
          <div className="w-full h-[2px] bg-[#C0C2C8] opacity-20" />
          <ProfileForm occupant={occupant} title={title === "Tenant"} />
          <FeeBreakdown
            feeDetails={feeDetails}
            onEdit={onEdit}
            title1={title1}
            title2={title2}
          />
        </div>

        {/* Right Column */}
        <div className="mt-5 lg:mt-0 lg:flex-1 hidden lg:block">
          <MatchedProfile occupant={occupant} />
        </div>
      </div>
    </div>
  );
};
