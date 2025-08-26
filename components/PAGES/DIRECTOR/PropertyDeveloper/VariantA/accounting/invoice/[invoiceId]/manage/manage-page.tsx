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
import {
  defaultInvoiceData,
  generateTableDataManageInvoice,
  invoiceManageTableFields,
  transformInvoiceData,
  updateInvoiceStatus,
} from "./data";
import { useParams, useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import ServerError from "@/components/Error/ServerError";
import { toast } from "sonner";
import PendingInvoiceModal from "@/components/Management/Rent And Unit/pending-invoice-modal";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import CustomTable from "@/components/Table/table";

const ManageInvoice = () => {
  const CURRENCY_SYMBOL = currencySymbols.naira;
  const { invoiceId } = useParams();
  const router = useRouter();
  const [reqLoading, setReqLoading] = useState(false);
  const [pageData, setPageData] = useState<InvoicePageData>(defaultInvoiceData);
  const { data, error, loading, isNetworkError, refetch } =
    useFetch<InvoiceResponse>(`/invoice/${invoiceId}`);
  // Listen for the refetch event
  useRefetchOnEvent("refetchRentUnit", () => refetch({ silent: true }));

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
  const IS_PENDING = pageData.status.toLowerCase() === "pending";
  const UNIT_ID = pageData.unit_id;

  const UnitKeyValData = {
    "invoice id": pageData.invoice_id,
    "property name": pageData.property_name,
    "unit name": pageData.unit_name,
    date: pageData.invoice_date,
    status: pageData.status,
    "unit id": pageData.unit_id,
  };

  const NoUnitKeyValData = {
    "invoice id": pageData.invoice_id,
    "property name": pageData.property_name,
    "client name": pageData.client_name,
    date: pageData.invoice_date,
    status: pageData.status,
    "Auto Generate": pageData.auto_generate,
  };

  const UnitRefObj = {
    "invoice id": "",
    "unit name": "",
    "property name": "",
    date: "",
    status: "",
    "unit id": "",
  };

  const NoUnitRefObj = {
    "invoice id": "",
    "property name": "",
    "client name": "",
    "Auto Generate": "",
    date: "",
    status: "",
  };

  const handlePaidClick = async () => {
    const INVOICE_ID = Number(invoiceId);
    try {
      setReqLoading(true);
      const res = await updateInvoiceStatus(INVOICE_ID, {
        _method: "PUT",
      });
      if (res) {
        toast.success("Invoice updated successfully");
        router.push("/accounting/invoice");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setReqLoading(false);
    }
  };

  if (loading) return <PageCircleLoader />;
  if (error) return <ServerError error={error} />;
  if (isNetworkError) return <NetworkError />;

  const KEY_VALUE_DATA = UNIT_ID ? UnitKeyValData : NoUnitKeyValData;
  const KEY_VALUE_REF_OBJ = UNIT_ID ? UnitRefObj : NoUnitRefObj;
  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Manage Invoice</BackButton>
        <ExportPageHeader />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{
              "invoice id": "6736878",
              "property name": "House On Hill",
              "account officer": "Ajadi Kola",
              "customer name": "Kunle Afod",
              date: "12 July 1990",
              "unit id": "767638932",
            }}
            direction={"column"}
            chunkSize={2}
            referenceObject={{
              "invoice id": "",
              "property name": "",
              "account officer": "",
              "customer name": "",
              date: "",
              "unit id": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Details">
          <CustomTable
            fields={invoiceManageTableFields}
            //displayTableHead={false}
            data={generateTableDataManageInvoice(4)}
            //tableHeadStyle={{ height: "76px" }}
            //tableHeadCellSx={{ fontSize: "1rem" }}
          />

          <div className="flex justify-center items-center py-8">
            <p className="text-slate-400">
              {" "}
              <span className="text-red-500">*</span>Receipts with payment
              cannot be edited deleted
            </p>
          </div>
          
         
        </AccountingTitleSection>
      </div>
      <FixedFooter className="flex items-center justify-between gap-4">
        {/* {!IS_PAID && ( */}

        <Modal>
          <ModalTrigger asChild>
            <Button variant="light_red" size="base_bold" className="py-2 px-8">
              delete invoice
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteInvoiceModal invoiceId={String(invoiceId)} />
          </ModalContent>
        </Modal>

        <div className="flex items-center gap-2 ml-auto">
          <>
            <Modal>
              <ModalTrigger asChild>
                <Button
                  variant="light_green"
                  size="base_bold"
                  className="py-2 px-8"
                  type="button"
                  //onClick={handlePaidClick}
                  disabled={reqLoading}
                >
                  Exit
                </Button>
              </ModalTrigger>

              <ModalContent>
                <PendingInvoiceModal
                  invoice_id={Number(invoiceId)}
                  page="invoice"
                />
              </ModalContent>
            </Modal>

            <Button
              type="button"
              size="base_bold"
              className="py-2 px-8 self-end"
              //onClick={() => router.push("/accounting/invoice")}
            >
              Save
            </Button>
          </>
        </div>
      </FixedFooter>
    </div>
  );
};

export default ManageInvoice;
