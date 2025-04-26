"use client";

import {
  calculateBalance,
  RentPeriod,
  RentPreviousRecords,
} from "@/components/Management/Rent And Unit/data";
import {
  RenewalRent as StartRent,
  PreviousRentRecords,
  OwingFee,
  RenewalFee,
} from "@/components/Management/Rent And Unit/renewal-rent-detals";
import { MatchedProfile } from "@/components/Management/Rent And Unit/matched-profile";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent } from "@/components/Modal/modal";
import { useRouter, useSearchParams } from "next/navigation";
import ModalPreset from "@/components/Modal/modal-preset";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import { useOccupantStore } from "@/hooks/occupant-store";
import {
  initData,
  initDataProps,
  singleUnitApiResponse,
  transformUnitData,
} from "../../../data";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import {
  Currency,
  currencySymbols,
  formatNumber,
} from "@/utils/number-formatter";
import dayjs from "dayjs";
import {
  getEstateData,
  getEstateSettingsData,
  getPropertySettingsData,
  getRentalData,
  switchUnit,
} from "../data";
import { toast } from "sonner";
import {
  NewUnitCost,
  PreviousUnitBalance,
} from "@/components/Management/Rent And Unit/Edit-Rent/Edit-rent-sections";
import { calculateOverduePeriods } from "../../renew-rent/data";
import CardsLoading from "@/components/Loader/CardsLoading";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";

