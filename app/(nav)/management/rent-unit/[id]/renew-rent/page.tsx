"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import dayjs, { Dayjs } from "dayjs";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { useOccupantStore } from "@/hooks/occupant-store";
import { startRent } from "../start-rent/data";
import { editRent } from "../edit-rent/data";
import {
  initData,
  initDataProps,
  singleUnitApiResponse,
  transformUnitData,
} from "../../data";
import { MatchedProfile } from "@/components/Management/Rent And Unit/matched-profile";
import { AddPartPayment } from "@/components/Management/Rent And Unit/Edit-Rent/Edit-rent-sections";
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import {
  Currency,
  currencySymbols,
  formatNumber,
} from "@/utils/number-formatter";
import {
  CheckBoxOptions,
  defaultChecks,
  estateData,
  estateSettingsDta,
} from "@/components/Management/Rent And Unit/data";
import { getPropertySettingsData, getRentalData } from "./data";
import { RenewRentContext } from "@/utils/renew-rent-context";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import RenewalRentDetails from "@/components/Management/Rent And Unit/renew-rent/renewal-rent-details";
import RenewalFee from "@/components/Management/Rent And Unit/renew-rent/renewal-fee";
import OwingFee from "@/components/Management/Rent And Unit/renew-rent/owing-fee";
import { RenewalRent } from "@/components/Management/Rent And Unit/renew-rent/renewal-rent";
import PreviousRentRecords from "@/components/Management/Rent And Unit/renew-rent/previous-rent";

const RenewRent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const isRental = propertyType === "rental";

  // Zustand store
  const { setOccupant, occupant, setUnitBalance, unitBalance } =
    useOccupantStore();

  // State
  const [unitData, setUnitData] = useState<initDataProps>(initData);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [amt, setAmt] = useState("");
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] =
    useState<CheckBoxOptions>(defaultChecks);
  const [isUpfrontPaymentChecked, setIsUpfrontPaymentChecked] = useState(true);
  const [reqLoading, setReqLoading] = useState(false);

  // API fetch
  const endpoint = `/unit/${id}/view`;
  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<singleUnitApiResponse>(endpoint);
  useRefetchOnEvent("refetchUnit", () => refetch({ silent: true }));

  // Transform API data
  useEffect(() => {
    if (apiData) {
      const transformedData = transformUnitData(apiData);
      setUnitData((prev: any) => ({ ...prev, ...transformedData }));
      if (transformedData.occupant) {
        setOccupant(transformedData.occupant);
      }
      if (transformedData.previous_records) {
        setUnitBalance(transformedData.previous_records);
      }
    }
  }, [apiData, setOccupant, setUnitBalance]);

  // Derived data
  const propertyId = unitData.propertyId;
  const previousRecord = (unitData?.previous_records as any)?.data?.[0];
  const start_date = previousRecord?.start_date
    ? dayjs(previousRecord.start_date).format("DD/MM/YYYY")
    : "__,__,___";
  const due_date = previousRecord?.due_date
    ? dayjs(previousRecord.due_date).format("DD/MM/YYYY")
    : "___,___,___";
  const propertySettingsData = getPropertySettingsData(unitData);
  const rentalData = getRentalData(unitData);
  const currency = unitData.currency as Currency;

  // Handlers
  const handleRenewRent = async () => {
    if (!unitData?.unit_id || !unitData?.occupant?.id) {
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
    if (dueDate && dueDate.isBefore(dayjs(startDate), "day")) {
      toast.warning("Due date cannot be before the start date.");
      return;
    }
    const payload = {
      unit_id: unitData.unit_id,
      tenant_id: unitData.occupant.id,
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
      }
    } catch (err) {
      toast.error("Failed to renew rent");
    } finally {
      setReqLoading(false);
    }
  };

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
      tenant_id: unitData.occupant.id,
      type: "part_payment",
    };
    try {
      setReqLoading(true);
      const success = await editRent(payload);
      if (success) {
        toast.success("Part payment added successfully");
        window.dispatchEvent(new Event("refetchUnit"));
        setStartDate(null);
        setAmt("");
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
    <RenewRentContext.Provider
      value={{
        unitData,
        startDate,
        dueDate,
        amt,
        selectedCheckboxOptions,
        isUpfrontPaymentChecked,
        reqLoading,
        isRental,
        currency,
        propertySettingsData,
        rentalData,
        start_date,
        due_date,
      }}
    >
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
              <RenewalRentDetails />
              <RenewalFee
                setIsUpfrontPaymentChecked={setIsUpfrontPaymentChecked}
              />
              <OwingFee />
              <RenewalRent
                setStartDate={setStartDate}
                setDueDate={setDueDate}
                setSelectedCheckboxOptions={setSelectedCheckboxOptions}
              />
              <AddPartPayment
                isRental={isRental}
                currency={currency || "naira"}
                setStart_Date={(date: string | null) =>
                  date ? setStartDate(dayjs(date)) : setStartDate(null)
                }
                noBtn
                loading={reqLoading}
                setAmt={setAmt}
                setIsUpfrontPaymentChecked={setIsUpfrontPaymentChecked}
                isUpfrontPaymentChecked={isUpfrontPaymentChecked}
              />
            </div>
            <div className="lg:flex-1 lg:!mt-[52px]">
              <MatchedProfile
                occupant={unitData?.occupant}
                title="User Profile"
              />
            </div>
          </div>
          <PreviousRentRecords />
        </section>
        <FixedFooter className="flex items-center justify-end">
          {isUpfrontPaymentChecked ? (
            <Button
              size="base_medium"
              className="py-2 px-6"
              disabled={reqLoading}
              onClick={handleRenewRent}
            >
              {reqLoading
                ? "Please wait..."
                : isRental
                ? "Renew Rent"
                : "Renew"}
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
    </RenewRentContext.Provider>
  );
};

export default RenewRent;
