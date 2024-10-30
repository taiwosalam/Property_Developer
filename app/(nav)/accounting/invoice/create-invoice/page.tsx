"use client";

import Breakdown from "@/components/Accounting/invoice/create-invoice/Breakdown";
import Details from "@/components/Accounting/invoice/create-invoice/Details";
import BackButton from "@/components/BackButton/back-button";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import Button from "@/components/Form/Button/button";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import Picture from "@/components/Picture/picture";
import { SectionSeparator } from "@/components/Section/section-components";
import { LocationIcon } from "@/public/icons/icons";
import { useState } from "react";

const CreateInvoicePage = () => {
  const [checked, setChecked] = useState(false);
  const [checkedd, setCheckedd] = useState(false);
  const [paymentAdded, setPaymentAdded] = useState(false);

  return (
    <section className="space-y-7 pb-20">
      <BackButton>Create New Invoice</BackButton>
      <div
        className="bg-white dark:bg-darkText-primary rounded-[8px] p-6 flex gap-4 items-center justify-between flex-wrap"
        style={{
          boxShadow:
            "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
        }}
      >
        <div
          style={{
            boxShadow:
              "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 4px 6px 0px rgba(13, 23, 33, 0.08)",
          }}
        >
          <Picture
            src={"/empty/logo placeholder.svg"}
            width={300}
            height={100}
          />
        </div>
        <div className="w-fit text-left">
          <p className="text-text-secondary text-sm font-medium dark:text-white">
            Contacts
          </p>
          <div className="text-text-secondary text-sm font-normal dark:text-darkText-1">
            <div className="flex items-center gap-1">
              <LocationIcon color="#0033C4" />
              <span>States and Local Govt.</span>
            </div>
            <div className="flex items-center gap-1">
              <Picture src={"/icons/global-search.svg"} size={16} />
              <span>https://www.hprealestate.co.in1</span>
            </div>
            <div className="flex items-center gap-1">
              <Picture src={"/icons/phone.svg"} size={16} />
              <span>08132086958 || 09123435487 || 9848848488</span>
            </div>
            <div className="flex items-center gap-1">
              <Picture src={"/icons/mail2.svg"} size={16} />
              <span>Email@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Details />
        <div className="flex items-center justify-between max-w-[700px] gap-4">
          <Select
            id="client_name"
            options={["Client Name", "Client Name 2"]}
            label="Client Name"
            className="flex-1"
          />
          <div className="flex-1 self-end">
            <DocumentCheckbox>
              <span className="text-[#3F4247]">
                Click to generate invoive for all tenants and occupants of this
                property
              </span>
            </DocumentCheckbox>
          </div>
        </div>
        <div className="w-full lg:max-w-[50%]">
          <TextArea id="sdjn" label="Description" required />
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h1 className="text-[#092C4C] font-bold text-xl dark:text-white">
            Add Payment
          </h1>
          <Checkbox checked={checkedd} onChange={() => setCheckedd(!checkedd)}>
            <span></span>
          </Checkbox>
        </div>
        <div className="bg-white dark:bg-darkText-primary rounded-[8px] space-y-4 p-6">
          <div className="flex items-center justify-between max-w-[600px] gap-4">
            <Input
              type="text"
              id="payment_title"
              label="Payment Title"
              className="flex-1"
            />
            <div className="flex-1 relative">
              <Input
                type="text"
                id="amount"
                label="Amount"
                className="w-full"
                CURRENCY_SYMBOL={"₦"}
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button
              type="button"
              style={{
                padding: "8px 32px",
              }}
              size="base_medium"
              onClick={() => setPaymentAdded(true)}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      {!paymentAdded ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h1 className="text-[#092C4C] font-bold text-xl dark:text-white">
              Gnerated Rent Breakdown
            </h1>
            <Checkbox checked={checked} onChange={() => setChecked(!checked)}>
              <span></span>
            </Checkbox>
          </div>
          <Breakdown />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h1 className="text-[#092C4C] font-bold text-xl dark:text-white">
              Payment Added
            </h1>
          </div>
          <div className="flex bg-white w-full p-6 rounded-lg flex-col gap-8">
            <div className="w-full max-w-[968px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
              <div className="flex flex-col gap-4">
                <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                  Annual Fee
                </p>
                <p className="font-bold text-[14px] text-brand-9">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })
                    .format(1000000)
                    .split(".")}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                  Service Charge
                </p>
                <p className="font-bold text-[14px] text-brand-9">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })
                    .format(1000000)
                    .split(".")}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                  Total Payment
                </p>
                <p className="font-bold text-[14px] text-brand-9">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })
                    .format(1000000)
                    .split(".")}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                  Tax Charges
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
            <SectionSeparator />
            <div className="flex flex-col gap-4">
              <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                Total Added Payment
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
        </div>
      )}
      <div className="space-y-2 space-x-2 text-[#3F4247] text-sm dark:text-darkText-1">
        {["Notification", "SMS Alert", "Email Alert"].map((option) => (
          <label key={option} className="inline-flex items-center">
            <DocumentCheckbox>
              <span className="text-[#3F4247]">{option}</span>
            </DocumentCheckbox>
          </label>
        ))}
        <p>
          Payment will be reflected on the receipt page once the selected client
          makes a payment for this generated invoice
        </p>
      </div>
      <div className="fixed z-[3] w-screen left-0 h-[80px] bottom-0 py-5 px-[60px] bg-white dark:bg-darkText-primary flex items-center justify-end gap-10 [&>button]:rounded-[4px] font-semibold text-base [&>button]:py-[8px] [&>button]:px-[32px] [&>button]:border-2 [&>button]:border-transparent">
        <button
          type="reset"
          className="bg-brand-1 text-brand-9 hover:bg-brand-2 active:bg-transparent active:border-brand-2 py-2 px-8"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-brand-9 text-white hover:bg-[#0033c4b3] active:text-brand-9 active:bg-transparent active:border-brand-9 py-2 px-8"
        >
          Create
        </button>
      </div>
    </section>
  );
};

export default CreateInvoicePage;
