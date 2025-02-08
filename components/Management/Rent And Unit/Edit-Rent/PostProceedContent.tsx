"use client";

import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import {
  estateSettingsDta,
  estateData,
  propertySettingsData,
  rentalData,
  DUMMY_OCCUPANT,
  RentPreviousRecords,
  calculateBalance,
} from "@/components/Management/Rent And Unit/data";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import { PreviousUnitBalance, NewUnitCost } from "./Edit-rent-sections";
import {
  RenewalRent as StartRent,
  PreviousRentRecords,
} from "../renewal-rent-detals";
import { MatchedProfile } from "../matched-profile";
import { useRouter } from "next/navigation";
import ModalPreset from "@/components/Modal/modal-preset";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useSearchParams } from "next/navigation";
import { useOccupantStore } from "@/hooks/occupant-store";
import { initData, initDataProps, singleUnitApiResponse, transformUnitData } from "@/app/(nav)/management/rent-unit/data";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";

const PostProceedContent = ({ selectedUnitId }: { selectedUnitId?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const id = searchParams.get("p");
  const isRental = propertyType === "rental";
  const { occupant, propertyData, records } = useOccupantStore();

  // SELECTED UNIT DATA FETCH
  console.log('sele id', selectedUnitId)
  const [unit_data, setUnit_data] = useState<initDataProps>(initData);
  const endpoint = `/unit/${selectedUnitId}/view`
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
      const transformedData = transformUnitData(apiData);
      setUnit_data((x: any) => ({
        ...x,
        ...transformedData,
      }));
    }
  }, [apiData]);

  console.log("occupant", unit_data)
  const startday = records?.[0]?.start_date;
  const endDay = records?.[0]?.due_date;
  const amt = records?.[0]?.amount_paid;
  
  // Only calculate the balance if all values exist, otherwise default to 0
  const bal = startday && endDay && amt ? calculateBalance(amt, startday, endDay) : 0;
  const rentalData = [
    { label: "Property Title", value: propertyData?.property_name },
    { label: "State", value: propertyData?.state },
    { label: "Local Government", value: propertyData?.local_government },
    { label: "Full Address", value: propertyData?.address },
    { label: "Branch", value: propertyData?.branch },
    { label: "Account Officer", value: propertyData?.account_officer || "" },
    { label: "Landlord", value: propertyData?.landlord_name },
    { label: "Categories", value: propertyData?.category },
    // { label: "Unit ID", value: propertyData?.units },
  ];

  const propertySettingsData = [
    { label: "Agency Fee", value: `${propertyData?.agency_fee}%` },
    { label: "Period", value: propertyData?.fee_period },
    { label: "Charge", value: propertyData?.rent_penalty },
    { label: "Caution Deposit", value: propertyData.caution_deposit },
    { label: "Group Chat", value: `${propertyData?.group_chat}` },
    { label: "Rent Penalty", value: `${propertyData?.who_to_charge_new_tenant}` },
  ];
  return (
    <div className="space-y-6 pb-[100px]">
      <BackButton>Change Property Unit</BackButton>
      <section className="space-y-6">
        <EstateDetails
          title={`${isRental ? "Property" : "Estate"} Details`}
          estateData={isRental ? rentalData : estateData}
        />
        <EstateSettings
          title={`${isRental ? "Property" : "Estate"} Settings`}
          estateSettingsDta={
            isRental ? propertySettingsData : estateSettingsDta
          }
          {...(isRental ? { gridThree: true } : {})}
          id={id as string}
        />
        <div className="pt-6 lg:flex lg:gap-10 space-y-8">
          <div className="lg:w-3/5 space-y-8">
            <PreviousUnitBalance
              isRental={isRental}
              items={records as RentPreviousRecords[]}
              total={`${bal}`}
            />
            <NewUnitCost
              isRental={isRental}
              feeDetails={[
                {
                  name: isRental ? "Rent" : "Fee",
                  amount: Number(unit_data?.fee_amount),
                },
                { name: "Service Charge", amount: Number(unit_data?.service_charge) },
                { name: "Caution Fee", amount: Number(unit_data?.caution_fee) },
                { name: "Other Charges", amount: Number(unit_data?.other_charge) },
              ]}
              total={Number(unit_data?.total_package)}
              id={unit_data?.id}
            />
            <StartRent
              isRental={isRental}
              rentPeriod="yearly"
              title={`Start ${isRental ? "Rent" : "Counting"}`}
              start
            />
          </div>
          <div className="lg:flex-1 lg:!mt-[52px]">
            <MatchedProfile
              occupant={occupant}
              title="User Profile"
            />
          </div>
        </div>
        <PreviousRentRecords
          isRental={isRental}
        />
      </section>

      <FixedFooter className="flex items-center justify-end">
        <Modal>
          <ModalTrigger asChild>
            <Button size="base_medium" className="py-2 px-6">
              Proceed
            </Button>
            <ModalContent>
              <ModalPreset type="success" className="w-full">
                <div className="flex flex-col gap-8">
                  <p className="text-text-tertiary text-sm">
                    Record Added Successfully
                  </p>
                  <Button
                    onClick={() => {
                      router.push("/management/rent-unit");
                    }}
                  >
                    OK
                  </Button>
                </div>
              </ModalPreset>
            </ModalContent>
          </ModalTrigger>
        </Modal>
      </FixedFooter>
    </div>
  );
};

export default PostProceedContent;
