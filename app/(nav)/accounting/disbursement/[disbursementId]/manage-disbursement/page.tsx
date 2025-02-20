"use client";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { empty } from "@/app/config";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import DeleteDisbursementModal from "@/components/Accounting/Disbursement/delete-disbursement-modal";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { currencySymbols } from "@/utils/number-formatter";
import TextArea from "@/components/Form/TextArea/textarea";
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { DeleteIconX } from "@/public/icons/icons";
import DeleteItemWarningModal from "@/components/Accounting/expenses/delete-item-warning-modal";
import { SectionSeparator } from "@/components/Section/section-components";
import { useParams } from "next/navigation";
import {
  addDisburse,
  DisburseApiResponse,
  ManageDisbursementPageData,
  transformDisburseData,
  transformUnitOptions,
} from "./data";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { UnitsApiResponse } from "@/components/Management/Rent And Unit/Edit-Rent/data";
import { AnyAaaaRecord } from "dns";
import { toast, Toaster } from "sonner";

const paymentModes = [
  "Bank Transfer",
  "Cash Deposit",
  "Cash Payment",
  "Wallet",
  "Other Mode of Payment",
];

const ManageDisbursement = () => {
  const { disbursementId } = useParams();
  const [unitsOptions, setUnitsOptions] = useState<any[]>([]);
  const [reqLoading, setReqLoading] = useState(false)
  const [unitId, setUnitId] = useState('')
  const [pageData, setPageData] = useState<ManageDisbursementPageData | null>(
    null
  );
  const CURRENCY_SYMBOL = currencySymbols.naira;
  const [payments, setPayments] = useState<{ title: string; amount: number }[]>(
    []
  );

  const { data, error, loading, refetch } = useFetch<DisburseApiResponse>(
    `/disburses/${disbursementId}`
  );
  useRefetchOnEvent("fetch-disburses", () => refetch({ silent: true }));

  useEffect(() => {
    if (data) {
      const transformed = transformDisburseData(data);
      setPageData(transformed);
      setPayments(
        transformed.disbursement.map((d) => ({
          title: `Unit ${d.unit_id ?? "-- --"}`,
          amount: d.amount,
        }))
      );
    }
  }, [data]);

  const {
    data: unitsData,
    error: unitError,
    loading: loadingUnits,
  } = useFetch<UnitsApiResponse>(`/unit/${pageData?.property_id}/all`);

  useEffect(() => {
    if (unitsData) {
      const unitsTransformOptions = transformUnitOptions(unitsData);
      setUnitsOptions(unitsTransformOptions);
    }
  }, [unitsData]);

  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const handleAddPaymentClick = async() => {
    if (!disbursementId) return toast.warning("Invalid Disbursement Id");
    if (paymentTitle && paymentAmount) {
      // Remove commas and parse the amount as a float
      const parsedAmount = parseFloat(paymentAmount.replace(/,/g, ""));
      if (!isNaN(parsedAmount)) {
        setPayments([
          ...payments,
          { title: paymentTitle, amount: parsedAmount },
        ]);
        setPaymentTitle("");
        setPaymentAmount("");
      }

      const payload = {
        amount: parsedAmount,
        unit_id: paymentTitle,
      }

      // console.log("payload", payload)
      try {
        setReqLoading(true)
        const res = await addDisburse(payload, Number(disbursementId))
        if(res){
          toast.success("Disbursement added successfully")
          window.dispatchEvent(new Event('fetch-disburses'));
        }
      } catch (error) {
        toast.error("Failed to add disbursement. Please try again!")
      }finally{
        setReqLoading(false)
      }
    }
  };


  const handleDeletePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const totalExpenses = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  // deducted payment
  const [deductions, setDeductions] = useState<
    { date: Dayjs; amount: number }[]
  >([]);
  const [deductionDate, setDeductionDate] = useState<Dayjs | null>(null);
  const [deductionAmount, setDeductionAmount] = useState<string>("");

  const handleDeductClick = () => {
    if (deductionDate && deductionAmount) {
      const parsedAmount = parseFloat(deductionAmount.replace(/,/g, ""));
      if (!isNaN(parsedAmount)) {
        setDeductions([
          ...deductions,
          { date: deductionDate, amount: parsedAmount },
        ]);
        setDeductionDate(null);
        setDeductionAmount("");
      }
    }
  };
  const handleDeleteDeduction = (index: number) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  const totalDeductions = deductions.reduce(
    (total, deduction) => total + deduction.amount,
    0
  );

  const totalBalance = totalExpenses - totalDeductions;

  const handleUnitChange = (e: any) => {
    setPaymentTitle(e.target.value);
    setUnitId(e.target.value)
  }

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <ExportPageHeader />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{
              "disbursement id": pageData?.date ?? "--- ---",
              "landlord / landlady name": pageData?.landlord ?? "--- ---",
              "property name": pageData?.property_name ?? "--- ---",
              date: pageData?.date ?? "__,__,__",
              "unit name": pageData?.unit_names ?? "--- ---",
              "disbursement mode": pageData?.disbursement_mode ?? "--- ---",
            }}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "disbursement id": "",
              "landlord / landlady name": "",
              "property name": "",
              date: "",
              "unit name": "",
              "disbursement mode": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Details">
          <div className="w-full max-w-[968px] grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
            <TextArea
              id="transaction-description"
              className="sm:col-span-2"
              inputSpaceClassName="bg-white !h-[120px]"
              defaultValue={pageData?.description ?? ""}
            />
            <Select
              id="disbursement-mode"
              label="disbursement mode"
              placeholder="Bank Transfer"
              options={paymentModes}
              className="self-end"
              inputContainerClassName="bg-white"
              defaultValue={pageData?.disbursement_mode ?? ""}
            />
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Add Disbursement">
          <div className="p-6 custom-flex-col gap-4 bg-white dark:bg-darkText-primary rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] max-w-[968px]">
              <Select
                id="unit"
                label="Unit name"
                required
                placeholder="Select Options"
                options={unitsOptions}
                value={paymentTitle}
                onChange={(v) => setPaymentTitle(v)}
              />
              <Input
                id="amount"
                label="amount"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                // placeholder="300,000"
                value={paymentAmount}
                onChange={(v) => setPaymentAmount(v)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                size="base_medium"
                className="py-2 px-14"
                disabled={reqLoading}
                onClick={handleAddPaymentClick}
              >
               {reqLoading ? "Please wait..." : "add"}
              </Button>
            </div>
          </div>
        </AccountingTitleSection>
        {/* ADDED PAYMENT */}
        <AccountingTitleSection title="Disbursement">
          <div className="space-y-8 bg-white dark:bg-darkText-primary w-full p-6 rounded-lg">
            <div className="w-full max-w-[968px] grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
              {payments.map((payment, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1 capitalize">
                    {payment.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[14px] text-text-secondary dark:text-darkText-2">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(payment.amount)}
                    </p>
                    <Modal>
                      <ModalTrigger aria-label={`Delete ${payment.title}`}>
                        <DeleteIconX />
                      </ModalTrigger>
                      <ModalContent>
                        <DeleteItemWarningModal
                          item={payment.title}
                          amount={payment.amount}
                          handleDelete={() => handleDeletePayment(index)}
                          useCase="disbursement"
                        />
                      </ModalContent>
                    </Modal>
                  </div>
                </div>
              ))}
            </div>
            <SectionSeparator />
            <div className="flex flex-col gap-4">
              <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                Total Expenses
              </p>
              <p className="font-bold text-xl text-brand-9">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(Number(pageData?.total_amount))}
              </p>
            </div>
          </div>
        </AccountingTitleSection>
      </div>
      <FixedFooter className="flex gap-4 items-center justify-between">
        <Modal>
          <ModalTrigger asChild>
            <Button size="base_bold" variant="light_red" className="py-2 px-8">
              delete disbursement
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteDisbursementModal />
          </ModalContent>
        </Modal>
        <div className="flex gap-6">
          <Button size="base_bold" className="py-2 px-8">
            save
          </Button>
        </div>
      </FixedFooter>
    </div>
  );
};

export default ManageDisbursement;
