"use client";

import Button from "@/components/Form/Button/button";
import {
  RentPeriod,
  CheckBoxOptions,
  defaultChecks,
} from "@/components/Management/Rent And Unit/data";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import { OccupantProfile } from "@/components/Management/Rent And Unit/occupant-profile";
import BackButton from "@/components/BackButton/back-button";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useEffect, useState } from "react";
import {
  initData,
  initDataProps,
  singleUnitApiResponse,
  transformSingleUnitData,
  transformUnitData,
  UnitDetails,
} from "../../data";
import useFetch from "@/hooks/useFetch";
import NetworkError from "@/components/Error/NetworkError";
import {
  getEstateData,
  getEstateSettingsData,
  getPropertySettingsData,
  getRentalData,
  initialTenants,
  startRent,
  Tenant,
  TenantResponse,
  transformUnitsTenants,
} from "./data";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import ServerError from "@/components/Error/ServerError";
import { empty } from "@/app/config";
import dayjs, { Dayjs } from "dayjs";
import { useGlobalStore } from "@/store/general-store";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { Currency } from "@/utils/number-formatter";
import { transformDocumentData } from "@/app/(nav)/documents/preview/data";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { AgreementPreview } from "@/components/Modal/tenant-document";

const StartRent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedOccupant, isPastDate } = useGlobalStore();
  const id = searchParams.get("id");
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const isRental = propertyType === "rental";

  const [unit_data, setUnit_data] = useState<initDataProps>(initData);
  const [tenants_data, setTenants_data] = useState<Tenant[]>(initialTenants);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] =
    useState<CheckBoxOptions>(defaultChecks);
  const [reqLoading, setReqLoading] = useState(false);
  // const [isPastDate, setIsPastDate] = useState(false);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const endpoint = `/unit/${id}/view`;
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
    error: allTenantsError,
    refetch: refetchTenants,
  } = useFetch<TenantResponse>("/all-tenants");

  useEffect(() => {
    if (apiData) {
      setUnit_data((x: any) => ({
        ...x,
        ...transformUnitData(apiData),
      }));
    }
  }, [apiData]);

  console.log("property_document", unit_data.property_document);

  useEffect(() => {
    if (allTenantData) {
      const transformedTenants = transformUnitsTenants(allTenantData);
      setTenants_data(transformedTenants);
    }
  }, [allTenantData]);

  const handleStartRent = async () => {
    if (!unit_data?.unit_id || !selectedTenantId) {
      toast.error(
        `Missing required information: Unit or ${
          isRental ? "Tenant" : "Occupant"
        } not selected.`
      );
      return;
    }

    if (!selectedCheckboxOptions) {
      toast.error("Notification preferences not set.");
      return;
    }

    // Validate dueDate
    if (dueDate && dueDate.isBefore(dayjs(), "day")) {
      toast.warning("End date cannot be in the past.");
      return;
    }
    const successMsg = isRental
      ? "Rent Started Succesfully"
      : "Occupant Moved In Successfully";
    const failedMsg = isRental
      ? "Failed to start Rent, Try Again!"
      : "Failed to Move Occupant In, Try Again!";
    const payload = {
      unit_id: unit_data.unit_id,
      tenant_id: selectedTenantId,
      start_date: startDate,
      payment_type: "full",
      rent_type: "new",
      mobile_notification: selectedCheckboxOptions.mobile_notification ? 1 : 0,
      email_alert: selectedCheckboxOptions.email_alert ? 1 : 0,
      has_invoice: selectedCheckboxOptions.create_invoice ? 1 : 0,
    };
    try {
      setReqLoading(true);
      const res = await startRent(payload);
      if (res) {
        toast.success(successMsg);
        router.back();
      }
    } catch (err) {
      toast.error(failedMsg);
    } finally {
      setReqLoading(false);
    }
  };

  const handleDownloadAgreement = async () => {
    if (!unit_data.property_document) {
      toast.error("No agreement document available for this unit.");
      return;
    }

    if (!selectedOccupant) {
      toast.error("Please select a tenant before downloading the agreement.");
      return;
    }

    try {
      setPdfLoading(true);
      // Map Occupant to TenantData
      const tenantData = {
        name: selectedOccupant.name || "Unknown Tenant",
        address: selectedOccupant.address
          ? `${selectedOccupant.address}, ${selectedOccupant.city}, ${selectedOccupant.lg}, ${selectedOccupant.state}`
          : unit_data.address || "Unknown Address",
        email: selectedOccupant.email || undefined,
        phone: selectedOccupant.phone || undefined,
      };

      const transformedData = transformDocumentData(
        { document: unit_data.property_document },
        tenantData
      );

      // Navigate to DocumentPreview with transformed data
      // router.push(`/documents/preview?download=true`, {
      //   state: { documentData: transformedData, unitName: unit_data.unit_name },
      // });
    } catch (err) {
      toast.error(
        "Failed to prepare agreement for download. Please try again."
      );
      console.error(err);
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  const propertyId = unit_data.propertyId;
  const rentalData = getRentalData(unit_data);
  const propertySettingsData = getPropertySettingsData(unit_data);
  const estateData = getEstateData(unit_data);
  const estateSettingsDta = getEstateSettingsData(unit_data);

  console.log("unit data", unit_data);

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
            picture: tenant.picture || empty,
          }))}
          period={unit_data?.fee_period as RentPeriod}
          setStart_date={setStartDate}
          setSelectedTenantId={setSelectedTenantId}
          setSelectedCheckboxOptions={setSelectedCheckboxOptions}
          currency={unit_data.currency as Currency}
          feeDetails={[
            {
              name: isRental
                ? `${unit_data?.fee_period} Rent`
                : `${unit_data?.fee_period} Fee`,
              amount: unit_data.newTenantPrice,
            },
            { name: "Service Charge", amount: unit_data.service_charge },
            { name: "Caution Fee", amount: unit_data.caution_fee },
            { name: "Inspection Fee", amount: unit_data.inspectionFee },
            { name: "Agency Fee", amount: unit_data.unitAgentFee },
            { name: "Legal Fee", amount: unit_data.legalFee },
            { name: "Security Fee", amount: unit_data.security_fee },
            { name: "VAT", amount: unit_data.vat_amount },
            { name: "Other Charges", amount: unit_data.other_charge },
          ].filter((fee) => fee.amount !== undefined && fee.amount !== "")}
          total_package={Number(unit_data.total_package)}
          loading={loading}
          id={propertyId as string}
          setDueDate={setDueDate}
        />
      </section>
      <FixedFooter className={`flex justify-end gap-4`}>
        {isRental &&
          selectedOccupant?.userTag?.toLocaleLowerCase() === "web" &&
          !isPastDate && (
            <Modal>
              <ModalTrigger asChild>
                <Button size="base_medium" className="py-2 px-6">
                  Download Agreement
                </Button>
              </ModalTrigger>
              <ModalContent>
                <AgreementPreview />
              </ModalContent>
            </Modal>
          )}

        <Button
          size="base_medium"
          className="py-2 px-6"
          disabled={reqLoading}
          onClick={handleStartRent}
        >
          {reqLoading
            ? "Please wait..."
            : isPastDate
            ? "Save Rent"
            : isRental
            ? "Start Rent"
            : "Move In"}
        </Button>
      </FixedFooter>
    </div>
  );
};

export default StartRent;
