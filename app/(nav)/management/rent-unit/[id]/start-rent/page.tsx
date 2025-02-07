"use client";

import Button from "@/components/Form/Button/button";
import {
  estateSettingsDta,
  estateData,
  propertySettingsData,
  rentalData,
  RentPeriod,
  CheckBoxOptions,
  defaultChecks,
} from "@/components/Management/Rent And Unit/data";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import { OccupantProfile } from "@/components/Management/Rent And Unit/occupant-profile";
import BackButton from "@/components/BackButton/back-button";
import { useParams, useSearchParams } from "next/navigation";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useEffect, useState } from "react";
import {
  initData,
  initDataProps,
  initialSingleData,
  InitialSingleUnit,
  InitialSingleUnitProps,
  singleUnitApiResponse,
  transformSingleUnitData,
  transformUnitData,
  UnitDetails
} from "../../data";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import { initialTenants, startRent, Tenant, TenantResponse, transformUnitsTenants } from "./data";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";

const StartRent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const isRental = propertyType === "rental";

  const [unit_data, setUnit_data] = useState<initDataProps>(initData);
  const [tenants_data, setTenants_data] = useState<Tenant[]>(initialTenants);
  const [selectedTenantId, setSelectedTenantId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<CheckBoxOptions>(defaultChecks)
  const [reqLoading, setReqLoading] = useState(false)

  const endpoint = `/unit/${id}/view`
  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<singleUnitApiResponse>(endpoint);

  const {
    data: allTenantData,
    loading: allTenantsLoading,
    // silentLoading,
    // isNetworkError,
    error: allTenantsError,
    refetch: refetchTenants,
  } = useFetch<TenantResponse>("/all-tenants");

  useEffect(() => {
    if (apiData) {
      setUnit_data((x: any) => ({
        ...x,
        ...transformUnitData(apiData)
      }))
    }
  }, [apiData])

  useEffect(() => {
    if (allTenantData) {
      const transformedTenants = transformUnitsTenants(allTenantData);
      setTenants_data(transformedTenants);
    }
  }, [allTenantData])


  const handleStartRent = async () => {
    // Validate that all required fields are available
    if (!unit_data?.unit_id || !selectedTenantId) {
      toast.error("Missing required information: unit or tenant not selected.");
      return;
    }

    if (!selectedCheckboxOptions) {
      toast.error("Notification preferences not set.");
      return;
    }

    const payload = {
      unit_id: unit_data.unit_id,
      tenant_id: selectedTenantId,
      start_date: startDate,
      payment_type: "full",
      rent_type: "new",
      // mobile_notification: selectedCheckboxOptions.mobile_notification,
      // email_alert: selectedCheckboxOptions.email_alert,
      // has_invoice: selectedCheckboxOptions.create_invoice,
      mobile_notification: selectedCheckboxOptions.mobile_notification ? 1 : 0,
      email_alert: selectedCheckboxOptions.email_alert ? 1 : 0,
      has_invoice: selectedCheckboxOptions.create_invoice ? 1 : 0,
      // sms_alert: selectedCheckboxOptions.sms_alert, //TODO - uncomment after backend added it 
    };
    try {
      setReqLoading(true);
      const res = await startRent(payload);
      // const res = await startRent(objectToFormData(payload));

      if (res) {
        toast.success("Rent Started Successfully");
      }
    } catch (err) {
      toast.error("Failed to start Rent");
    } finally {
      setReqLoading(false);
    }
  };



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
      <BackButton>Start {isRental ? "Rent" : "Counting"}</BackButton>
      <section className="space-y-6">
        <EstateDetails
          title={`${isRental ? "Unit" : "Facility"} Details`}
          estateData={isRental ? rentalData : estateData}
        />
        <EstateSettings
          id={propertyId as string}
          title={`${isRental ? "Property" : "Facility"} Settings`}
          estateSettingsDta={
            isRental ? propertySettingsData : estateSettingsDta
          }
          {...(isRental ? { gridThree: true } : {})}
        />
        <OccupantProfile
          isRental={isRental}
          occupants={tenants_data.map((tenant) => ({
            name: tenant.name,
            id: tenant.id,
          }))}
          period={unit_data?.fee_period as RentPeriod}
          setStart_date={setStartDate}
          setSelectedTenantId={setSelectedTenantId} //Try better way aside drilling prop later
          setSelectedCheckboxOptions={setSelectedCheckboxOptions} //Try better way aside drilling prop later
          feeDetails={[
            { name: isRental ? "Annual Rent" : "Annual Fee", amount: Number(unit_data.newTenantPrice) },
            { name: "Service Charge", amount: Number(unit_data.service_charge) },
            { name: "Caution Fee", amount: Number(unit_data.caution_fee) },
            { name: "Security Fee", amount: Number(unit_data.security_fee) },
            { name: "Agency Fee", amount: Number(unit_data.unitAgentFee) },
            { name: "Other Charges", amount: Number(unit_data.other_charge) },
          ]}
          total_package={Number(unit_data.total_package)}
          loading={loading}
          id={propertyId as string}
        />
      </section>
      {/* <FixedFooter className={`flex justify-${isRental ? "between" : "end"}`}> */}
      <FixedFooter className={`flex justify-end gap-4`}>
        {isRental && (
          <Button size="base_medium" className="py-2 px-6">
            Download Agreement
          </Button>
        )}
        <Button
          size="base_medium"
          className="py-2 px-6"
          disabled={reqLoading}
          onClick={handleStartRent}
        >
          {reqLoading ? "Please wait..." : "Start Rent"}
        </Button>
      </FixedFooter>
    </div>
  );
};

export default StartRent;
