"use client";
import {
  estateSettingsDta,
  propertySettingsData,
  estateData,
  rentalData,
  RentPeriod,
  CheckBoxOptions,
  defaultChecks,
} from "@/components/Management/Rent And Unit/data";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import {
  RenewalRentDetails,
  RenewalFee,
  RenewalRent,
  PreviousRentRecords,
  OwingFee,
} from "@/components/Management/Rent And Unit/renewal-rent-detals";
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import { useSearchParams } from "next/navigation";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { MatchedProfile } from "@/components/Management/Rent And Unit/matched-profile";
import { DUMMY_OCCUPANT } from "@/components/Management/Rent And Unit/data";
import {
  initData,
  initDataProps,
  singleUnitApiResponse,
  transformUnitData,
} from "../../data";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import { getPropertySettingsData, getRentalData } from "./data";
import dayjs, { Dayjs } from "dayjs";
import ServerError from "@/components/Error/ServerError";
import {
  Currency,
  currencySymbols,
  formatNumber,
} from "@/utils/number-formatter";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { toast } from "sonner";
import { startRent } from "../start-rent/data";
import { AddPartPayment } from "@/components/Management/Rent And Unit/Edit-Rent/Edit-rent-sections";
import { editRent } from "../edit-rent/data";
import { useOccupantStore } from "@/hooks/occupant-store";

