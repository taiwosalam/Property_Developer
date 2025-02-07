"use client";
import { useState } from "react";
import { OccupantProfileProps, Occupant } from "./types";
import { MatchedProfile } from "./matched-profile";
import { FeeBreakdown } from "./fee-breakdown";
import { ProfileForm } from "./profile-form";
import { RentSectionTitle } from "./rent-section-container";
import { Skeleton } from "@mui/material";
import { RentPeriod } from "./data";

export const OccupantProfile: React.FC<OccupantProfileProps> = ({
  isRental,
  occupants,
  feeDetails,
  total_package,
  id,
  loading,
  setSelectedTenantId,
  setSelectedCheckboxOptions,
  period,
  setStart_date,
}) => {
  const [selectedOccupant, setSelectedOccupant] = useState<Occupant | null>(
    null
  );
  const handleOccupantSelect = (occupant: Occupant | null) => {
    setSelectedOccupant(occupant);
  };
  const [occupantLoading, setOccupantLoading] = useState(false);
  const [occupantError, setOccupantError] = useState<Error | null>(null);


  return (
    <>
      {loading ? (
        <OccupantProfileLoading />
      ) : (
        <div className="pt-6 space-y-4">
          <RentSectionTitle>
            {isRental ? "Tenant" : "Occupant"} Profile
          </RentSectionTitle>
          <div className="lg:flex lg:gap-10">
            {/* Left Column */}
            <div className="lg:w-3/5 space-y-5">
              <div className="h-[2px] bg-[#C0C2C8] opacity-20" />
              <ProfileForm
                period={period as RentPeriod}
                setSelectedCheckboxOptions={setSelectedCheckboxOptions}
                isRental={isRental}
                selectedOccupant={selectedOccupant}
                occupants={occupants}
                onOccupantSelect={handleOccupantSelect}
                onLoadingChange={setOccupantLoading}
                onError={setOccupantError}
                occupantLoading={occupantLoading}
                occupantError={occupantError}
                setSelectedTenantId={setSelectedTenantId}
                setStart_date={setStart_date}
              />
              <FeeBreakdown id={id} total_package={total_package} feeDetails={feeDetails} isRental={isRental} />
            </div>

            {/* Right Column */}
            <div className="mt-5 lg:mt-0 lg:flex-1 hidden lg:block">
              <MatchedProfile
                occupant={selectedOccupant}
                isLoading={occupantLoading}
                error={occupantError}
                title="Matched Profile"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};


const OccupantProfileLoading = () => {
  return (
    <Skeleton
      width={"100%"}
      height={200}
      animation="wave"
      sx={{
        transform: "none",
      }}
    />
  )
}