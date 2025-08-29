"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import dayjs, { Dayjs } from "dayjs";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { useOccupantStore } from "@/hooks/occupant-store";
import { getEstateSettingsData, payDueRent, startRent } from "../start-rent/data";
import { addPartPayment, editRent, getEstateData } from "../edit-rent/data";
import {
  formatFee,
  initData,
  initDataProps,
  singleUnitApiResponse,
  transformUnitData,
} from "../../data";
import { MatchedProfile } from "@/components/Management/Rent And Unit/matched-profile";
import {
  AddPartPayment,
  CompletePartPayment,
} from "@/components/Management/Rent And Unit/Edit-Rent/Edit-rent-sections";
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
import { useGlobalStore } from "@/store/general-store";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { Modal, ModalContent } from "@/components/Modal/modal";
import { AgreementPreview } from "@/components/Modal/tenant-document";
import { RenewRentAddPartPayment } from "@/components/Management/Rent And Unit/renew-rent/renewRentPartPayment";
import { parseCurrency } from "@/app/(nav)/accounting/expenses/[expenseId]/manage-expenses/data";
import { PendingInvoicePayment } from "@/components/Management/Rent And Unit/Edit-Rent/unpaid-invoice";
import { useTourStore } from "@/store/tour-store";

const RenewRent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { setShouldRenderTour, setPersist, isTourCompleted } = useTourStore();
  const router = useRouter();

  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const getGlobalStore = useGlobalStore((s) => s.getGlobalInfoStore);
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const isRental = propertyType === "rental";

  // Zustand store
  const {
    setOccupant,
    occupant,
    penaltyAmount,
    setUnitBalance,
    unitBalance,
    overduePeriods,
  } = useOccupantStore();

  // State
  const [unitData, setUnitData] = useState<initDataProps>(initData);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [amt, setAmt] = useState("");
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] =
    useState<CheckBoxOptions>(defaultChecks);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isUpfrontPaymentChecked, setIsUpfrontPaymentChecked] = useState(true);
  const [reqLoading, setReqLoading] = useState(false);
  const [isCompletePayment, setIsCompletePayment] = useState(false);
  const [hasPartPayment, setHasPartPayment] = useState(false);

  // Document logic
  const HAS_DOCUMENT = unitData?.property_document?.document_id;
  const AGREEMENT_CHECKED = selectedCheckboxOptions.rent_agreement;
  const RENTID = unitData?.current_records?.data[0].id;
  const PenaltyRenewTotalAmount = getGlobalStore("totalRenewAmount");

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
      setGlobalStore("unitData", transformedData as any);
      setUnitData((prev: any) => ({ ...prev, ...transformedData }));
      if (transformedData.occupant) {
        setOccupant(transformedData.occupant);
      }
      if (transformedData.current_records) {
        setUnitBalance(transformedData.current_records);
      }
      // Update part payment status
      setHasPartPayment(
        Number(transformedData.pending_invoice?.amount_paid) > 0
      );
    }
  }, [apiData, setOccupant, setUnitBalance]);

  // TOUR LOGIC
  useEffect(() => {
    if (loading || !unitData.unit_id) {
      setShouldRenderTour(false);
      return;
    }

    setPersist(false); // Disable persist for this tour - set to true to persist it to localstorage
    if (!isTourCompleted("RenewRentTour")) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [loading, unitData, setShouldRenderTour, setPersist, isTourCompleted]);

  // Derived data
  const propertyId = unitData.propertyId;
  const previousRecord = (unitData?.current_records as any)?.data?.[0];
  const start_date = previousRecord?.start_date
    ? // ? dayjs(previousRecord.start_date).format("DD/MM/YYYY")
      previousRecord.start_date
    : "__,__,___";
  const due_date = previousRecord?.due_date
    ? // ? dayjs(previousRecord.due_date).format("DD/MM/YYYY")
      previousRecord.due_date
    : "___,___,___";

  const propertySettingsData = getPropertySettingsData(unitData);
  const rentalData = getRentalData(unitData);
  const estateData = getEstateData(unitData);
  const estateSettingsDta = getEstateSettingsData(unitData);

  // PENDING INVOICE REPRESENTS PART PAYMENT TENANT MADE
  const PENDING_INVOICE = unitData?.pending_invoice;
  const PENDING_INVOICE_PAID_AMOUNT =
    parseFloat(PENDING_INVOICE?.amount_paid) || 0;
  const PENDING_INVOICE_BALANCE_DUE =
    parseFloat(PENDING_INVOICE?.balance_due) || 0;
  const PART_PAYMENT_AMOUNT = PENDING_INVOICE_PAID_AMOUNT;

  const isWebUser = occupant?.userTag?.toLowerCase() === "web";
  // UNPAID INVOICE REPRESENTS PAYMENTS THAT WAS ADDED BUT HAVE NOT BEEN MARKED AS PAID
  const UNPAID_INVOICE = unitData?.unpaid_invoice;
  const UNPAID_INVOICE_PAID_AMOUNT =
    parseFloat(UNPAID_INVOICE?.amount_paid) || 0;
  // UNIT CURRENCY WITH NAIRA FALLBACK
  const currency = (unitData.currency as Currency) || "naira";

  const handleRenewRent = async () => {
    if (hasPartPayment) {
      return toast.warning(
        "Part payment already exists. Please complete the payment first."
      );
    }

    if (!unitData?.unit_id || !unitData?.occupant?.id) {
      toast.warning(
        "Missing required information: unit or occupant not found."
      );
      return;
    }
    if (!selectedCheckboxOptions) {
      toast.warning("Notification preferences not set.");
      return;
    }
    if (!startDate) {
      toast.warning("Payment date is required.");
      return;
    }

    if (dueDate && dueDate.isBefore(dayjs(startDate), "day")) {
      toast.warning("Due date cannot be before the start date.");
      return;
    }

    // For rentals, if rent_agreement is true, open the agreement preview modal
    if (isRental && AGREEMENT_CHECKED) {
      setIsAgreementModalOpen(true);
      return;
    }

    // For facilities or if no agreement is required, proceed directly
    await submitRent(null);
  };

  const submitRent = async (doc_file: File | null) => {
    const successMsg = isRental
      ? "Rent Renewed Successfully"
      : "Fee Renewed Successfully";
    const failedMsg = isRental ? "Failed to renew rent" : "Failed to renew fee";
    const shouldAttachDocument = isRental && AGREEMENT_CHECKED && doc_file;
    const HAS_PENALTY = penaltyAmount > 0 ? 1 : 0;

    const payloadObj: any = {
      unit_id: unitData.unit_id,
      tenant_id: unitData.occupant.id,
      start_date: dayjs(startDate).format("MM/DD/YYYY"),
      payment_type: "full",
      rent_type: "renew",
      mobile_notification: selectedCheckboxOptions.mobile_notification ? 1 : 0,
      email_alert: selectedCheckboxOptions.email_alert ? 1 : 0,
      has_invoice: isWebUser
        ? 1
        : selectedCheckboxOptions.create_invoice
        ? 0
        : 1,
      // has_invoice: selectedCheckboxOptions.create_invoice ? 1 : 0,
      sms_alert: selectedCheckboxOptions.sms_alert ? 1 : 0,
      has_penalty: HAS_PENALTY,
      penalty_amount: penaltyAmount > 0 ? penaltyAmount : 0,
    };

    const penaltyPayload = {
      tenant_id: unitData.occupant.id,
      unit_id: unitData.unit_id,
      payment_date: dayjs().format("YYYY-MM-DD"),
      rent_id: RENTID,
      amount: PenaltyRenewTotalAmount,
      has_invoice: 1,
      has_penalty: 1,
      penalty_amount: penaltyAmount > 0 ? penaltyAmount : 0,
    };

    // Only include has_document and doc_file for rentals
    if (isRental && shouldAttachDocument) {
      payloadObj.has_document = doc_file ? 1 : 0;
      if (doc_file) {
        payloadObj.doc_file = doc_file;
      }
    }

    const payload = objectToFormData(HAS_PENALTY ? penaltyPayload : payloadObj);
    console.log("payload", penaltyPayload);

    try {
      setReqLoading(true);
      // const res = await startRent(payload);
      const res = await payDueRent(payload);
      if (res) {
        toast.success(successMsg);
        router.push("/management/rent-unit");
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

  // Part Payment Handler
  const handlePartPayment = async () => {
    if (!unitBalance || unitBalance.length === 0) {
      toast.error("No unit balance available");
      return;
    }
    if (!startDate) {
      toast.warning("Payment date is required for part payment");
      return;
    }
    if (!amt || parseCurrency(amt) <= 0) {
      toast.warning("Please enter a valid payment amount");
      return;
    }

    const hasPenalty = penaltyAmount > 0;
    const amountToPay = hasPenalty
      ? parseCurrency(amt) + penaltyAmount
      : parseCurrency(amt);

    const payload = {
      unit_id: id,
      amount: amountToPay,
      rent_id: unitBalance.data[0].id,
      payment_date: dayjs(startDate).format("YYYY-MM-DD"),
      tenant_id: unitData.occupant.id,
      has_penalty: penaltyAmount > 0 ? 1 : 0,
      penalty_amount: penaltyAmount > 0 ? penaltyAmount : 0,
      type: "part_payment",
      has_invoice: isWebUser
        ? 1
        : selectedCheckboxOptions.create_invoice
        ? 0
        : 1,
      // has_invoice: selectedCheckboxOptions.create_invoice ? 0 : 1,
    };

    try {
      setReqLoading(true);
      const res = await addPartPayment(payload);
      if (res) {
        toast.success(res.message || "Part payment added successfully");
        window.dispatchEvent(new Event("refetchUnit"));

        // Update part payment status
        setHasPartPayment(true);

        // Check pay_status and handle accordingly
        if (res.pay_status === "part") {
          setAmt("");
          setStartDate(null);
        } else if (res.pay_status === "full") {
          router.push("/accountant/management/rent-unit");
        }
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
            gridThree
            noEdit
          />
          <div className="pt-6 lg:flex lg:gap-10 space-y-8">
            <div className="lg:w-3/5 space-y-8">
              {/* WHEN THERE'S PENDING INVOICE - SHOW NOTHING ASIDE MODAL TO MARK AS PAID */}

              {UNPAID_INVOICE_PAID_AMOUNT > 0 ? (
                <>
                  <PendingInvoicePayment
                    feeDetails={[
                      {
                        name: "Status",
                        amount: UNPAID_INVOICE.status,
                      },
                      {
                        name: "Payment Date",
                        amount: dayjs(UNPAID_INVOICE.invoice_date).format(
                          "MMM DD YYYY"
                        ),
                      },
                      {
                        name: "Amount Paid",
                        amount: formatFee(UNPAID_INVOICE_PAID_AMOUNT, currency),
                      },
                      {
                        name: "Balance Due",
                        amount: formatFee(UNPAID_INVOICE.balance_due, currency),
                      },
                    ]}
                    currency={currency}
                    total={UNPAID_INVOICE.total_amount}
                    invoice_id={UNPAID_INVOICE.id}
                    unit_id={unitData.id as string}
                    page="renew"
                  />
                </>
              ) : (
                <>
                  {PART_PAYMENT_AMOUNT <= 0 && (
                    <>
                      <RenewalRentDetails />
                      <RenewalFee
                        setIsUpfrontPaymentChecked={setIsUpfrontPaymentChecked}
                      />
                      {/* <OwingFee show={isUpfrontPaymentChecked} /> */}

                      <RenewalRent
                        setStartDate={setStartDate}
                        setDueDate={setDueDate}
                        loading={reqLoading}
                        action={handleRenewRent} //ADDED ACTION TO RENEW
                        setSelectedCheckboxOptions={setSelectedCheckboxOptions}
                      />
                    </>
                  )}

                  {PART_PAYMENT_AMOUNT > 0 && (
                    <CompletePartPayment
                      feeDetails={[
                        {
                          name: "Part Payment",
                          amount: formatFee(PART_PAYMENT_AMOUNT, currency),
                        },
                        // {
                        //   name: "Penalty Amount",
                        //   amount: formatFee(penaltyAmount, currency),
                        // },
                        {
                          name: "Balance",
                          amount: formatFee(
                            PENDING_INVOICE_BALANCE_DUE,
                            currency
                          ),
                        },
                        {
                          name: "Last Payment",
                          amount:
                            unitData?.pending_invoice.last_updated_date ??
                            "__,__,__",
                        },
                      ]}
                      currency={currency}
                      total={PART_PAYMENT_AMOUNT}
                      setIsCompletePayment={setIsCompletePayment}
                    />
                  )}

                  {/* IF THERE'S NO ONGOING PART PAYMENT., USER CAN ADD */}
                  {PART_PAYMENT_AMOUNT <= 0 && (
                    <RenewRentAddPartPayment
                      isRental={isRental}
                      currency={currency || "naira"}
                      setStart_Date={(date: string | null) =>
                        date ? setStartDate(dayjs(date)) : setStartDate(null)
                      }
                      // noBtn //USE NOBTN PROP TO PUT BUTTON ELSEWHERE
                      loading={reqLoading}
                      setAmt={setAmt}
                      action={handlePartPayment}
                      setSelectedCheckboxOptions={setSelectedCheckboxOptions}
                      // isCompletePayment={isCompletePayment}
                      // prevAmt={PENDING_INVOICE_BALANCE_DUE.toString()}
                      setIsUpfrontPaymentChecked={setIsUpfrontPaymentChecked}
                      isUpfrontPaymentChecked={isUpfrontPaymentChecked}
                    />
                  )}

                  {/* IF THERE'S PART PAYMENT  */}
                  {isCompletePayment && (
                    <RenewRentAddPartPayment
                      isRental={isRental}
                      currency={currency || "naira"}
                      setStart_Date={(date: string | null) =>
                        date ? setStartDate(dayjs(date)) : setStartDate(null)
                      }
                      loading={reqLoading}
                      setAmt={setAmt}
                      action={handlePartPayment}
                      disabled={PART_PAYMENT_AMOUNT > 0}
                      isCompletePayment={isCompletePayment}
                      prevAmt={PENDING_INVOICE_BALANCE_DUE.toString()}
                      setIsUpfrontPaymentChecked={setIsUpfrontPaymentChecked}
                      isUpfrontPaymentChecked={isUpfrontPaymentChecked}
                    />
                  )}
                </>
              )}
            </div>
            <div className="lg:flex-1 lg:!mt-[52px]">
              <MatchedProfile occupant={occupant} title="User Profile" />
            </div>
          </div>
          <PreviousRentRecords />
        </section>
        <FixedFooter className="flex gap-4">
          {isRental && AGREEMENT_CHECKED && (
            <Button
              href={
                HAS_DOCUMENT
                  ? `/documents/manage-tenancy-agreement?d=${unitData.property_document.document_id}`
                  : `/documents/`
              }
              size="base_medium"
              className="py-2 px-6"
            >
              {HAS_DOCUMENT ? "Manage Agreement" : "Create Agreement"}
            </Button>
          )}
          {isCompletePayment ? (
            <Button
              size="base_medium"
              className="py-2 px-6 items-end ml-auto"
              disabled={reqLoading}
              onClick={() => router.push("/accountant/management/rent-unit")}
              // onClick={handlePartPayment}
            >
              Save
              {/* {reqLoading ? "Please wait..." : "Finish Payment"} */}
            </Button>
          ) : isUpfrontPaymentChecked ? (
            <Button
              size="base_medium"
              className="py-2 px-6 items-end ml-auto"
              disabled={reqLoading}
              onClick={() => router.push("/accountant/management/rent-unit")}
              // onClick={handleRenewRent}
            >
              Save
              {/* {reqLoading
                ? "Please wait..."
                : isRental
                ? "Renew Rent"
                : "Renew"} */}
            </Button>
          ) : (
            <Button
              size="base_medium"
              className="py-2 px-6 items-end ml-auto"
              onClick={() => router.push("/accountant/management/rent-unit")}
              // disabled={reqLoading || !amt || !startDate}
              // onClick={handlePartPayment}
            >
              Save
              {/* {reqLoading ? "Please wait..." : "Update"} */}
            </Button>
          )}
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
                // isWebTenant={isWebUser}
              />
            </ModalContent>
          </Modal>
        )}
      </div>
    </RenewRentContext.Provider>
  );
};

export default RenewRent;
