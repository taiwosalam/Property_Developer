"use client";

import Details from "@/components/Accounting/invoice/create-invoice/Details";
import BackButton from "@/components/BackButton/back-button";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import ExportPageHeader from "@/components/reports/export-page-header";
import FixedFooter from "@/components/FixedFooter/fixed-footer";

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[968px]">
          <Select
            id="client_name"
            options={["Client Name", "Client Name 2"]}
            label="Client Name"
          />
          <Input id="unit_name" label="Unit Name" disabled />
          <Input id="expenses_description" label="Expenses Description" />
        </div>
      </div>
      <div className="space-y-6">
        <h1 className="text-[#092C4C] font-bold text-xl dark:text-white">
          Add Expenses
        </h1>
        <div className="bg-white dark:bg-darkText-primary rounded-[8px] space-y-4 p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[968px]">
            <Input type="text" id="payment_title" label="Payment Title" />
            <Input
              type="text"
              id="amount"
              label="Amount"
              className="w-full"
              CURRENCY_SYMBOL={"₦"}
            />
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
          <div className="flex gap-6">
            <KeyValueList
              data={{}}
              direction="column"
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
      <FixedFooter className="flex justify-end gap-4">
        <Button variant="border" size="sm_normal" className="py-2 px-8">
          Cancel
        </Button>
        <Button size="sm_normal" className="py-2 px-8">
          Create
        </Button>
      </FixedFooter>
    </section>
  );
};

export default CreateExpensePage;
