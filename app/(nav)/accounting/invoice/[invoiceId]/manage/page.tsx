"use client";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import DeleteInvoiceModal from "@/components/Accounting/invoice/delete-invoice-modal";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import Breakdown from "@/components/Accounting/invoice/create-invoice/Breakdown";
import { useEffect, useState } from "react";
import { InvoicePageData, InvoiceResponse } from "./types";
import { defaultInvoiceData, transformInvoiceData } from "./data";
import { useParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import ServerError from "@/components/Error/ServerError";

const ManageInvoice = () => {
  const CURRENCY_SYMBOL = currencySymbols.naira;
  const { invoiceId } = useParams();
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

  const IS_PAID = pageData.status.toLowerCase() === "paid";

  if (loading) return <PageCircleLoader />;
  if (error) return <ServerError error={error} />;
  if (isNetworkError) return <NetworkError />;

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Manage Invoice</BackButton>
        <ExportPageHeader />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{
              "invoice id": pageData.invoice_id,
              "property name": pageData.property_name,
              "unit name": pageData.unit_name,
              date: pageData.invoice_date,
              status: pageData.status,
              "unit id": pageData.unit_id,
            }}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "invoice id": "",
              "unit name": "",
              "property name": "",
              date: "",
              status: "",
              "unit id": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Details">
          <p className="font-normal text-[14px] text-[#6C6D6D] dark:text-darkText-1">
            New rent payment for {pageData.unit_name}
          </p>
          <div>
            <Breakdown data={pageData} />
          </div>
          <div className="flex">
            <div className="w-full max-w-[968px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
              <Input
                id="annual-rent"
                label="Annual Rent"
                required
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                inputClassName="bg-white"
                formatNumber
                disabled={IS_PAID}
                defaultValue={safeFormatNumber(pageData.annual_fee as number)}
              />
              <Input
                id="service-charge"
                label="service charge"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                inputClassName="bg-white"
                formatNumber
                defaultValue={safeFormatNumber(
                  pageData.service_charge as number
                )}
                disabled={IS_PAID}
              />
              <Input
                id="refundable-caution-fee"
                label="refundable caution fee"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                inputClassName="bg-white"
                formatNumber
                disabled={IS_PAID}
                defaultValue={safeFormatNumber(pageData.caution_fee as number)}
              />
              <Input
                id="non-refundable-agency-fee"
                label="non refundable agency fee"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                inputClassName="bg-white"
                formatNumber
                disabled={IS_PAID}
                defaultValue={safeFormatNumber(pageData.agency_fee as number)}
              />
              <Input
                id="non-refundable-legal-fee"
                label="non refundable legal fee"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                inputClassName="bg-white"
                formatNumber
                disabled={IS_PAID}
                // defaultValue={formatNumber(pageData.) as string}
              />
            </div>
          </div>
          <p className="font-normal text-[14px] text-[#6C6D6D] dark:text-darkText-1">
            <span className="text-status-error-primary text-2xl">*</span>
            Invoices with payment cannot be edited or deleted.
          </p>
        </AccountingTitleSection>
      </div>
      <FixedFooter className="flex items-center justify-between gap-4">
        {!IS_PAID && (
          <Modal>
            <ModalTrigger asChild>
              <Button
                variant="light_red"
                size="base_bold"
                className="py-2 px-8"
              >
                delete invoice
              </Button>
            </ModalTrigger>
            <ModalContent>
              <DeleteInvoiceModal />
            </ModalContent>
          </Modal>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {pageData.is_auto ? (
            <Button size="base_bold" className="py-2 px-8">
              Back
            </Button>
          ) : (
            <>
              {!IS_PAID && (
                <Button
                  variant="light_green"
                  size="base_bold"
                  className="py-2 px-8"
                >
                  Paid
                </Button>
              )}
              <Button size="base_bold" className="py-2 px-8 self-end">
                Save
              </Button>
            </>
          )}
        </div>
      </FixedFooter>
    </div>
  );
};

export default ManageInvoice;
