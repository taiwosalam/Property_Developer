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
import { initData, initDataProps, singleUnitApiResponse, transformUnitData } from "../../data";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CardsLoading from "@/components/Loader/CardsLoading";
import NetworkError from "@/components/Error/NetworkError";

const EditRent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const isRental = propertyType === "rental";

  const [unit_data, setUnit_data] = useState<initDataProps>(initData);
  const endpoint = `/unit/${id}/view`

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
      setUnit_data((x: any) => ({
        ...x,
        ...transformUnitData(apiData)
      }))
    }
  }, [apiData])
  // console.log("Data", unit_data)

  if (loading)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
      </div>
    );

  if (isNetworkError) return <NetworkError />;

  if (error) return <div>{error}</div>;

  const propertyId = unit_data.propertyId;
  const rentalData = [
    { label: "Property Title", value: unit_data?.title },
    { label: "State", value: unit_data?.state },
    { label: "Local Government", value: unit_data?.localGovernment },
    { label: "Full Address", value: unit_data?.address },
    { label: "Branch", value: unit_data?.branchName },
    { label: "Account Officer", value: "No Officer" }, //TODO
    { label: "Landlord", value: "No Landlord" }, //TODO
    { label: "Categories", value: unit_data?.categories },
    { label: "Unit ID", value: unit_data?.unit_id },
  ];

  const propertySettingsData = [
    { label: "Agency Fee", value: `${unit_data?.agency_fee}%` },
    { label: "Period", value: unit_data?.fee_period },
    { label: "Charge", value: unit_data?.whoToCharge },
    { label: "Caution Deposit", value: unit_data.caution_deposit },
    { label: "Group Chat", value: `${unit_data?.group_chat}` },
    { label: "Rent Penalty", value: `${unit_data?.rent_penalty}` },
  ];


  return (
    <div className="space-y-6 pb-[100px]">
      <BackButton>Edit {isRental ? "Rent" : "Fee"}</BackButton>
      <section className="space-y-6">
        <EstateDetails
          title={`${isRental ? "Unit" : "Facility"} Details`}
          estateData={isRental ? rentalData : estateData}
        />
        <EstateSettings
          title={`${isRental ? "Property" : "Facility"} Settings`}
          id={propertyId as string}
          estateSettingsDta={
            isRental ? propertySettingsData : estateSettingsDta
          }
          {...(isRental ? { gridThree: true } : {})}
        />

        <div className="pt-6 lg:flex lg:gap-10 space-y-8">
          <div className="lg:w-3/5 space-y-8">
            <RentDetails
              isRental={isRental}
              startDate="12/12/24"
              dueDate="12/12/24"
              rentFee={unit_data.newTenantPrice}
              otherFee={unit_data.other_charge as string}
            />
            <RenewalFee
              isRental={isRental}
              feeDetails={[
                {
                  name: isRental ? "Rent" : "Fee",
                  amount: Number(unit_data.renewalTenantPrice),
                },
                { name: "Service Charge", amount: Number(unit_data.renew_service_charge) },
                { name: "Other Charges", amount: Number(unit_data.renew_other_charge) },
              ]}
              total_package={Number(unit_data.total_package)}
              id={propertyId as string}
            />
            <EditCurrentRent isRental={isRental} />
            <AddPartPayment />
          </div>
          <div className="lg:flex-1 lg:!mt-[52px] space-y-8">
            <MatchedProfile
              occupant={unit_data.occupant}
              title={`${isRental ? "Tenant" : "Occupant"} Profile`}
            />
            <TransferTenants isRental={isRental} />
          </div>
        </div>
        <PreviousRentRecords
          isRental={isRental}
          previous_records={unit_data.previous_records}
          unit_id={unit_data.unit_id}
        />
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
