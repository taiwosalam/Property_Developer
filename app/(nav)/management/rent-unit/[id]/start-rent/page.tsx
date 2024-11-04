"use client";

import Button from "@/components/Form/Button/button";
import {
  estateSettingsDta,
  estateData,
  propertySettingsData,
} from "@/components/Management/Rent And Unit/data";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import { OccupantProfile } from "@/components/Management/Rent And Unit/occupant-profile";
import BackButton from "@/components/BackButton/back-button";
import { useSearchParams } from "next/navigation";
import FixedFooter from "@/components/FixedFooter/fixed-footer";

const StartRent = () => {
  const searchParams = useSearchParams();
  const propertyType = searchParams.get("type") as "rental" | "facility"; //would be gotten from API
  const isRental = propertyType === "rental";
  return (
    <div className="space-y-6 pb-[100px]">
      <BackButton>Start {isRental ? "Rent" : "Counting"}</BackButton>
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
        <OccupantProfile
          isRental={isRental}
          occupants={[
            { name: "Abimbola Adedeji", id: "id-1" },
            { name: "Tomi Lola", id: "id-2" },
            { name: "Hello World", id: "id-3" },
          ]}
          feeDetails={[
            { name: isRental ? "Annual Rent" : "Annual Fee", amount: 300000 },
            { name: "Service Charge", amount: 300000 },
            { name: "Caution Fee", amount: 300000 },
            { name: "Security Fee", amount: 300000 },
            { name: "Agency Fee", amount: 300000 },
            { name: "Other Charges", amount: 300000 },
          ]}
        />
      </section>
      <FixedFooter className="flex justify-end">
        <Button size="base_medium" className="py-2 px-6">
          Save
        </Button>
      </FixedFooter>
    </div>
  );
};

export default StartRent;
