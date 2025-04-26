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
  getEstateData,
  getEstateSettingsDta,
  RentPeriod,
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
import {
  formatFee,
  initData,
  initDataProps,
  singleUnitApiResponse,
  transformUnitData,
} from "@/app/(nav)/management/rent-unit/data";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import dayjs from "dayjs";
import { formatNumber } from "@/utils/number-formatter";
import { toast } from "sonner";
import { getPropertySettingsData, getRentalData } from "./data";
import { switchUnit } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import CardsLoading from "@/components/Loader/CardsLoading";
import { useGlobalStore } from "@/store/general-store";

const PostProceedContent = ({
  selectedUnitId,
  page,
}: {
  selectedUnitId?: string;
  page?: "unit" | "property";
}) => {
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
  } = useOccupantStore();
  const currentUnit = useGlobalStore((s) => s.currentUnit);
  const currentRentStats = useGlobalStore((s) => s.currentRentStats);
  const oustandingObj = currentRentStats?.oustandingObj || [];

  const isUnit = page === "unit";
  // console.log("currentRentStats", currentRentStats);

  // SELECTED UNIT DATA FETCH
  const [unit_data, setUnit_data] = useState<initDataProps>(initData);
  const endpoint = `/unit/${selectedUnitId}/view`;
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

  const balance =
    unitBalance?.data?.map((record: any, index: any) => ({
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
  const bal =
    startday && endDay && amt ? calculateBalance(amt, startday, endDay) : 0;
  const newUnitTotal = calculation
    ? Number(unit_data.newTenantTotalPrice)
    : Number(unit_data.renewalTenantTotalPrice);
  const newUnitTotalFormatted = calculation
    ? formatFee(unit_data.newTenantTotalPrice, unit_data.currency || "naira")
    : formatFee(
        unit_data.renewalTenantTotalPrice,
        unit_data.currency || "naira"
      );
  // const totalPayable = !deduction ? newUnitTotal - bal : newUnitTotal;
  const totalPayable = deduction ? newUnitTotal - bal : newUnitTotal;
  const prev_unit_bal = bal
    ? `${"₦"}${formatNumber(parseFloat(`${bal}`))}`
    : undefined;
  const refundAmount = totalPayable < 0 ? Math.abs(totalPayable) : 0;

  // Calculate excess or refund amount for the third card
  const isExcess = newUnitTotal < totalPayable;
  const balanceAmount = isExcess
    ? totalPayable - newUnitTotal
    : Math.abs(totalPayable);
  const balanceLabel = isExcess ? "Client Excess" : "Refund Client";
  const showBalanceCard = totalPayable < 0 || isExcess;

  // CURRENT UNIT AMOUNT
  const currentUnitAmt = formatFee(newUnitTotal, unit_data.currency || "naira");

  // GET PROPERTY DATA
  const rentalData = getRentalData(isUnit ? currentUnit : propertyData);
  const propertySettingsData = getPropertySettingsData(
    isUnit ? currentUnit : propertyData
  );
  const estateData = getEstateData(isUnit ? currentUnit : propertyData);
  const estateSettingsDta = getEstateSettingsDta(
    isUnit ? currentUnit : propertyData
  );

  const deductionsLabeCal = [
    {
      label: calculation ? "New Tenant Package" : "Renewal Total Package",
      value: newUnitTotalFormatted,
    },
    ...oustandingObj,
    {
      label: deduction ? "Do Deduction" : "No Deduction",
      value: formatFee(totalPayable, unit_data.currency || "naira"),
    },
  ];

  const deductionsLabeRes = [
    {
      label: calculation ? "New Tenant Package" : "Renewal Total Package",
      value: newUnitTotalFormatted,
    },
    ...oustandingObj,
    {
      label: deduction ? "Do Deduction" : "No Deduction",
      value: formatFee(totalPayable, unit_data.currency || "naira"),
    },
  ];

  // FUNCTION TO SWITCH UNIT
  const handleSwitchUnit = async () => {
    const id = balance[0].id;
    const data = {
      new_unit_id: selectedUnitId,
      calculation: calculation ? 1 : 0,
      deduction: deduction ? 1 : 0,
      payment_date: startDate,
    };
    console.log("payload", data);
    try {
      setReqLoading(true);
      const res = await switchUnit(id as string, objectToFormData(data));
      if (res) {
        setModalIsOpen(true);
        toast.success("Unit Switched Successfully");
        router.push("/management/rent-unit");
      }
    } catch (err) {
      toast.error("Failed to switch Unit, please try again");
    } finally {
      setReqLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col gap-5">
        <CardsLoading length={6} />;
      </div>
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-6 pb-[100px]">
      <BackButton>
        {page === "unit" ? "Change Unit" : "Change Property Unit"}
      </BackButton>
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
          page={page}
          isRental={isRental}
          deduction={deduction}
          calculation={calculation}
          items={balance as RentPreviousRecords[]}
          total={`${bal}`}
          currentUnit={currentUnit}
          startDate={startday}
          dueDate={endDay}
        />
        <div className="pt-6 lg:flex lg:gap-10 space-y-8">
          <div className="lg:w-3/5 space-y-8">
            <NewUnitCost
              isRental={isRental}
              noEdit
              currency={unit_data.currency}
              feeDetails={[
                {
                  name: isRental ? `${unit_data.fee_period} Rent` : "Fee",
                  amount: calculation
                    ? (unit_data.newTenantPrice as any)
                    : unit_data.renewalTenantPrice,
                },
                {
                  name: "Service Charge",
                  amount: calculation
                    ? unit_data.service_charge
                    : unit_data.renew_service_charge,
                },
                {
                  name: "Security Fee",
                  amount: calculation ? unit_data.security_fee : "",
                },
                {
                  name: "Agency Fee",
                  amount: calculation ? unit_data.unitAgentFee : "",
                },
                {
                  name: "Caution Fee",
                  amount: calculation ? unit_data.caution_fee : "",
                },
                {
                  name: "VAT Amount",
                  amount: calculation
                    ? unit_data.vat_amount
                    : unit_data.renew_vat_amount,
                },
                {
                  name: "Other Charges",
                  amount: calculation
                    ? unit_data.other_charge
                    : unit_data.renew_other_charge,
                },
              ]}
              total={newUnitTotal}
              id={unit_data?.id}
              calculation={calculation}
              deduction={deduction}
            />

            <PreviousUnitBalance
              currentUnit={currentUnit}
              title="Calculations"
              isRental={isRental}
              workings
              deduction={deduction}
              calculation={calculation}
              deductionsCal={deductionsLabeCal}
              deductionsRes={deductionsLabeRes}
              items={balance as RentPreviousRecords[]}
              total={`${bal}`}
            />

            <NewUnitCost
              title="Payable Cost"
              noEdit
              isRental={isRental}
              feeDetails={[
                {
                  name: "Previous Unit",
                  amount: prev_unit_bal as any,
                },
                {
                  name: "Current Unit",
                  amount: currentUnitAmt,
                },
                { name: "Other Charges", amount: unit_data.other_charge },
              ]}
              total={totalPayable < 0 ? 0 : totalPayable}
              calculation={calculation}
            />

            {showBalanceCard && (
              <NewUnitCost
                title="Balance After Deduction"
                isExcess
                noEdit
                deduction={deduction}
                isRental={isRental}
                feeDetails={[
                  {
                    name: balanceLabel,
                    amount: `₦${formatNumber(balanceAmount)}`,
                  },
                ]}
                total={balanceAmount}
                calculation={calculation}
              />
            )}

            <StartRent
              isRental={isRental}
              rentPeriod="yearly"
              title={`Start ${isRental ? "Rent" : "Counting"}`}
              start
              setStart_Date={setStartDate}
            />
          </div>
          <div className="lg:flex-1 lg:!mt-[52px]">
            <MatchedProfile occupant={occupant} title="User Profile" />
          </div>
        </div>
        <PreviousRentRecords
          previous_records={unitBalance && (unitBalance as any)}
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
          onClick={handleSwitchUnit}
        >
          {reqLoading ? "Please wait..." : "Proceed"}
        </Button>
        {/* </ModalTrigger> */}
        <Modal state={{ isOpen: modalIsOpen, setIsOpen: setModalIsOpen }}>
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
