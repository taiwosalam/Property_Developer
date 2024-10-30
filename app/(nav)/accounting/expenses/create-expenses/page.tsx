"use client";

import Breakdown from "@/components/Accounting/expenses/create-expense/Breakdown";
import Details from "@/components/Accounting/invoice/create-invoice/Details";
import BackButton from "@/components/BackButton/back-button";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import Picture from "@/components/Picture/picture";
import ExportPageHeader from "@/components/reports/export-page-header";
import { LocationIcon } from "@/public/icons/icons";

const CreateExpensePage = () => {
  return (
    <section className="space-y-7 pb-[100px]">
      <BackButton>Create New Expense</BackButton>
      <ExportPageHeader
        email="Email@gmail.com"
        location="States and Local Govt."
        logo="/empty/logo placeholder.svg"
        phoneNumbers={["08132086958", "09123435487", "9848848488"]}
        website="https://www.hprealestate.co.in1"
      />
      <div className="space-y-8">
        <Details />
        <div className="flex items-center justify-between w-3/5 gap-4 px-3">
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
        <h1 className="text-[#092C4C] font-bold text-xl dark:text-white">
          Add Expenses
        </h1>
        <div className="bg-white dark:bg-darkText-primary rounded-[8px] space-y-4 p-6">
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
        <h1 className="text-[#092C4C] font-bold text-xl dark:text-white">
          Payment Added
        </h1>
        <section className="bg-white dark:bg-darkText-primary p-8 space-y-4">
          <div className="flex gap-6 2xl:gap-0 flex-col 2xl:flex-row">
            <KeyValueList
              data={{}}
              referenceObject={{
                "annual fee": "",
              }}
            />
          </div>
          <div className="w-full h-[2px] bg-[#C0C2C8] bg-opacity-20" />
          <div>
            <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
              Total Amount
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
        </section>
      </div>
      <div className="fixed z-[3] w-screen left-0 h-[80px] bottom-0 py-5 px-[40px] bg-white dark:bg-darkText-primary flex items-center justify-end gap-4 [&>button]:rounded-[4px] font-semibold text-base">
        <Button variant="border" size="sm_normal" className="py-2 px-8">
          Cancel
        </Button>
        <Button size="sm_normal" className="py-2 px-8">
          Create
        </Button>
      </div>
    </section>
  );
};

export default CreateExpensePage;
