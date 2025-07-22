"use client";

// Imports
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import BackButton from "@/components/BackButton/back-button";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ManageExpenseApiResponse,
  ManageExpensePageData,
  transformManageExpenseData,
} from "../manage-expenses/data";
import { Dayjs } from "dayjs";
import useFetch from "@/hooks/useFetch";
import { SectionSeparator } from "@/components/Section/section-components";
import { format } from "date-fns";
import ExportPageFooter from "@/components/reports/export-page-footer";
import CardsLoading from "@/components/Loader/CardsLoading";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";

const PreviewExpenses = () => {
  const { expenseId } = useParams();
  const exportRef = useRef<HTMLDivElement>(null);
  const [pageData, setPageData] = useState<ManageExpensePageData | null>(null);
  const [payments, setPayments] = useState<{ title: string; amount: number }[]>(
    pageData?.payments || []
  );
  const [deductions, setDeductions] = useState<
    { date: Dayjs; amount: number }[]
  >(pageData?.deductions || []);
  const { data, error, loading, refetch, isNetworkError } = useFetch<ManageExpenseApiResponse>(
    `/expenses/${expenseId}`
  );

  useEffect(() => {
    if (data) {
      setPageData(transformManageExpenseData(data));
    }
  }, [data]);

  useEffect(() => {
    if (pageData && pageData.payments) {
      setPayments(pageData.payments);
    }
  }, [pageData]);

  // Update deductions when pageData changes
  useEffect(() => {
    if (pageData?.deductions) {
      setDeductions(pageData.deductions);
    }
  }, [pageData]);

  if (loading)
    return (
      <div className="custom-flex-col gap-2">
        <CardsLoading length={5} />
      </div>
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-10 pb-28">
      <div className="custom-flex-col gap-[18px]">
        <BackButton>Back</BackButton>
        <div ref={exportRef} className="space-y-9">
          <ExportPageHeader />
          <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
            <KeyValueList
              data={{
                "Expenses id": pageData?.expenseDetails.paymentId,
                // "account officer": pageData?.expenseDetails.customerName,
                "property name": pageData?.expenseDetails.propertyName,
                date: pageData?.expenseDetails.date,
                "unit ID": pageData?.expenseDetails.unitId,
              }}
              chunkSize={1}
              direction="column"
              referenceObject={{
                "Expenses id": "",
                // "Customer name": "",
                "property name": "",
                date: "",
                // "account officer": "",
                "unit ID": "",
              }}
            />
          </div>
          <AccountingTitleSection title="Description">
            <p className="text-sm text-text-secondary">
              {pageData?.description}
            </p>
          </AccountingTitleSection>
          <AccountingTitleSection title="Expenses Details">
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
                  }).format(pageData?.stats?.totalAmount ?? 0)}
                </p>
              </div>
            </div>
          </AccountingTitleSection>
          {deductions.length > 0 && (
            <AccountingTitleSection title="Deducted Payment">
              <div className="flex bg-white dark:bg-darkText-primary w-full p-6 rounded-lg flex-col gap-8">
                <div className="w-full max-w-[968px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
                  {deductions.map((deduction, index) => (
                    <div key={index} className="flex flex-col gap-4">
                      <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                        {format(deduction.date.toDate(), "dd MMMM yyyy")}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[14px] text-text-secondary dark:text-darkText-2">
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          }).format(deduction.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <SectionSeparator />
                <div className="flex flex-col gap-4">
                  <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                    Total Deductions
                  </p>
                  <p className="font-bold text-xl text-brand-9">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(pageData?.stats?.totalDeducted ?? 0)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6">
                <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                  Total Balance
                </p>
                <p className="font-bold text-xl text-brand-9">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(pageData?.stats?.totalBalance ?? 0)}
                </p>
              </div>
            </AccountingTitleSection>
          )}
        </div>
      </div>
      <ExportPageFooter printRef={exportRef} />
    </div>
  );
};

export default PreviewExpenses;
