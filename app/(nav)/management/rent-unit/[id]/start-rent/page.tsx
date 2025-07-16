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
import ServerError from "@/components/Error/ServerError";
import { empty } from "@/app/config";
import dayjs, { Dayjs } from "dayjs";
import { useGlobalStore } from "@/store/general-store";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { Currency } from "@/utils/number-formatter";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { AgreementPreview } from "@/components/Modal/tenant-document";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import FullPageLoader from "@/components/Loader/start-rent-loader";
import { useTourStore } from "@/store/tour-store";
import { getLocalStorage, removeLocalStorage } from "@/utils/local-storage";
import { parseCurrency } from "@/app/(nav)/accounting/expenses/[expenseId]/manage-expenses/data";
import CreateTenancyAggrementModal from "@/components/BadgeIcon/create-tenancy-aggrement-modal";

const StartRent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const canSubmitRent = useGlobalStore((state) => state.canSubmitRent);
  const { selectedOccupant, isPastDate } = useGlobalStore();
  const { setShouldRenderTour, setPersist, isTourCompleted } = useTourStore();
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
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [disableInput, setDisableInput] = useState(false);

  const isWebUser = selectedOccupant?.userTag?.toLocaleLowerCase() === "web";

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
      const transformedData = transformUnitData(apiData);
      setUnit_data((x: any) => ({
        ...x,
        ...transformUnitData(apiData),
      }));
      setGlobalStore("unitData", transformedData as any);
    }
  }, [apiData, setGlobalStore]);

  useEffect(() => {
    // Remove the session key on mount to avoid repeated redirects
    sessionStorage.removeItem("return_to_start_rent_unit_id");
  }, []);

  useEffect(() => {
    if (allTenantData) {
      const transformedTenants = transformUnitsTenants(allTenantData);
      setTenants_data(transformedTenants);
    }
  }, [allTenantData]);

  const HAS_DOCUMENT = unit_data?.property_document?.document_id;
  const AGREEMENT_CHECKED = selectedCheckboxOptions.rent_agreement;
  const TENANT_SCREENING_LEVEL = unit_data.tenant_screening_level;
  const OCCUPANT_SCREENING_LEVEL = unit_data.occupant_screening_level;

  const handleStartRent = async () => {
    if (!unit_data?.unit_id || !selectedTenantId) {
      toast.error(
        `Missing required information: Unit or ${
          isRental ? "Tenant" : "Occupant"
        } not selected.`
      );
      return;
    }

    if (!startDate) {
      toast.warning("Start date not selected.");
      return;
    }

    if (!selectedCheckboxOptions) {
      toast.error("Notification preferences not set.");
      return;
    }

    if (dueDate && dueDate.isBefore(dayjs(), "day")) {
      toast.warning("End date cannot be in the past.");
      return;
    }

    const IS_WEB_TENANT =
      selectedOccupant?.userTag?.toLocaleLowerCase() === "web";

    const IS_FACILITY = propertyType === "facility";

    // Only open modal if rent_agreement is checked
    if (!IS_FACILITY && !isPastDate && selectedCheckboxOptions.rent_agreement) {
      setIsAgreementModalOpen(true);
      return;
    }

    // For all other cases, proceed without modal
    await submitRent(null);
    return;
  };

  const submitRent = async (doc_file: File | null) => {
    const successMsg = isRental
      ? "Rent Started Successfully"
      : "Occupant Moved In Successfully";
    const failedMsg = isRental
      ? "Failed to start Rent, Try Again!"
      : "Failed to Move Occupant In, Try Again!";

    const IS_FACILITY = propertyType === "facility";
    // Determine document inclusion
    const shouldAttachDocument =
      !IS_FACILITY &&
      !isPastDate &&
      !!selectedCheckboxOptions.rent_agreement &&
      doc_file;

    const FacilityObj = {
      unit_id: unit_data.unit_id,
      tenant_id: selectedTenantId,
      start_date: startDate,
      payment_type: "full",
      rent_type: "new",
      mobile_notification: selectedCheckboxOptions.mobile_notification ? 1 : 0,
      email_alert: selectedCheckboxOptions.email_alert ? 1 : 0,
      // has_invoice: selectedCheckboxOptions.create_invoice ? 1 : 0, //LOTUS BACKEND ASKED FOR REVERSE
      has_invoice: isWebUser
        ? 1
        : selectedCheckboxOptions.create_invoice
        ? 0
        : 1,
      sms_alert: selectedCheckboxOptions.sms_alert ? 1 : 0,
      is_mobile_user: 0,
      has_document: 0,
      caution_fee: parseCurrency(unit_data?.caution_fee),
    };

    const RentalObj = {
      unit_id: unit_data.unit_id,
      tenant_id: selectedTenantId,
      start_date: startDate,
      payment_type: "full",
      rent_type: "new",
      mobile_notification: selectedCheckboxOptions.mobile_notification ? 1 : 0,
      email_alert: selectedCheckboxOptions.email_alert ? 1 : 0,
      // has_invoice: selectedCheckboxOptions.create_invoice ? 1 : 0, //INITIAL - LOTUS NOW BACKEND ASKED FOR REVERSE
      has_invoice: isWebUser
        ? 1
        : selectedCheckboxOptions.create_invoice
        ? 0
        : 1,
      sms_alert: selectedCheckboxOptions.sms_alert ? 1 : 0,
      is_mobile_user: 1,
      // has_document: isPastDate ? 0 : 1, // NOW WHEN PAST DATE IS SELECTED, NO DOCUMENT IS REQUIRED
      ...(isPastDate ? {} : { doc_file }),
      has_document: shouldAttachDocument ? 1 : 0,
      caution_fee: parseCurrency(unit_data?.caution_fee),
      // has_document: shouldAttachDocument || isPastDate ? 0 : 1,
      // ...(shouldAttachDocument && doc_file ? { doc_file } : {}),
    };

    if (shouldAttachDocument) {
      RentalObj.doc_file = doc_file;
    }

    // const payloadObj = IS_WEB_TENANT ? FacilityObj : RentalObj;
    const payloadObj = IS_FACILITY ? FacilityObj : RentalObj;
    // const payloadObj = MobilepayloadObj;
    const payload = objectToFormData(payloadObj);
    try {
      setReqLoading(true);
      const res = await startRent(payload);
      if (res) {
        toast.success(successMsg);
        router.push("/management/rent-unit");
        localStorage.removeItem("selectedTenantId");
      }
    } catch (err) {
      toast.error(failedMsg);
    } finally {
      setReqLoading(false);
      setIsAgreementModalOpen(false);
    }
  };

  const handleAgreementContinue = async (doc_file: File) => {
    setPdfLoading(true);
    try {
      await submitRent(doc_file);
    } finally {
      setPdfLoading(false);
    }
  };

  useEffect(() => {
    setDisableInput(reqLoading || pdfLoading);
  }, [reqLoading, pdfLoading]);

  // TOUR LOGIC
  useEffect(() => {
    if (loading || allTenantsLoading) {
      // Wait for data to load
      setShouldRenderTour(false);
      return;
    }

    // Set persist to true for StartRentTour to ensure completion is saved
    setPersist(false);

    // Check if tour has already been completed
    if (!isTourCompleted("StartRentTour")) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    // Cleanup to prevent tour from running on unmount
    return () => setShouldRenderTour(false);
  }, [
    loading,
    allTenantsLoading,
    setShouldRenderTour,
    setPersist,
    isTourCompleted,
  ]);


  useEffect(() => {
    if (unit_data?.unit_id) {
      sessionStorage.setItem("return_to_start_rent_unit_id", unit_data.unit_id);
    }
    if (unit_data?.propertyId) {
      sessionStorage.setItem(
        "return_to_start_rent_property_id",
        String(unit_data.propertyId)
      );
    }
  }, [unit_data?.unit_id, unit_data?.propertyId]);

  const handleAgreementClick = () => {
    if (unit_data?.unit_id) {
      sessionStorage.setItem("return_to_start_rent_unit_id", unit_data.unit_id);
    }
    if (unit_data?.propertyId) {
      // Save as string, use the correct property id field
      sessionStorage.setItem(
        "return_to_start_rent_property_id",
        String(unit_data.propertyId)
      );
    }
    router.push(
      HAS_DOCUMENT
        ? `/documents/manage-tenancy-agreement?d=${unit_data.property_document.document_id}`
        : `/documents/create-tenancy-agreement/?p=${unit_data.propertyId}`
    );
  };

  if (reqLoading || pdfLoading) {
    return (
      <FullPageLoader
        text="Submitting rent..."
        onClose={() => setReqLoading(false)} 
      />
    );
  }

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  const propertyId = unit_data.propertyId;
  const rentalData = getRentalData(unit_data);
  const propertySettingsData = getPropertySettingsData(unit_data);
  const estateData = getEstateData(unit_data);
  const estateSettingsDta = getEstateSettingsData(unit_data);
  const IS_WEB_TENANT =
    selectedOccupant?.userTag?.toLocaleLowerCase() === "web";

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
          title={`${isRental ? "Unit" : "Facility"} Settings`}
          estateSettingsDta={
            isRental ? propertySettingsData : estateSettingsDta
          }
          // {...(isRental ? { gridThree: true } : {})}
          gridThree
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
          disableInput={disableInput}
          tenantsLoading={allTenantsLoading}
        />
      </section>

      <FixedFooter className="start-rent-button flex gap-4">
        {AGREEMENT_CHECKED && isRental && (
          <>
            {HAS_DOCUMENT ? (
              <Button
                size="base_medium"
                className="py-2 px-6"
                onClick={handleAgreementClick}
              >
                Manage Agreement
              </Button>
            ) : (
              <Modal>
                <ModalTrigger asChild>
                  <Button size="base_medium" className="py-2 px-6">
                    Create Agreement
                  </Button>
                </ModalTrigger>
                <ModalContent>
                  <CreateTenancyAggrementModal defaultOption="tenancy_agreement" />
                </ModalContent>
              </Modal>
            )}
          </>
        )}

        <Button
          size="base_medium"
          className="py-2 px-6 items-end ml-auto"
          disabled={reqLoading || pdfLoading || !canSubmitRent}
          onClick={handleStartRent}
        >
          {reqLoading || pdfLoading
            ? "Please wait..."
            : isPastDate
            ? "Save Rent"
            : !IS_WEB_TENANT
            ? "Proceed"
            : isRental
            ? "Proceed"
            : "Move In"}
        </Button>
      </FixedFooter>

      {isAgreementModalOpen && (
        <Modal
          state={{
            isOpen: isAgreementModalOpen,
            setIsOpen: setIsAgreementModalOpen,
          }}
        >
          <ModalContent>
            <AgreementPreview
              onClose={() => setIsAgreementModalOpen(false)}
              onContinue={handleAgreementContinue}
              isWebTenant={IS_WEB_TENANT}
            />
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default StartRent;
