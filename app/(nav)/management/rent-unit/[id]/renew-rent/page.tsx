"use client";
import {
  estateSettingsDta,
  propertySettingsData,
  estateData,
} from "@/components/Management/Rent And Unit/data";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import {
  RenewalRentDetails,
  RenewalFee,
  RenewalRent,
  PreviousRentRecords,
} from "@/components/Management/Rent And Unit/renewal-rent-detals";
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import { useSearchParams } from "next/navigation";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { MatchedProfile } from "@/components/Management/Rent And Unit/matched-profile";
import { DUMMY_OCCUPANT } from "@/components/Management/Rent And Unit/data";

const RenewRent = () => {
  const searchParams = useSearchParams();
  const propertyType = searchParams.get("type") as "rental" | "facility"; //would be gotten from API
  const isRental = propertyType === "rental";
  return (
    <div className="space-y-6 pb-[100px]">
      <BackButton>Renew {isRental ? "Rent" : "Fee"}</BackButton>
      <section className="space-y-6">
        <EstateDetails
          title={`${isRental ? "Unit" : "Estate"} Details`}
          estateData={estateData}
        />
        <EstateSettings
          title={`${isRental ? "Property" : "Estate"} Settings`}
          estateSettingsDta={
            isRental ? propertySettingsData : estateSettingsDta
          }
          {...(isRental ? { gridThree: true } : {})}
        />
        <div className="pt-6 lg:flex lg:gap-10 space-y-8">
          <div className="lg:w-3/5 space-y-8">
            <RenewalRentDetails isRental={isRental} />
            <RenewalFee
              isRental={isRental}
              feeDetails={[
                {
                  name: isRental ? "Rent" : "Fee",
                  amount: 300000,
                },
                { name: "Service Charge", amount: 300000 },
                { name: "Other Charges", amount: 300000 },
              ]}
            />
            <RenewalRent isRental={isRental} />
          </div>
          <div className="lg:flex-1 lg:!mt-[52px]">
            <MatchedProfile occupant={DUMMY_OCCUPANT} title="User Profile" />
          </div>
        </div>
        <PreviousRentRecords isRental={isRental} />
      </section>
      <FixedFooter className="flex items-center justify-end">
        <Button size="base_medium" className="py-2 px-6">
          {isRental ? "Renew Rent" : "Renew"}
        </Button>
      </FixedFooter>
    </div>
  );
};

export default RenewRent;