const RenewRent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  //STORE TO SAVE SELECTED OCCUPANT/TENANT
  const { setOccupant, occupant, setUnitBalance, unitBalance } =
  useOccupantStore();
  const propertyType = searchParams.get("type") as "rental" | "facility"; //would be gotten from API
  const isRental = propertyType === "rental";
  const [unit_data, setUnit_data] = useState<initDataProps>(initData);
  // const [start_Date, set_Start_Date] = useState<string>("");
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] =
    useState<CheckBoxOptions>(defaultChecks);
  const [reqLoading, setReqLoading] = useState(false);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [start_Date, set_Start_Date] = useState<string | null>(null);
  const [amt, setAmt] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [isUpfrontPaymentChecked, setIsUpfrontPaymentChecked] = useState(true);
  const endpoint = `/unit/${id}/view`;

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
        ...transformUnitData(apiData),
      }));
      if (transformedData.occupant) {
        setOccupant(transformedData.occupant); // Store occupant data in Zustand
      }
      if (transformedData.previous_records) {
        setUnitBalance(transformedData.previous_records); // Store balance data in Zustand
      }
    }
  }, [apiData]);

  const propertyId = unit_data.propertyId;
  const record = (unit_data?.previous_records as any)?.data?.[0];
  const start_date = record?.start_date
    ? dayjs(record?.start_date).format("DD/MM/YYYY")
    : "__,__,___";
  const due_date = record?.due_date
    ? dayjs(record?.due_date).format("DD/MM/YYYY")
    : "___,___,___";
  const propertySettingsData = getPropertySettingsData(unit_data);
  const rentalData = getRentalData(unit_data);

  const handleRenewRent = async () => {
    if (!unit_data?.unit_id || !unit_data?.occupant?.id) {
      toast.error("Missing required information: unit or occupant not found.");
      return;
    }
    if (!selectedCheckboxOptions) {
      toast.error("Notification preferences not set.");
      return;
    }
    if (!startDate) {
      toast.error("Start date is required.");
      return;
    }
    // Validate dueDate
    if (dueDate && dueDate.isBefore(dayjs(startDate), "day")) {
      toast.warning("Due date cannot be before the start date.");
      return;
    }
    const payload = {
      unit_id: unit_data.unit_id,
      tenant_id: unit_data.occupant.id,
      start_date: startDate,
      payment_type: "full",
      rent_type: "renew",
      mobile_notification: selectedCheckboxOptions.mobile_notification ? 1 : 0,
      email_alert: selectedCheckboxOptions.email_alert ? 1 : 0,
      has_invoice: selectedCheckboxOptions.create_invoice ? 1 : 0,
    };
    try {
      setReqLoading(true);
      const res = await startRent(payload);
      if (res) {
        toast.success("Rent Renewed Successfully");
        // router.back();
      }
    } catch (err) {
      toast.error("Failed to renew rent");
    } finally {
      setReqLoading(false);
    }
  };

  // ADD PART PAYMENT
  const handlePartPayment = async () => {
    if (!unitBalance || unitBalance.length === 0) {
      toast.error("No unit balance available");
      return;
    }
    const payload = {
      unit_id: id,
      amount: parseFloat(amt),
      rent_id: unitBalance.data[0].id,
      payment_date: startDate,
      tenant_id: unit_data.occupant.id,
      type: "part_payment",
    };
    try {
      setReqLoading(true);
      const success = await editRent(payload);
      if (success) {
        toast.success("Part payment added successfully");
        window.dispatchEvent(new Event("refech-unit"));
      }
    } catch (err) {
      toast.error("Failed to create part payment");
    } finally {
      setReqLoading(false);
    }
  };

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

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
              rentFee={unit_data.renewalTenantPrice}
              otherFee={unit_data.other_charge as string}
              totalPackage={
                unit_data?.newTenantTotalPrice?.toString() || "0"
                  ? `${
                      currencySymbols[
                        unit_data.currency as keyof typeof currencySymbols
                      ] || "₦"
                    }${formatNumber(
                      parseFloat(
                        unit_data?.newTenantTotalPrice?.toString() ?? "0"
                      )
                    )}`
                  : ""
              }
            />

            <RenewalFee
              currency={unit_data.currency as Currency}
              isRental={isRental}
              period={(unit_data.fee_period as RentPeriod) ?? "yearly"}
              feeDetails={[
                {
                  name: isRental ? "Rent" : "Fee",
                  amount: unit_data.renewalTenantPrice as any,
                },
                {
                  name: "Service Charge",
                  amount: unit_data.renew_service_charge as any,
                },
                {
                  name: "Other Charges",
                  amount: unit_data.renew_other_charge as any,
                },
                {
                  name: "VAT Amount",
                  amount: unit_data.renew_vat_amount as any,
                },
              ]}
              total_package={Number(unit_data.renewalTenantTotalPrice)}
              id={propertyId as string}
              setIsUpfrontPaymentChecked={setIsUpfrontPaymentChecked}
              isUpfrontPaymentChecked={isUpfrontPaymentChecked}
            />

            <OwingFee
              currency={unit_data.currency as Currency}
              isRental={isRental}
              dueDate={due_date}
              period={(unit_data.fee_period as RentPeriod) ?? "yearly"}
              feeDetails={[
                {
                  name: isRental
                    ? "Renewal Total Package"
                    : "Renewal Total Fee",
                  amount:
                    unit_data?.renewalTenantTotalPrice?.toString() || "0"
                      ? `${
                          currencySymbols[
                            unit_data.currency as keyof typeof currencySymbols
                          ] || "₦"
                        }${formatNumber(
                          parseFloat(
                            unit_data?.renewalTenantTotalPrice?.toString() ??
                              "0"
                          )
                        )}`
                      : "",
                },
              ]}
              total_package={Number(unit_data.renewalTenantTotalPrice)}
              id={propertyId as string}
              isUpfrontPaymentChecked={isUpfrontPaymentChecked}
            />

            <RenewalRent
              allowStartDateInput={false}
              isRental={isRental}
              due_date={dayjs(due_date, "DD/MM/YYYY")}
              rentPeriod={(unit_data.fee_period as RentPeriod) ?? "yearly"}
              setStart_Date={(date: string | null) =>
                date ? setStartDate(dayjs(date)) : setStartDate(null)
              }
              setDueDate={setDueDate}
              occupant={unit_data?.occupant}
              setSelectedCheckboxOptions={setSelectedCheckboxOptions}
            />

            <AddPartPayment
              isRental={isRental}
              currency={unit_data.currency || "naira"}
              setStart_Date={set_Start_Date}
              noBtn
              loading={reqLoading}
              setAmt={setAmt}
              setIsUpfrontPaymentChecked={setIsUpfrontPaymentChecked}
              isUpfrontPaymentChecked={isUpfrontPaymentChecked}
            />
          </div>
          <div className="lg:flex-1 lg:!mt-[52px]">
            <MatchedProfile
              occupant={unit_data?.occupant}
              title="User Profile"
            />
          </div>
        </div>
        <PreviousRentRecords
          currency={unit_data.currency as Currency}
          isRental={isRental}
          unit_id={id as string}
          previous_records={unit_data.previous_records as any}
        />
      </section>
      <FixedFooter className="flex items-center justify-end">
        {isUpfrontPaymentChecked ? (
          <Button
            size="base_medium"
            className="py-2 px-6"
            disabled={reqLoading}
            onClick={handleRenewRent}
          >
            {reqLoading ? "Please wait..." : isRental ? "Renew Rent" : "Renew"}
          </Button>
        ) : (
          <Button
            size="base_medium"
            className="py-2 px-6"
            disabled={reqLoading}
            onClick={handlePartPayment}
          >
            {reqLoading ? "Please wait..." : "Update"}
          </Button>
        )}
      </FixedFooter>
    </div>
  );
};

export default RenewRent;
