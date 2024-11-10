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

const paymentModes = [
  "Bank Transfer",
  "Cash Deposit",
  "Cash Payment",
  "Wallet",
  "Other Mode of Payment",
];

const ManageDisbursement = () => {
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"];

  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton as="p">Back</BackButton>
        <ExportPageHeader
          logo={empty}
          location="States and Local Govt"
          website="https://realesate.com"
          phoneNumbers={["09022312133", "07012133313", "0901212121"]}
          email="example@mail.com"
        />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "transaction id": "",
              "landlord / landlady name": "",
              "property name": "",
              date: "",
              "account officer": "",
              "disbursement mode": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Transaction Details">
          <div className="w-full max-w-[968px] grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
            <TextArea
              id="transaction-description"
              className="sm:col-span-2"
              inputSpaceClassName="bg-white !h-[120px]"
            />
            <Select
              id="disbursement-mode"
              label="disbursement mode"
              placeholder="Bank Transfer"
              options={paymentModes}
              className="self-end"
              inputContainerClassName="bg-white"
            />
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Add Disbursement">
          <div className="p-6 custom-flex-col gap-4 bg-white dark:bg-darkText-primary rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] max-w-[968px]">
              <Select
                id="tenant"
                label="Tenant/Occupant"
                required
                placeholder="Select Options"
                options={["tenant 1", "tenant 2"]}
              />
              <Input
                id="amount"
                label="amount"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                placeholder="300,000"
              />
            </div>
            <div className="flex justify-end">
              <Button size="base_medium" className="py-2 px-14">
                add
              </Button>
            </div>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Disbursement Details">
          <div className="p-6 flex flex-col xl:flex-row xl:justify-between gap-4 bg-white dark:bg-darkText-primary rounded-lg">
            <div className="xl:flex-1 xl:max-w-[968px] space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
                <KeyValueList
                  data={{}}
                  chunkSize={1}
                  direction="column"
                  referenceObject={{
                    "tenant / occupant": "",
                    "unit no/name": "",
                    "amount disburse": "",
                  }}
                />
              </div>
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
                <KeyValueList
                  data={{}}
                  chunkSize={1}
                  direction="column"
                  referenceObject={{
                    "tenant / occupant": "",
                    "unit no/name": "",
                    "amount disburse": "",
                  }}
                />
              </div>
            </div>
            <div className="space-y-2 self-end">
              <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                Total Disbursement
              </p>
              <p className="font-bold text-xl text-brand-9">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })
                  .format(1000000)
                  .split(".")}
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
