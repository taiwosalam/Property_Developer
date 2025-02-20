"use client";

// Imports
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { EstateDetailItem } from "@/components/Management/Rent And Unit/detail-item";
import { useEffect, useState } from "react";
import {
  DisburseApiResponse,
  ManageDisbursementPageData,
  transformDisburseData,
} from "../manage-disbursement/data";
import { useParams } from "next/navigation";
import { currencySymbols } from "@/utils/number-formatter";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { SectionSeparator } from "@/components/Section/section-components";

const PreviewDisbursement = () => {
  const { disbursementId } = useParams();
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
        <AccountingTitleSection title="Description">
          <p className="text-sm text-text-secondary">
            {pageData?.description ?? "--- ---"}
          </p>
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
      <FixedFooter className="flex flex-wrap gap-6 items-center justify-end">
        <Button variant="sky_blue" size="base_bold" className="py-2 px-8">
          download
        </Button>
        <Button size="base_bold" className="py-2 px-8">
          print
        </Button>
      </FixedFooter>
    </div>
  );
};

export default PreviewDisbursement;
