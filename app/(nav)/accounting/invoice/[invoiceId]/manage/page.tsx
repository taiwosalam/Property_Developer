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
import { currencySymbols } from "@/utils/number-formatter";

const ManageInvoice = () => {
  const CURRENCY_SYMBOL = currencySymbols.naira;

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Manage Invoice</BackButton>
        <ExportPageHeader />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{}}
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
          <p className="font-normal text-[14px] text-[#6C6D6D] dark:text-darkText-1">
            New rent payment for 3 bedroom bungalow at Ajibade road 2, Lekki
            Lagos
          </p>
          <div className="flex">
            <div className="w-full max-w-[968px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
              <Input
                id="annual-rent"
                label="Annual Rent"
                required
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="1,000,000"
                inputClassName="bg-white"
                formatNumber
              />
              <Input
                id="service-charge"
                label="service charge"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="300,000"
                inputClassName="bg-white"
                formatNumber
              />
              <Input
                id="refundable-caution-fee"
                label="refundable caution fee"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="300,000"
                inputClassName="bg-white"
                formatNumber
              />
              <Input
                id="non-refundable-agency-fee"
                label="non refundable agency fee"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="300,000"
                inputClassName="bg-white"
                formatNumber
              />
              <Input
                id="non-refundable-legal-fee"
                label="non refundable legal fee"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="300,000"
                inputClassName="bg-white"
                formatNumber
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
        <Modal>
          <ModalTrigger asChild>
            <Button variant="light_red" size="base_bold" className="py-2 px-8">
              delete invoice
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteInvoiceModal />
          </ModalContent>
        </Modal>

        <Button size="base_bold" className="py-2 px-8">
          save
        </Button>
      </FixedFooter>
    </div>
  );
};

export default ManageInvoice;
