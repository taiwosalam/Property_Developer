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
import {
  initData,
  initDataProps,
  singleUnitApiResponse,
  transformUnitData,
} from "../../data";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CardsLoading from "@/components/Loader/CardsLoading";
import NetworkError from "@/components/Error/NetworkError";
import { useOccupantStore } from "@/hooks/occupant-store";
import dayjs from "dayjs";
import {
  editRent,
  getEstateData,
  getEstateSettingsData,
  getPropertySettingsData,
  getRentalData,
} from "./data";
import { toast } from "sonner";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import ServerError from "@/components/Error/ServerError";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { FeeDetail } from "@/components/Management/Rent And Unit/types";

const EditRent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const isRental = propertyType === "rental";

  //STORE TO SAVE SELECTED OCCUPANT/TENANT
  const { setOccupant, occupant, setUnitBalance, unitBalance } =
    useOccupantStore();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [amt, setAmt] = useState("");
  const [reqLoading, setReqLoading] = useState(false);
  const [isUpfrontPaymentChecked, setIsUpfrontPaymentChecked] = useState(true);

  const [unit_data, setUnit_data] = useState<initDataProps>(initData);
  const endpoint = `/unit/${id}/view`;

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<singleUnitApiResponse>(endpoint);
  useRefetchOnEvent("refech-unit", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      const transformedData = transformUnitData(apiData);
      setUnit_data((x: any) => ({
        ...x,
        ...transformedData,
      }));

      if (transformedData.occupant) {
        setOccupant(transformedData.occupant); // Store occupant data in Zustand
      }
      if (transformedData.previous_records) {
        setUnitBalance(transformedData.previous_records); // Store balance data in Zustand
      }
    }
  }, [apiData, setOccupant, setUnitBalance]);

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  const record = (unit_data?.previous_records as any)?.data?.[0];
  const start_date = record?.start_date
    ? dayjs(record?.start_date).format("DD/MM/YYYY")
    : "__,__,__";
  const due_date = record?.due_date
    ? dayjs(record?.due_date).format("DD/MM/YYYY")
    : "__,__,__";
  const propertyId = unit_data.propertyId;

  const rentalData = getRentalData(unit_data);
  const estateData = getEstateData(unit_data);
  const propertySettingsData = getPropertySettingsData(unit_data);
  const estateSettingsDta = getEstateSettingsData(unit_data);

  // ADD UPFRONT RENT
  const handleUpfrontRent = async () => {
    if (!unitBalance || unitBalance.length === 0) {
      toast.error("No unit balance available");
      return;
    }
    const payload = {
      unit_id: id,
      amount: unit_data.renewalTenantTotalPrice,
      rent_id: unitBalance.data[0].id,
      payment_date: startDate,
      tenant_id: unit_data.occupant.id,
      type: "upfront_payment",
    };
    try {
      setReqLoading(true);
      const success = await editRent(payload);
      if (success) {
        toast.success("Upfront payment created successfully");
        window.dispatchEvent(new Event("refech-unit"));
      }
    } catch (err) {
      toast.error("Failed to create upfront payment");
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
              startDate={start_date}
              period={unit_data.fee_period}
              dueDate={due_date}
              rentFee={unit_data.newTenantPrice}
              unitData={unit_data}
            />

            <RenewalFee
              isRental={isRental}
              noEdit
              feeDetails={[
                {
                  name: isRental ? "Rent" : "Fee",
                  amount: isRental
                    ? unit_data.renewalTenantPrice
                    : unit_data.newTenantPrice,
                },
                {
                  name: "Service Charge",
                  amount: isRental
                    ? unit_data.renew_service_charge
                    : unit_data.service_charge,
                },
                {
                  name: isRental ? "Renew VAT Amount" : "VAT Amount",
                  amount: isRental
                    ? unit_data.renew_vat_amount
                    : unit_data.vat_amount,
                },
                {
                  name: "Security Fee",
                  amount: isRental
                    ? unit_data.security_fee
                    : unit_data.security_fee,
                },
                {
                  name: "Other Charges",
                  amount: isRental
                    ? unit_data.renew_other_charge
                    : unit_data.other_charge,
                },
              ].filter((fee) => fee.amount !== undefined && fee.amount !== "")}
              currency={unit_data.currency || "naira"}
              total_package={
                isRental
                  ? (unit_data.renewalTenantTotalPrice as any)
                  : unit_data.newTenantTotalPrice
              }
              id={propertyId as string}
            />

            <EditCurrentRent
              currency={unit_data.currency || "naira"}
              isRental={isRental}
              total={
                isRental
                  ? unit_data.renewalTenantTotalPrice
                  : unit_data.newTenantTotalPrice
              }
              setStart_Date={setStartDate}
              action={handleUpfrontRent}
              loading={reqLoading}
              setIsUpfrontPaymentChecked={setIsUpfrontPaymentChecked}
              isUpfrontPaymentChecked={isUpfrontPaymentChecked}
            />
            
            <AddPartPayment
              isRental={isRental}
              currency={unit_data.currency || "naira"}
              setStart_Date={setStartDate}
              action={handlePartPayment}
              loading={reqLoading}
              setAmt={setAmt}
              setIsUpfrontPaymentChecked={setIsUpfrontPaymentChecked}
              isUpfrontPaymentChecked={isUpfrontPaymentChecked}
            />
          </div>
          <div className="lg:flex-1 lg:!mt-[52px] space-y-8">
            <MatchedProfile
              occupant={unit_data.occupant}
              isLoading={loading}
              title={`${isRental ? "Tenant" : "Occupant"} Profile`}
            />
            <TransferTenants
              isRental={isRental}
              propertyId={Number(unit_data.propertyId)}
              unitId={Number(unit_data.id)}
            />
          </div>
        </div>
        <PreviousRentRecords
          isRental={isRental}
          previous_records={unit_data.previous_records as any}
          unit_id={id as string}
          currency={unit_data.currency || "naira"}
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
