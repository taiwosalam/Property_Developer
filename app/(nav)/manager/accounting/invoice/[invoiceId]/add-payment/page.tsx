"use client";

import { useEffect, useState } from "react";

// Imports
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import Input from "@/components/Form/Input/input";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import {
  currencySymbols,
  formatCostInputValue,
  formatNumber,
} from "@/utils/number-formatter";
import { useParams } from "next/navigation";
import { defaultInvoiceData, transformInvoiceData } from "../manage/data";
import { InvoicePageData, InvoiceResponse } from "../manage/types";
import useFetch from "@/hooks/useFetch";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";
import DeleteItemWarningModal from "@/components/Accounting/expenses/delete-item-warning-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { DeleteIconX } from "@/public/icons/icons";
import { SectionSeparator } from "@/components/Section/section-components";
import { toast } from "sonner";

type MoneyField =
  | "annualRent"
  | "serviceCharge"
  | "refundableCautionFee"
  | "nonRefundableAgencyFee"
  | "nonRefundableLegalFee"
  | "amount";

interface Payment {
  title: string;
  amount: number;
}

const PreviewExpenses = () => {
  const CURRENCY_SYMBOL = currencySymbols.naira; // to be dynamic
  const { invoiceId } = useParams();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [pageData, setPageData] = useState<InvoicePageData>(defaultInvoiceData);
  const { data, error, loading, isNetworkError } = useFetch<InvoiceResponse>(
    `/invoice/${invoiceId}`
  );

  // Helper function to safely format numbers
  const safeFormatNumber = (value: number | undefined | null): string => {
    if (typeof value !== "number" || isNaN(value)) {
      return ""; // Return empty string as fallback
    }
    return formatNumber(value);
  };

  useEffect(() => {
    if (data) {
      setPageData(transformInvoiceData(data.data));
    }
  }, [data]);

  const [inputValues, setInputValues] = useState<Record<MoneyField, string>>({
    annualRent: safeFormatNumber(Number(pageData.annual_fee)),
    serviceCharge: safeFormatNumber(Number(pageData.service_charge)),
    refundableCautionFee: safeFormatNumber(Number(pageData.caution_fee)),
    nonRefundableAgencyFee: safeFormatNumber(Number(pageData.agency_fee)),
    nonRefundableLegalFee: safeFormatNumber(Number(pageData.legal_fee)),
    amount: "",
  });

  useEffect(() => {
    setInputValues({
      annualRent: safeFormatNumber(Number(pageData.annual_fee)),
      serviceCharge: safeFormatNumber(Number(pageData.service_charge)),
      refundableCautionFee: safeFormatNumber(Number(pageData.caution_fee)),
      nonRefundableAgencyFee: safeFormatNumber(Number(pageData.agency_fee)),
      nonRefundableLegalFee: safeFormatNumber(Number(pageData.legal_fee)),
      amount: "",
    });
  }, [pageData]);

  const handleInputChange = (field: MoneyField, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [field]: formatCostInputValue(value),
    }));
  };

  console.log("page data", pageData);

  const handleAddPaymentClick = async () => {
    if (paymentTitle && paymentAmount) {
      const parsedAmount = parseFloat(paymentAmount.replace(/,/g, ""));
      if (!isNaN(parsedAmount)) {
        const newPayment = { title: paymentTitle, amount: parsedAmount };
        setPayments([...payments, newPayment]);
        setPaymentTitle("");
        setPaymentAmount("");
        //     const payload = {
        //       amount: parsedAmount,
        //       payment_title: paymentTitle,
        //     };
        //     try {
        //       setReqLoading(true);
        //       const res = await addInvoicePayment(
        //         objectToFormData(payload),
        //         Number(invoiceId)
        //       );
        //       if (res) {
        //         toast.success("Payment added successfully");
        //         window.dispatchEvent(new Event("fetch-invoice"));
        //       }
        //     } catch (error) {
        //       toast.error("Failed to add payment. Please try again!");
        //       setPayments(payments.filter((p) => p !== newPayment));
        //     } finally {
        //       setReqLoading(true);
        //     }
        //   } else {
        //     toast.error("Invalid amount entered");
      }
    } else {
      toast.warning("Please fill in both payment title and amount");
    }
  };

  const handleDeletePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const totalPayment = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  if (loading) return <PageCircleLoader />;
  if (error) return <ServerError error={error} />;
  if (isNetworkError) return <NetworkError />;

  return (
    <div className="custom-flex-col gap-10 pb-28">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Add Payment</BackButton>
        <ExportPageHeader />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex">
          <KeyValueList
            data={{
              "invoice id": pageData.invoice_id,
              "property name": pageData.property_name,
              "unit name": pageData.unit_name,
              date: pageData.invoice_date,
              "account officer": pageData.account_officer,
              "unit id": pageData.unit_id,
            }}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "invoice id": "",
              "unit name": "",
              "property name": "",
              date: "",
              "account officer": "",
              "unit id": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Details">
          <p className="font-normal text-[14px] text-[#6C6D6D] dark:text-white">
            New rent payment for {pageData.unit_name}
          </p>
          <div className="flex">
            <div className="w-full max-w-[968px] grid grid-cols-3 gap-x-[34px] gap-y-6">
              <Input
                id="annual-rent"
                label="Annual Rent"
                required
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                inputClassName="bg-white"
                value={inputValues.annualRent}
                onChange={(value) =>
                  handleInputChange("annualRent", value as string)
                }
              />
              <Input
                id="service-charge"
                label="service charge"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                inputClassName="bg-white"
                value={inputValues.serviceCharge}
                onChange={(value) =>
                  handleInputChange("serviceCharge", value as string)
                }
              />
              <Input
                id="refundable-caution-fee"
                label="refundable caution fee"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                inputClassName="bg-white"
                value={inputValues.refundableCautionFee}
                onChange={(value) =>
                  handleInputChange("refundableCautionFee", value as string)
                }
              />
              <Input
                id="non-refundable-agency-fee"
                label="non refundable agency fee"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                inputClassName="bg-white"
                value={inputValues.nonRefundableAgencyFee}
                onChange={(value) =>
                  handleInputChange("nonRefundableAgencyFee", value as string)
                }
              />
              <Input
                id="non-refundable-legal-fee"
                label="non refundable legal fee"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                inputClassName="bg-white"
                value={inputValues.nonRefundableLegalFee}
                onChange={(value) =>
                  handleInputChange("nonRefundableLegalFee", value as string)
                }
              />
            </div>
          </div>
          <div className="w-full h-[2px] bg-opacity-20 bg-[#C0C2C8]" />
          <div className="flex-1 text-base font-medium capitalize custom-flex-col gap-1">
            <p className="text-[#747474] dark:text-white">total payment</p>
            <p className="text-brand-primary text-xl font-bold">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(Number(pageData.total_package))}
            </p>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Add Payment">
          <div className="p-6 custom-flex-col gap-4 bg-white dark:bg-darkText-primary rounded-lg">
            <div className="grid grid-cols-3 gap-[18px]">
              <Input
                id="payment-title"
                label="payment title"
                value={paymentTitle}
                onChange={(value) => setPaymentTitle(value as string)}
              />
              <Input
                id="amount"
                label="amount"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                inputClassName="bg-white"
                formatNumber
                value={paymentAmount}
                onChange={(value) => setPaymentAmount(value as string)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                size="base_medium"
                onClick={handleAddPaymentClick}
                className="py-2 px-14"
              >
                add
              </Button>
            </div>
          </div>
        </AccountingTitleSection>

        {payments.length > 0 && (
          <AccountingTitleSection title="Payments">
            <div className="space-y-8 bg-white dark:bg-darkText-primary w-full p-6 rounded-lg">
              <div className="w-full max-w-[968px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
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
                            useCase="payments"
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
                  Total Payments
                </p>
                <p className="font-bold text-xl text-brand-9">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(totalPayment)}
                </p>
              </div>
            </div>
          </AccountingTitleSection>
        )}
      </div>
      <FixedFooter className="flex items-center justify-between">
        <p className="text-brand-9 text-[14px] font-normal">
          <span className="text-status-error-primary text-2xl">*</span>You
          cannot add payment to paid receipts.
        </p>
        <Button size="base_medium" className="py-2 px-8">
          Save
        </Button>
      </FixedFooter>
    </div>
  );
};

export default PreviewExpenses;
