"use client";
import { useState } from "react";
import { OccupantProfileProps, Occupant, FeeDetail } from "./types";
import { MatchedProfile } from "./matched-profile";
import { FeeBreakdown } from "./fee-breakdown";
import { ProfileForm } from "./profile-form";
import { RentSectionTitle } from "./rent-section-container";
import { Skeleton } from "@mui/material";
import { RentPeriod } from "./data";
import { useGlobalStore } from "@/store/general-store";
import { getLocalStorage } from "@/utils/local-storage";

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
  setIsPastDate,
  setDueDate,
  currency,
  disableInput,
  tenantsLoading,
}) => {
  const { selectedOccupant, tenantLoading, tenantError } = useGlobalStore();
  const defaultTenantId = getLocalStorage("selectedTenantId") || "";

  return (
    <>
      {loading ? (
        <OccupantProfileLoading />
      ) : (
        <div className="pt-6 space-y-4">
          <div className="lg:flex lg:gap-10">
            {/* Left Column */}
            <div className="lg:w-3/5 space-y-5">
              <FeeBreakdown
                id={id}
                total_package={total_package}
                feeDetails={feeDetails}
                isRental={isRental}
                currency={currency || "naira"}
              />
              <RentSectionTitle>
                {isRental ? "Tenant" : "Occupant"} Profile
              </RentSectionTitle>
              <div className="h-[2px] bg-[#C0C2C8] opacity-20" />

              <ProfileForm
                period={period as RentPeriod}
                setSelectedCheckboxOptions={setSelectedCheckboxOptions}
                isRental={isRental}
                occupants={occupants}
                setSelectedTenantId={setSelectedTenantId}
                setStart_date={setStart_date}
                setDueDate={setDueDate}
                currency={currency || "naira"}
                disableInput={disableInput}
                tenantsLoading={tenantsLoading}
              />
            </div>

            {/* Right Column */}
            <div className="mt-5 lg:mt-0 lg:flex-1 hidden lg:block">
              <MatchedProfile
                occupant={selectedOccupant}
                isLoading={tenantLoading}
                error={tenantError}
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
  );
};