const ChangeUnitpage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("p");
  const selectedUnitId = searchParams.get("u");
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const isRental = propertyType === "rental";
  const router = useRouter();
  const [reqLoading, setReqLoading] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { occupant, unitBalance, calculation, deduction } = useOccupantStore();
  const [unit_data, setUnit_data] = useState<initDataProps>(initData);
  const endpoint = `/unit/${id}/view`;

  const {
    data: apiData,
    loading,
    isNetworkError,
    error,
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

  const currencySymbol =
    currencySymbols[unit_data.currency as keyof typeof currencySymbols] || "₦";

  if (!unitBalance) {
    toast.warning("Back to Rent Unit for security reasons");
    router.back();
    return null;
  }

  // Process unit balance records
  const balance = unitBalance?.data?.map((record: any) => ({
    ...record,
    amount_paid: `${currencySymbol}${formatNumber(record.amount_paid) || 0}`,
    start_date: record?.start_date
      ? dayjs(record?.start_date).format("MMM D, YYYY").toLowerCase()
      : null,
    due_date: record?.due_date
      ? dayjs(record?.due_date).format("MMM D, YYYY").toLowerCase()
      : null,
    payment_date: record?.payment_date
      ? dayjs(record?.payment_date).format("MMM D, YYYY").toLowerCase()
      : null,
  }));

  // PROPERTY SETTINGS DATA
  const propertySettingsData = getPropertySettingsData(unit_data);
  const rentalData = getRentalData(unit_data);
  const estateData = getEstateData(unit_data);
  const estateSettingsDta = getEstateSettingsData(unit_data);

  // Calculate outstanding balance and total cost
  const startday = balance?.[0]?.start_date;
  const endDay = balance?.[0]?.due_date;
  const amt = balance?.[0]?.amount_paid;
  // Calculate previous unit balance
  const outstandingBalance =
    startday && endDay && amt ? calculateBalance(amt, startday, endDay) : 0;

  // Determine base cost based on calculation flag
  const baseCost = calculation
    ? Number(unit_data.newTenantTotalPrice)
    : Number(unit_data.renewalTenantTotalPrice);

  // Calculate net owing amount
  // const netOwing = deduction ? baseCost - outstandingBalance : baseCost;
  const netOwing = deduction ? outstandingBalance - baseCost : baseCost;

  const due_date = balance?.[0]?.due_date
    ? dayjs(balance[0].due_date).format("DD/MM/YYYY")
    : "__,__,__";

  // Calculate overdue periods
  const period = unit_data.fee_period as RentPeriod;
  const overduePeriods =
    due_date !== "__,__,__" && period
      ? calculateOverduePeriods(due_date, period)
      : 0;

  // Format amounts for display
  const formattedOutstandingBalance = outstandingBalance
    ? `${currencySymbol}${formatNumber(Math.abs(outstandingBalance))}`
    : `${currencySymbol}0`;
  const formattedNetOwing = netOwing
    ? `${currencySymbol}${formatNumber(Math.abs(netOwing))}`
    : `${currencySymbol}0`;

  // Determine owing/refunded status
  const owingLabel = netOwing >= 0 ? "Amount Owed" : "Refund Due";

  // Common feeDetails for both OwingFee and RenewalFee
  const feeDetails = [
    {
      name: "Outstanding Balance",
      amount: formattedOutstandingBalance,
    },
    {
      name: owingLabel,
      amount: formattedNetOwing,
    },
  ];

  // Function to switch unit
  const handleSwitchUnit = async () => {
    if (!startDate) {
      toast.error("Please select a payment date.");
      return;
    }

    const id = balance[0].id;
    const data = {
      new_unit_id: selectedUnitId,
      calculation: calculation ? 1 : 0,
      deduction: deduction ? 1 : 0,
      payment_date: startDate,
    };

    try {
      setReqLoading(true);
      const res = await switchUnit(id as string, data);
      if (res) {
        setModalIsOpen(true);
        toast.success("Unit Switched Successfully");
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
        <CardsLoading length={10} />;
      </div>
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-6 pb-[100px]">
      <BackButton>Change Unit</BackButton>
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
          id={id as string}
          {...(isRental ? { gridThree: true } : {})}
        />

        <div className="pt-6 lg:flex lg:gap-10 space-y-8">
          <div className="lg:w-3/5 space-y-8">
            {/* PREVIOUS UNIT BREAKDOWN */}
            <PreviousUnitBalance
              calculation={calculation}
              period={unit_data.fee_period as RentPeriod}
              currency={unit_data.currency}
              deduction={deduction}
              isRental={isRental}
              items={balance as RentPreviousRecords[]}
              total={`${outstandingBalance}`}
            />

            {/* NEW UNIT COST */}
            <NewUnitCost
              noEdit
              isRental={isRental}
              feeDetails={[
                {
                  name: isRental ? "Rent" : "Fee",
                  amount: calculation
                    ? unit_data.newTenantPrice
                    : // : isRental
                      // ? unit_data.renewalTenantPrice
                      unit_data.renewalTenantPrice,
                },
                {
                  name: "Security Fee",
                  amount: calculation
                    ? unit_data.security_fee
                    : unit_data.security_fee,
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
                  name: "Service Charge",
                  amount: calculation
                    ? unit_data.service_charge
                    : // : isRental
                      // ? unit_data.renew_service_charge
                      unit_data.renew_service_charge,
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
              total={baseCost}
              calculation={calculation}
              currency={unit_data.currency}
            />

            {/* Owing/Refund Amount */}
            <OwingFee
              currency={unit_data.currency as Currency}
              isRental={isRental}
              isUpfrontPaymentChecked={true} // Always show owing/refunded amount
              feeDetails={[
                {
                  name: "Outstanding Balance",
                  amount: formattedOutstandingBalance,
                },
                {
                  name: owingLabel,
                  amount: formattedNetOwing,
                },
              ]}
              total_package={baseCost}
              id={id as string}
              dueDate={due_date}
              outstandingBalance={outstandingBalance} 
              calculation={calculation} 
              deduction={deduction} 
            />

            {/* Outstanding Details */}
            {overduePeriods > 0 ? (
              <OwingFee
                currency={unit_data.currency as Currency}
                isRental={isRental}
                isUpfrontPaymentChecked={true}
                feeDetails={feeDetails}
                total_package={baseCost}
                id={id as string}
                dueDate={due_date}
                period={period}
                outstandingBalance={outstandingBalance}
                calculation={calculation}
                deduction={deduction}
              />
            ) : (
              <RenewalFee
                title="Payable Package"
                isRental={isRental}
                feeDetails={feeDetails}
                total_package={netOwing >= 0 ? netOwing : 0}
                id={id as string}
                currency={unit_data.currency as Currency}
                noEdit
                dueDate={due_date}
                period={period} 
                outstandingBalance={outstandingBalance} 
                calculation={calculation} 
                deduction={deduction} 
                showCalculation
              />
            )}

            <StartRent
              isRental={isRental}
              rentPeriod={unit_data.fee_period as RentPeriod}
              title={`Start ${isRental ? "Rent" : "Fee"}`}
              start
              setStart_Date={setStartDate}
            />
          </div>
          <div className="lg:flex-1 lg:!mt-[52px]">
            <MatchedProfile occupant={occupant} title="User Profile" />
          </div>
        </div>
        <PreviousRentRecords
          isRental={isRental}
          unit_id={id as string}
          previous_records={unitBalance as any}
          noRefetch={true}
        />
      </section>

      <FixedFooter className="flex items-center justify-end">
        <Button
          size="base_medium"
          className="py-2 px-6"
          disabled={reqLoading}
          onClick={handleSwitchUnit}
        >
          {reqLoading ? "Please wait..." : "Proceed"}
        </Button>
        <Modal state={{ isOpen: modalIsOpen, setIsOpen: setModalIsOpen }}>
          <ModalContent>
            <ModalPreset type="success" className="w-full">
              <div className="flex flex-col gap-8">
                <p className="text-text-tertiary text-sm">
                  Unit Switched Successfully
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

export default ChangeUnitpage;
