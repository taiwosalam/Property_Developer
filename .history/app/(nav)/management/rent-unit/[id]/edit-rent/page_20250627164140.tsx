"use client";

import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import Button from "@/components/Form/Button/button";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import { useRouter, useSearchParams } from "next/navigation";
import {
  RentDetails,
  AddPartPayment,
  EditCurrentRent,
  TransferTenants,
  CompletePartPayment,
} from "@/components/Management/Rent And Unit/Edit-Rent/Edit-rent-sections";
import {
  RenewalFee,
  PreviousRentRecords,
} from "@/components/Management/Rent And Unit/renewal-rent-detals";
import { MatchedProfile } from "@/components/Management/Rent And Unit/matched-profile";
import {
  formatFee,
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
  addPartPayment,
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
import { useGlobalStore } from "@/store/general-store";
import { parseCurrency } from "@/app/(nav)/accounting/expenses/[expenseId]/manage-expenses/data";
import {
  CheckBoxOptions,
  defaultChecks,
} from "@/components/Management/Rent And Unit/data";
import { PendingInvoicePayment } from "@/components/Management/Rent And Unit/Edit-Rent/unpaid-invoice";
import { useTourStore } from "@/store/tour-store";

const EditRent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const isRental = propertyType === "rental";
  // TOUR STORE
  const { setShouldRenderTour, setPersist, isTourCompleted } = useTourStore();

  //STORE TO SAVE SELECTED OCCUPANT/TENANT
  const { setOccupant, occupant, penaltyAmount, setUnitBalance, unitBalance } =
    useOccupantStore();
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [amt, setAmt] = useState("");
  const [reqLoading, setReqLoading] = useState(false);
  const [isUpfrontPaymentChecked, setIsUpfrontPaymentChecked] = useState(false);
  const [isCompletePayment, setIsCompletePayment] = useState(false);
  const [unit_data, setUnit_data] = useState<initDataProps>(initData);
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] =
    useState<CheckBoxOptions>(defaultChecks);
  const { setSelectedOccupant, setUnitData } = useGlobalStore();
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
      setGlobalStore("currentUnit", transformedData);
      setUnitData(transformedData as any);
      if (transformedData.occupant) {
        setSelectedOccupant(transformedData.occupant);
        setOccupant(transformedData.occupant); // Store occupant data in Zustand
      }
      if (transformedData.current_records) {
        setUnitBalance(transformedData.current_records); // Store balance data in Zustand
      }
    }
  }, [apiData, setOccupant, setUnitBalance, setGlobalStore]);

  const record = (unit_data?.current_records as any)?.data?.[0];
  const start_date = record?.start_date
    ? dayjs(record?.start_date).format("DD/MM/YYYY")
    : "__,__,__";
  const due_date = record?.due_date
    ? dayjs(record?.due_date).format("DD/MM/YYYY")
    : "__,__,__";
  const propertyId = unit_data.propertyId;

  // GETTING DATA FOR EACH SECTION
  const rentalData = getRentalData(unit_data);
  const estateData = getEstateData(unit_data);
  const propertySettingsData = getPropertySettingsData(unit_data);
  const estateSettingsDta = getEstateSettingsData(unit_data);

  // PENDING INVOICE REPRESENTS PART PAYMENT TENANT MADE
  const PENDING_INVOICE = unit_data?.pending_invoice;
  const PENDING_INVOICE_PAID_AMOUNT =
    parseFloat(PENDING_INVOICE?.amount_paid) || 0;
  const PENDING_INVOICE_BALANCE_DUE =
    parseFloat(PENDING_INVOICE?.balance_due) || 0;

  // UNPAID INVOICE REPRESENTS PAYMENTS THAT WAS ADDED BUT HAVE NOT BEEN MARKED AS PAID
  const UNPAID_INVOICE = unit_data?.unpaid_invoice;
  const UNPAID_INVOICE_PAID_AMOUNT =
    parseFloat(UNPAID_INVOICE?.amount_paid) || 0;
  const PART_PAYMENT_AMOUNT = PENDING_INVOICE_PAID_AMOUNT;
  // UNIT CURRENCY WITH NAIRA FALLBACK
  const CURRENCY = unit_data.currency || "naira";
  const has_part_payment = PENDING_INVOICE_PAID_AMOUNT > 0;

  const IS_WEB_USER = unit_data?.occupant?.userTag?.toLowerCase() === "web";

  // console.log("PENDING_INVOICE_PAID_AMOUNT", PENDING_INVOICE_PAID_AMOUNT)
  console.log("selectedCheckboxOptions", selectedCheckboxOptions)

  // ADD UPFRONT RENT HANDLER
  const handleUpfrontRent = async () => {
    if (!unitBalance || unitBalance.length === 0) {
      toast.error("No unit balance available");
      return;
    }
    const payload = {
      unit_id: id,
      amount: unit_data.renewalTenantTotalPrice,
      rent_id: unitBalance?.data[0]?.id,
      payment_date: startDate,
      tenant_id: unit_data.occupant.id,
      has_penalty: penaltyAmount > 0 ? 1 : 0,
      type: "upfront_payment",
      has_invoice: IS_WEB_USER
        ? 1
        : selectedCheckboxOptions.create_invoice
        ? 0
        : 1,
    };
    console.log("payload upfront", payload)
    // try {
    //   setReqLoading(true);
    //   const success = await editRent(payload);
    //   if (success) {
    //     toast.success("Upfront payment created successfully");
    //     window.dispatchEvent(new Event("refech-unit"));
    //   }
    // } catch (err) {
    //   toast.error("Failed to create upfront payment");
    // } finally {
    //   setReqLoading(false);
    // }
  };

  // ADD PART PAYMENT HANDLER
  const handlePartPayment = async () => {
    if (!unitBalance || unitBalance.length === 0) {
      toast.error("No unit balance available");
      return;
    }

    if (!startDate) {
      return toast.warning("Please select a payment date");
    }

    const payload = {
      unit_id: id,
      amount: parseCurrency(amt),
      rent_id: unitBalance?.data[0]?.id,
      payment_date: startDate,
      tenant_id: unit_data?.occupant?.id,
      type: "part_payment",
      has_penalty: penaltyAmount > 0 ? 1 : 0,
      penalty_amount: penaltyAmount > 0 ? penaltyAmount : 0,
      has_invoice: IS_WEB_USER
        ? 1
        : selectedCheckboxOptions.create_invoice
        ? 0
        : 1,
    };
    console.log("payload part", payload)
    try {
      setReqLoading(true);
      const res = await addPartPayment(payload);
      if (res) {
        toast.success(res.message || "Part payment added successfully");
        console.log("res", res);
        window.dispatchEvent(new Event("refech-unit"));
        // if (res.data.payment_type) {
        //   setAmt("");
        //   setStartDate(null);
        // }
        // Check pay_status and handle accordingly
        if (res.data.payment_type === "part") {
          setAmt("");
          setStartDate(null);
        } else if (res.data.payment_type === "full") {
          router.push("/management/rent-unit");
        }
      }
    } catch (err) {
      toast.error("Failed to create part payment");
    } finally {
      setReqLoading(false);
    }
  };

  // TOUR LOGIC
  useEffect(() => {
    if (loading) {
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
  }, [loading, setShouldRenderTour, setPersist, isTourCompleted]);

  // LOADING & ERROR HANDLING
  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;
  //NB:😡🤬💀💀 DO NOT ALTER THE CLASSNAME FOR PARENT DIV AS THEY'RE FOR TOUR GUIDE e.g renewal-fee-wrapper 😡🤬💀💀
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
          gridThree
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
                  amount: unit_data.renewalTenantPrice,
                },
                {
                  name: "Service Charge",
                  amount: unit_data.renew_service_charge,
                },
                {
                  name: isRental ? "Renew VAT Amount" : "VAT Amount",
                  amount: unit_data.renew_vat_amount,
                },
                {
                  name: "Security Fee",
                  amount: unit_data.security_fee,
                },
                {
                  name: "Other Charges",
                  amount: unit_data.renew_other_charge,
                },
              ].filter((fee) => fee.amount !== undefined && fee.amount !== "")}
              currency={unit_data.currency || "naira"}
              total_package={unit_data.renewalTenantTotalPrice as any}
              id={propertyId as string}
            />

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
                      amount: formatFee(UNPAID_INVOICE_PAID_AMOUNT, CURRENCY),
                    },
                    {
                      name: "Balance Due",
                      amount: formatFee(UNPAID_INVOICE.balance_due, CURRENCY),
                    },
                  ]}
                  currency={CURRENCY}
                  total={UNPAID_INVOICE.total_amount}
                  invoice_id={UNPAID_INVOICE.id}
                  unit_id={unit_data.id as string}
                  page="edit"
                />
              </>
            ) : (
              <>
                {PART_PAYMENT_AMOUNT <= 0 && (
                  <>
                    <EditCurrentRent
                      currency={CURRENCY}
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
                      setSelectedCheckboxOptions={setSelectedCheckboxOptions}
                    />

                    <AddPartPayment
                      isRental={isRental}
                      currency={CURRENCY}
                      setStart_Date={setStartDate}
                      action={handlePartPayment}
                      loading={reqLoading}
                      setAmt={setAmt}
                      setIsUpfrontPaymentChecked={setIsUpfrontPaymentChecked}
                      isUpfrontPaymentChecked={isUpfrontPaymentChecked}
                      setSelectedCheckboxOptions={setSelectedCheckboxOptions}
                    />
                  </>
                )}

                {PART_PAYMENT_AMOUNT > 0 && (
                  <CompletePartPayment
                    feeDetails={[
                      {
                        name: "Part Payment",
                        amount: formatFee(PART_PAYMENT_AMOUNT, CURRENCY),
                      },
                      {
                        name: "Balance",
                        amount: formatFee(
                          PENDING_INVOICE_BALANCE_DUE,
                          CURRENCY
                        ),
                      },
                      {
                        name: "Last Updated",
                        amount:
                          unitData?.pending_invoice.last_updated_date ??
                          "__,__,__",
                      },
                    ]}
                    currency={CURRENCY}
                    total={PART_PAYMENT_AMOUNT}
                    setIsCompletePayment={setIsCompletePayment}
                  />
                )}

                {isCompletePayment && (
                  <AddPartPayment
                    isRental={isRental}
                    currency={CURRENCY}
                    setStart_Date={setStartDate}
                    action={handlePartPayment}
                    loading={reqLoading}
                    setAmt={setAmt}
                    isCompletePayment={isCompletePayment}
                    prevAmt={PENDING_INVOICE_BALANCE_DUE.toString()}
                    setIsUpfrontPaymentChecked={setIsUpfrontPaymentChecked}
                    isUpfrontPaymentChecked={true}
                  />
                )}
              </>
            )}
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
              currency={CURRENCY}
              has_part_payment={has_part_payment}
            />
          </div>
        </div>
        <PreviousRentRecords
          isRental={isRental}
          current_records={unit_data.current_records as any}
          unit_id={id as string}
          currency={CURRENCY}
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
