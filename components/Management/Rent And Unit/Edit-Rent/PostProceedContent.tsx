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
import dayjs from "dayjs";
import { formatNumber } from "@/utils/number-formatter";
import { toast } from "sonner";
import { getPropertySettingsData, getRentalData } from "./data";
import { switchUnit } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";

const PostProceedContent = ({ selectedUnitId }: { selectedUnitId?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const id = searchParams.get("p");
  const isRental = propertyType === "rental";
  const [reqLoading, setReqLoading] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);


  const {
    occupant,
    propertyData,
    records,
    unitBalance,
    calculation,
    deduction,
    setCalculation,
    setDeduction
  } = useOccupantStore();

  // SELECTED UNIT DATA FETCH
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

  if (!unitBalance) {
    toast.warning("Back to Rent & Unit for security reasons");
    router.back();
    return null;
  }

  const balance = unitBalance?.data?.map((record: any, index: any) => ({
    ...record,
    amount_paid: `₦${formatNumber(record.amount_paid) || 0}`,
    start_date: record.start_date
      ? dayjs(record.start_date).format("MMM D, YYYY").toLowerCase()
      : null,
    due_date: record.due_date
      ? dayjs(record.due_date).format("MMM D, YYYY").toLowerCase()
      : null,
    payment_date: record.payment_date
      ? dayjs(record.payment_date).format("MMM D, YYYY").toLowerCase()
      : null,
  })) || [];

  const startday = balance?.[0]?.start_date;
  const endDay = balance?.[0]?.due_date;
  const amt = balance?.[0]?.amount_paid;

  // Only calculate the balance if all values exist, otherwise default to 0
  const bal = startday && endDay && amt ? calculateBalance(amt, startday, endDay) : 0;
  const newUnitTotal = calculation ? Number(unit_data.newTenantTotalPrice) : Number(unit_data.renewalTenantTotalPrice);
  const totalPayable = !deduction ? newUnitTotal - bal : newUnitTotal;
  const prev_unit_bal = bal ? `${'₦'}${formatNumber(
    parseFloat(`${bal}`)
  )}` : undefined;

  const rentalData = getRentalData(propertyData);
  const propertySettingsData = getPropertySettingsData(propertyData);

  // FUNCTION TO SWITCH UNIT
  const handleSwitchUnit = async () => {
    const id = balance[0].id;
    const data = {
      new_unit_id: selectedUnitId,
      calculation: calculation ? 1 : 0,
      deduction: deduction ? 1 : 0,
      payment_date: startDate,
    };
    console.log("payload", data)
    try {
      setReqLoading(true);
      const res = await switchUnit(id as string, objectToFormData(data));
      if (res) {
        setModalIsOpen(true);
        toast.success("Record Added Successfully");
        router.push("/management/rent-unit");
      }
    } catch (err) {
      toast.error("Failed to switch Unit, please try again");
    } finally {
      setReqLoading(false);
    }
  }

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
        <PreviousUnitBalance
          isRental={isRental}
          items={balance as RentPreviousRecords[]}
          total={`${bal}`}
        />
        <div className="pt-6 lg:flex lg:gap-10 space-y-8">
          <div className="lg:w-3/5 space-y-8">
            <NewUnitCost
              isRental={isRental}
              feeDetails={[
                {
                  name: isRental ? "Rent" : "Fee",
                  amount: calculation ? (unit_data.newTenantPrice as any) : (unit_data.renewalTenantPrice),
                },
                {
                  name: "Service Charge",
                  amount: calculation ? (unit_data.service_charge) : (unit_data.renew_service_charge)
                },
                {
                  name: "Other Charges",
                  amount: (unit_data?.other_charge)
                },
              ]}
              total={newUnitTotal}
              id={unit_data?.id}
            />

            <NewUnitCost
              title="Payable Cost"
              noEdit
              isRental={isRental}
              feeDetails={[
                {
                  name: "Previous Unit",
                  amount: (prev_unit_bal as any),
                  // amount: calculation ? (unit_data.newTenantPrice as any) : (unit_data.renewalTenantPrice),
                },
                {
                  name: "Current Unit",
                  amount: (unit_data.newTenantPrice as any),
                  // amount: calculation ? (unit_data.service_charge) : (unit_data.renew_service_charge)
                },
                { name: "Other Charges", amount: (unit_data.other_charge) },
              ]}
              total={totalPayable}
              calculation={calculation}
            />
            <StartRent
              isRental={isRental}
              rentPeriod="yearly"
              title={`Start ${isRental ? "Rent" : "Counting"}`}
              start
              setStart_Date={setStartDate}
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
          previous_records={unitBalance && unitBalance as any}
          isRental={isRental}
          unit_id={selectedUnitId}
          noRefetch={true}
        />
      </section>

      <FixedFooter className="flex items-center justify-end">
        {/* <ModalTrigger asChild> */}
        <Button
          size="base_medium"
          className="py-2 px-6"
          disabled={reqLoading}
          onClick={handleSwitchUnit}>
          {reqLoading ? "Please wait..." : "Proceed"}
        </Button>
        {/* </ModalTrigger> */}
        <Modal
          state={{ isOpen: modalIsOpen, setIsOpen: setModalIsOpen }}
        >
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
        </Modal>
      </FixedFooter>
    </div>
  );
};

export default PostProceedContent;
