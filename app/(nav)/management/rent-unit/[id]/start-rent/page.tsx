"use client";

import Button from "@/components/Form/Button/button";
import {
  estateSettingsDta,
  estateData,
  propertySettingsData,
  rentalData,
} from "@/components/Management/Rent And Unit/data";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import { OccupantProfile } from "@/components/Management/Rent And Unit/occupant-profile";
import BackButton from "@/components/BackButton/back-button";
import { useParams, useSearchParams } from "next/navigation";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useEffect, useState } from "react";
import {initialSingleData, InitialSingleUnit, InitialSingleUnitProps, singleUnitApiResponse, transformSingleUnitData, UnitDetails } from "../../data";
import useFetch from "@/hooks/useFetch";

const StartRent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const propertyType = searchParams.get("type") as "rental" | "facility"; 
  const isRental = propertyType === "rental";

  const [pageData, setPageData] = useState<InitialSingleUnitProps>(initialSingleData);
  const endpoint = `/unit/${id}/list`
  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<singleUnitApiResponse>(endpoint);

  useEffect(() => {
    if (apiData) {
      setPageData((x) => ({
        ...x,
        ...transformSingleUnitData(apiData), 
      }));
    }
  }, [apiData])

  
  const unit_data = pageData?.data[0];
  console.log("data", pageData?.data[0])

const rentalData = [
  { label: "Property Title", value: unit_data?.title },
  { label: "State", value: unit_data?.state },
  { label: "Local Government", value: unit_data?.localGovernment },
  { label: "Full Address", value: unit_data?.address },
  { label: "Branch", value: unit_data?.branchName  },
  { label: "Account Officer", value: "No Officer" }, //TODO
  { label: "Landlord", value: "No Landlord" }, //TODO
  { label: "Categories", value: unit_data?.categories },
  { label: "Unit ID", value: unit_data?.unit_id },
];

const propertySettingsData = [
  { label: "Agency Fee", value: unit_data?.agency_fee },
  { label: "Period", value: unit_data?.fee_period },
  { label: "Charge", value: unit_data?.whoToCharge },
  { label: "Caution Deposit", value: unit_data.caution_deposit },
  { label: "Group Chat", value: `${unit_data?.group_chat}`},
  { label: "Rent Penalty", value: `${unit_data?.rent_penalty}` },
];
  return (
    <div className="space-y-6 pb-[100px]">
      <BackButton>Start {isRental ? "Rent" : "Counting"}</BackButton>
      <section className="space-y-6">
        <EstateDetails
          title={`${isRental ? "Unit" : "Facility"} Details`}
          estateData={isRental ? rentalData : estateData}
        />
        <EstateSettings
          title={`${isRental ? "Property" : "Facility"} Settings`}
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
      <FixedFooter className={`flex justify-${isRental ? "between" : "end"}`}>
        {isRental && (
          <Button size="base_medium" className="py-2 px-6">
            Download Agreement
          </Button>
        )}
        <Button size="base_medium" className="py-2 px-6">
          Save
        </Button>
      </FixedFooter>
    </div>
  );
};

export default StartRent;
