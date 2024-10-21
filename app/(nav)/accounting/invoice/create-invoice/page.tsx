"use client";

import Breakdown from "@/components/Accounting/invoice/create-invoice/Breakdown";
import Details from "@/components/Accounting/invoice/create-invoice/Details";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import Button from "@/components/Form/Button/button";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import Picture from "@/components/Picture/picture";
import { LocationIcon } from "@/public/icons/icons";

const CreateInvoicePage = () => {
  return (
    <section className="space-y-7 pb-20">
      <h1 className="font-medium text-2xl">Create New Invoice</h1>
      <div
        className="bg-white rounded-[8px] p-6 flex gap-4 items-center justify-between flex-wrap"
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
          <p className="text-text-secondary text-sm font-medium">Contacts</p>
          <div className="text-text-secondary text-sm font-normal">
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
      <div className="space-y-4">
        <Details />
        <div className="flex items-center justify-between max-w-[600px] gap-4">
          <Select
            id="client_name"
            options={["Client Name", "Client Name 2"]}
            label="Client Name"
            className="flex-1"
          />
          <Input id="unit_id" label="Unit ID" className="flex-1" />
        </div>
      </div>
      <div className="space-y-6">
        <h1 className="text-[#092C4C] font-bold text-xl">Add Payment</h1>
        <div className="bg-white rounded-[8px] space-y-4 p-6">
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
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <h1 className="text-[#092C4C] font-bold text-xl">Breakdown</h1>
        <Breakdown />
      </div>
      <div className="space-y-2 space-x-2 text-[#3F4247] text-sm">
        {["Notification", "SMS Alert", "Email Alert"].map((option) => (
          <label key={option} className="inline-flex items-center">
            <DocumentCheckbox>
              <span className="text-[#3F4247]">{option}</span>
            </DocumentCheckbox>
          </label>
        ))}
        <p>Fee will reflect upon making payment for the generated invoice</p>
      </div>
      <div className="fixed z-[3] w-screen left-0 h-[80px] bottom-0 py-5 px-[60px] bg-white flex items-center justify-end gap-10 [&>button]:rounded-[4px] font-semibold text-base [&>button]:py-[8px] [&>button]:px-[32px] [&>button]:border-2 [&>button]:border-transparent">
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
