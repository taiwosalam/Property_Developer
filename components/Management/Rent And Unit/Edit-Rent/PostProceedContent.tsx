"use client";

import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import {
  estateSettingsDta,
  estateData,
  propertySettingsData,
  rentalData,
  RentPreviousRecords,
  calculateBalance,
  getEstateData,
  getPropertyEstateData,
  // getEstateSettingsDta,
  // getPropertyEstateData,
} from "@/components/Management/Rent And Unit/data";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent } from "@/components/Modal/modal";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
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
// import { getPropertySettingsData, getRentalData } from "./data";
import {
  getEstateSettingsData,
  getPropertySettingsData,
  getRentalData,
  switchUnit,
} from "@/app/(nav)/management/rent-unit/[id]/edit-rent/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import CardsLoading from "@/components/Loader/CardsLoading";
import { useGlobalStore } from "@/store/general-store";
import { parseCurrency } from "@/app/(nav)/accounting/expenses/[expenseId]/manage-expenses/data";
import { ChangePropertyNewUnitCost } from "../change-property/new-unit-cost";
import { ProceedPreviousUnitBalance } from "../change-property/previous-unit";
import { ProceedPayAble } from "../change-property/payable";
import { extractBalanceDates } from "../change-property/data";
import { AgreementPreview } from "@/components/Modal/tenant-document";
import { useTourStore } from "@/store/tour-store";

