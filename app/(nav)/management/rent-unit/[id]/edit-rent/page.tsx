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
import { useOccupantStore } from "@/hooks/occupant-store";
import dayjs from "dayjs";
import { editRent, getPropertySettingsData, getRentalData } from "./data";
import { toast } from "sonner";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

const EditRent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const isRental = propertyType === "rental";

  //STORE TO SAVE SELECTED OCCUPANT/TENANT 
  const { setOccupant, occupant, setUnitBalance, unitBalance } = useOccupantStore();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [amt, setAmt] = useState('');
  const [reqLoading, setReqLoading] = useState(false);

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

  if (loading)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
      </div>
    );

  if (isNetworkError) return <NetworkError />;

  if (error) return <div>{error}</div>;

  const record = (unit_data?.previous_records as any)?.data?.[0];
  const start_date = record?.start_date ? dayjs(record?.start_date).format("DD/MM/YYYY") : "__,__,__";
  const due_date = record?.due_date ? dayjs(record?.due_date).format("DD/MM/YYYY") : "__,__,__";
  const propertyId = unit_data.propertyId;

  const rentalData = getRentalData(unit_data);
  const propertySettingsData = getPropertySettingsData(unit_data);

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

    // console.log("Payload", payload);
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
        amount: amt,
        rent_id: unitBalance.data[0].id,
        payment_date: startDate,
        tenant_id: unit_data.occupant.id,
        type: "part_payment",
      };

      // console.log("Payload", payload);
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
              otherFee={unit_data.other_charge as string}
            />
            <RenewalFee
              isRental={isRental}
              feeDetails={[
                {
                  name: isRental ? "Rent" : "Fee",
                  amount: (unit_data.renewalTenantPrice as any),
                },
                { name: "Service Charge", amount: (unit_data.renew_service_charge as any) },
                { name: "Other Charges", amount: (unit_data.renew_other_charge as any) },
              ]}
              total_package={(unit_data.renewalTenantTotalPrice as any)}
              id={propertyId as string}
            />
            <EditCurrentRent
              isRental={isRental}
              total={unit_data.renewalTenantTotalPrice}
              setStart_Date={setStartDate}
              action={handleUpfrontRent}
              loading={reqLoading}
            />
            <AddPartPayment
              setStart_Date={setStartDate}
              action={handlePartPayment}
              loading={reqLoading}
              setAmt={setAmt}
            />
          </div>
          <div className="lg:flex-1 lg:!mt-[52px] space-y-8">
            <MatchedProfile
              occupant={unit_data.occupant}
              title={`${isRental ? "Tenant" : "Occupant"} Profile`}
            />
            <TransferTenants isRental={isRental} propertyId={Number(unit_data.propertyId)} />
          </div>
        </div>
        <PreviousRentRecords
          isRental={isRental}
          previous_records={unit_data.previous_records as any}
          unit_id={id as string}
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
