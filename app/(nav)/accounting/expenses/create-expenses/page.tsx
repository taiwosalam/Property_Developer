"use client";

import Breakdown from "@/components/Accounting/expenses/create-expense/Breakdown";
import Details from "@/components/Accounting/invoice/create-invoice/Details";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import Picture from "@/components/Picture/picture";
import { LocationIcon } from "@/public/icons/icons";

const CreateExpensePage = () => {
  return (
    <section className="space-y-7 pb-20">
      <h1 className="font-medium text-2xl">Create New Expense</h1>
      <div
        className="bg-white rounded-[8px] p-6 flex items-center justify-between flex-wrap"
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
        <div className="flex items-center justify-between w-3/5 gap-4">
          <Select
            id="client_name"
            options={["Client Name", "Client Name 2"]}
            label="Client Name"
            className="w-1/2"
          />
          <Input id="unit_id" label="Unit ID" className="w-1/2" />
        </div>
      </div>
      <div className="space-y-6">
        <h1 className="text-[#092C4C] font-bold text-xl">Add Payment</h1>
        <div className="bg-white rounded-[8px] space-y-4 p-6">
          <div className="flex items-center justify-between w-3/5 gap-4">
            <Input
              type="text"
              id="payment_title"
              label="Payment Title"
              className="w-1/2"
            />
            <div className="w-1/2 relative">
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

export default CreateExpensePage;