const PostProceedContent = ({
  selectedUnitId,
  page,
}: {
  selectedUnitId?: string;
  page?: "unit" | "property";
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setShouldRenderTour, setPersist, isTourCompleted } = useTourStore();
  const {
    occupant,
    propertyData,
    records,
    unitBalance,
    calculation,
    deduction,
    unitData,
    setSelectedUnitId,
    setPage,
    setPropertyType,
    setPropertyId,
    setUnitData,
    setReqLoading,
    setStartDate,
    setDueDate,
    setModalIsOpen,
    reqLoading,
    startDate,
    dueDate,
    modalIsOpen,
  } = useOccupantStore();

  const propertyType = searchParams.get("type") as "rental" | "facility";
  const propertyId = searchParams.get("p");
  const isRental = propertyType === "rental";
  const currentUnit = useGlobalStore((s) => s.currentUnit);
  const currentRentStats = useGlobalStore((s) => s.currentRentStats);
  const oustandingObj = currentRentStats?.oustandingObj || [];
  const outstanding = currentRentStats?.outstanding || 0;
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const isUnit = page === "unit";

  // Set initial data in store
  useEffect(() => {
    setSelectedUnitId(selectedUnitId || null);
    setPage(page || null);
    setPropertyType(propertyType);
    setPropertyId(propertyId);
    setUnitData(initData); // Initialize unitData
  }, [
    selectedUnitId,
    page,
    propertyType,
    propertyId,
    setSelectedUnitId,
    setPage,
    setPropertyType,
    setPropertyId,
    setUnitData,
  ]);

  // Fetch unit data and update store
  const endpoint = `/unit/${selectedUnitId}/view`;
  const {
    data: apiData,
    loading,
    isNetworkError,
    error,
  } = useFetch<singleUnitApiResponse>(endpoint);

  useEffect(() => {
    if (apiData) {
      const transformedData = transformUnitData(apiData);
      setUnitData({
        ...initData,
        ...transformedData,
      });
    }
  }, [apiData, setUnitData]);

  // Extract and save startDate and dueDate
  useEffect(() => {
    if (unitData && (unitBalance?.data || startDate)) {
      const { start_date, due_date } = extractBalanceDates(
        unitBalance?.data || [],
        unitData.fee_period || "yearly",
        startDate
      );
      // console.log("Extracted date:", { start_date, due_date });

      // Save to store if different
      if (start_date && startDate !== start_date) {
        setStartDate(start_date);
      }
      if (due_date && dueDate !== due_date) {
        setDueDate(due_date);
      }
    }
  }, [unitBalance, unitData, startDate, setStartDate, setDueDate]);

  // TOUR LOGIC
  useEffect(() => {
    if (loading || !unitData) {
      setShouldRenderTour(false);
      return;
    }

    setPersist(false); // Persist to true PostProceedUnitTour completion
    if (!isTourCompleted("PostProceedUnitTour")) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [loading, unitData, setShouldRenderTour, setPersist, isTourCompleted]);

  const balance =
    unitBalance?.data?.map((record: any) => ({
      ...record,
      amount_paid: `₦${formatNumber(record.amount_paid) || 0}`,
      start_date: record.start_date
        ? // ? dayjs(record.start_date).format("MMM D, YYYY").toLowerCase()
          record.start_date
        : null,
      due_date: record.due_date
        ? // ? dayjs(record.due_date).format("MMM D, YYYY").toLowerCase()
          record.due_date
        : null,
      payment_date: record.payment_date ? record.payment_date : null,
    })) || [];

  const startday = balance?.[0]?.start_date;
  const endDay = balance?.[0]?.due_date;
  const amt = balance?.[0]?.amount_paid;
  const rent = currentUnit?.newTenantTotalPrice;
  const renewalTenantPrice = parseCurrency(currentUnit?.renewalTenantPrice);
  const bal =
    startday && endDay && amt ? calculateBalance(amt, startday, endDay) : 0;

  const newUnitTotal = calculation
    ? Number(unitData?.newTenantTotalPrice || 0)
    : Number(unitData?.renewalTenantTotalPrice || 0);
  const newUnitTotalFormatted = calculation
    ? formatFee(
        unitData?.newTenantTotalPrice || 0,
        unitData?.currency || "naira"
      )
    : formatFee(
        unitData?.renewalTenantTotalPrice || 0,
        unitData?.currency || "naira"
      );
  const totalPayable = deduction ? outstanding - newUnitTotal : newUnitTotal;
  const prev_unit_bal = bal
    ? `₦${formatNumber(parseFloat(`${bal}`))}`
    : undefined;
  const refundAmount = totalPayable < 0 ? Math.abs(totalPayable) : 0;

  const isExcess = totalPayable < 0;
  const balanceLabel = isExcess ? "Client Excess" : "Refund Client";
  const showBalanceCard = totalPayable < 0 || isExcess;

  console.log("propertyData", propertyData)

  const currentUnitAmt = formatFee(newUnitTotal, unitData?.currency || "naira");

  const rentalData = getRentalData(isUnit ? currentUnit : propertyData);
  const propertySettingsData = getPropertySettingsData(
    isUnit ? currentUnit : propertyData
  );
  // const PropertyPageEstateData = getPropertyEstateData(propertyData);
  const PropertyPageEstateData = getPropertyEstateData(unitData);
  const UnitPageEstateData = getEstateData(currentUnit);
  const estateData = isUnit ? UnitPageEstateData : PropertyPageEstateData;
  // const estateData = getEstateData(isUnit ? currentUnit : propertyData);

  const estateSettingsDta = getEstateSettingsData(
    isUnit ? currentUnit : propertyData
  );

  const handleSwitchUnit = async () => {
    if (!selectedUnitId || !balance[0]?.id) {
      toast.warning(
        "Missing required information: Unit or record ID not selected."
      );
      return;
    }

    if (!startDate) {
      toast.warning("Start date not selected.");
      return;
    }

    // Open modal for all tenants
    setIsAgreementModalOpen(true);
  };

  const submitSwitchUnit = async (doc_file: File) => {
    const id = balance[0].id;
    const data = {
      new_unit_id: selectedUnitId,
      calculation: calculation ? 1 : 0,
      deduction: deduction ? 1 : 0,
      payment_date: startDate,
      has_document: 1,
      doc_file, // Always include doc_file
    };

    console.log(
      "Final PDF size before API:",
      doc_file.size / (1024 * 1024),
      "MB"
    );

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
      setIsAgreementModalOpen(false);
    }
  };

  const handleAgreementContinue = async (doc_file: File) => {
    setPdfLoading(true);
    try {
      await submitSwitchUnit(doc_file);
    } finally {
      setPdfLoading(false);
    }
  };

  if (!unitBalance) {
    toast.warning("Back to Rent & Unit for security reasons");
    router.back();
    return null;
  }

  if (loading || !unitData) {
    return (
      <div className="custom-flex-col gap-2">
        <CardsLoading length={6} />
      </div>
    );
  }

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
          id={propertyId as string}
        />
        <div className="previous-unit-balance">
          <ProceedPreviousUnitBalance />
        </div>
        <div className="pt-6 lg:flex lg:gap-10 space-y-8">
          <div className="lg:w-3/5 space-y-8">
            <ChangePropertyNewUnitCost id={unitData?.id} />
            <div className="calculation-toggle">
              <ProceedPreviousUnitBalance title="Calculations" workings />
            </div>

            <ProceedPayAble />
            <StartRent
              isRental={isRental}
              rentPeriod="yearly"
              title={`Start ${isRental ? "Rent" : "Counting"}`}
              start
              setStart_Date={(date) => setStartDate(date)}
            />
          </div>
          <div className="matched-profile-container lg:flex-1 lg:!mt-[52px]">
            <MatchedProfile occupant={occupant} title="User Profile" />
          </div>
        </div>
        <PreviousRentRecords
          current_records={unitBalance && (unitBalance as any)}
          isRental={isRental}
          unit_id={selectedUnitId}
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
        <Modal
          state={{
            isOpen: modalIsOpen,
            setIsOpen: setModalIsOpen as React.Dispatch<
              React.SetStateAction<boolean>
            >,
          }}
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
              isWebTenant={false}
            />
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default PostProceedContent;
