"use client";
import {
  estateSettingsDta,
  estateData,
  propertySettingsData,
  DUMMY_OCCUPANT,
  rentalData,
} from "@/components/Management/Rent And Unit/data";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import { useSearchParams } from "next/navigation";
import {
  RentDetails,
  AddPartPayment,
  EditCurrentRent,
  TransferTenants,
} from "@/components/Management/Rent And Unit/Edit-Rent/Edit-rent-sections";
import {
  RenewalFee,
  PreviousRentRecords,
} from "@/components/Management/Rent And Unit/renewal-rent-detals";
import { MatchedProfile } from "@/components/Management/Rent And Unit/matched-profile";

const EditRent = () => {
  const searchParams = useSearchParams();
  const propertyType = searchParams.get("type") as "rental" | "facility"; //would be gotten from API
  const isRental = propertyType === "rental";
  return (
    <div className="space-y-6 pb-[100px]">
      <BackButton>Edit {isRental ? "Rent" : "Fee"}</BackButton>
      <section className="space-y-6">
        <EstateDetails
          title={`${isRental ? "Unit" : "Estate"} Details`}
          estateData={isRental ? rentalData : estateData}
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
            <RentDetails isRental={isRental} />
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
            <EditCurrentRent isRental={isRental} />
            <AddPartPayment />
          </div>
          <div className="lg:flex-1 lg:!mt-[52px] space-y-8">
            <MatchedProfile
              occupant={DUMMY_OCCUPANT}
              title={`${isRental ? "Tenant" : "Occupant"} Profile`}
            />
            <TransferTenants isRental={isRental} />
          </div>
        </div>
        <PreviousRentRecords isRental={isRental} />
      </section>

      <FixedFooter className="flex gap-4 justify-end">
        <Button size="base_medium" className="py-2 px-6">
          Save
        </Button>
      </FixedFooter>
    </div>
  );
};

export default EditRent;
