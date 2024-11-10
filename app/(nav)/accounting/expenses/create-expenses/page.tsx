"use client";

import Details from "@/components/Accounting/invoice/create-invoice/Details";
import BackButton from "@/components/BackButton/back-button";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
// import KeyValueList from "@/components/KeyValueList/key-value-list";
import ExportPageHeader from "@/components/reports/export-page-header";
import { SectionSeparator } from "@/components/Section/section-components";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import TextArea from "@/components/Form/TextArea/textarea";
import { useState } from "react";

const CreateExpensePage = () => {
  const [payments, setPayments] = useState<{ title: string; amount: number }[]>(
    []
  );
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const handleAddPaymentClick = () => {
    if (paymentTitle && paymentAmount) {
      // Remove commas and parse the amount as a float
      const parsedAmount = parseFloat(paymentAmount.replace(/,/g, ""));
      if (!isNaN(parsedAmount)) {
        setPayments([
          ...payments,
          { title: paymentTitle, amount: parsedAmount },
        ]);
        setPaymentTitle("");
        setPaymentAmount("");
      }
    }
  };
  const totalAmount = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );
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
        <div className="space-y-4 max-w-[600px]">
          <Select
            id="client_name"
            options={["Client Name", "Client Name 2"]}
            label="Client Name"
            className="max-w-[300px]"
          />
          <TextArea id="expenses_description" label="Expenses Description" />
        </div>
      </div>
      <div className="space-y-6">
        <h1 className="text-[#092C4C] font-bold text-xl dark:text-white">
          Add Expenses
        </h1>
        <div className="bg-white dark:bg-darkText-primary rounded-[8px] space-y-4 p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[968px]">
            <Input
              type="text"
              id="payment_title"
              label="Payment Title"
              value={paymentTitle}
              onChange={(v) => setPaymentTitle(v)}
            />
            <Input
              type="text"
              id="amount"
              label="Amount"
              className="w-full"
              CURRENCY_SYMBOL={"₦"}
              formatNumber
              value={paymentAmount}
              onChange={(v) => setPaymentAmount(v)}
            />
          </div>
          <div className="flex items-center justify-end">
            <Button
              type="button"
              className="py-2 px-8"
              size="base_medium"
              onClick={handleAddPaymentClick}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      {payments.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-[#092C4C] font-bold text-xl dark:text-white">
            Payment Added
          </h3>

          <div className="flex bg-white dark:bg-darkText-primary w-full p-6 rounded-lg flex-col gap-8">
            <div className="w-full max-w-[968px] grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
              {payments.map((payment, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1 capitalize">
                    {payment.title}
                  </p>
                  <p className="font-bold text-[14px] text-text-secondary dark:text-darkText-2">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(payment.amount)}
                  </p>
                </div>
              ))}
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
                }).format(totalAmount)}
              </p>
            </div>
          </div>
        </div>
      )}
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
