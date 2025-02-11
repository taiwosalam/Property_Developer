"use client";
import {
  estateSettingsDta,
  propertySettingsData,
  estateData,
  rentalData,
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
import { initData, initDataProps, singleUnitApiResponse, transformUnitData } from "../../data";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import { getPropertySettingsData, getRentalData } from "./data";
import dayjs from "dayjs";

const RenewRent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const propertyType = searchParams.get("type") as "rental" | "facility"; //would be gotten from API
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

  console.log("data here -", unit_data);

  if (loading)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
      </div>
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <div className="text-red-500">{error}</div>;

  const propertyId = unit_data.propertyId;
  const record = (unit_data?.previous_records as any)?.data?.[0];
  const start_date = record?.start_date ? dayjs(record?.start_date).format("DD/MM/YYYY") : "__,__,___";
  const due_date = record?.due_date ? dayjs(record?.due_date).format("DD/MM/YYYY") : "___,___,___";
  const propertySettingsData = getPropertySettingsData(unit_data)
  const rentalData = getRentalData(unit_data)

  return (
    <div className="space-y-6 pb-[100px]">
      <BackButton>Renew {isRental ? "Rent" : "Fee"}</BackButton>
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
            <RenewalRentDetails
              isRental={isRental}
              startDate={start_date}
              dueDate={due_date}
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
            <RenewalRent isRental={isRental} rentPeriod="yearly" />
          </div>
          <div className="lg:flex-1 lg:!mt-[52px]">
            <MatchedProfile
              occupant={unit_data?.occupant}
              title="User Profile"
            />
          </div>
        </div>
        <PreviousRentRecords
          isRental={isRental}
          unit_id={id as string}
          previous_records={unit_data.previous_records as any}
        />
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
