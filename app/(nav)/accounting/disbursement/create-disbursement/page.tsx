"use client";

import Breakdown from "@/components/Accounting/invoice/create-invoice/Breakdown";
import Details from "@/components/Accounting/invoice/create-invoice/Details";
import BackButton from "@/components/BackButton/back-button";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { SectionSeparator } from "@/components/Section/section-components";
import { empty } from "@/app/config";
import { useEffect, useState } from "react";
import ExportPageHeader from "@/components/reports/export-page-header";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import DeleteItemWarningModal from "@/components/Accounting/expenses/delete-item-warning-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { DeleteIconX } from "@/public/icons/icons";
import { currencySymbols } from "@/utils/number-formatter";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import useFetch from "@/hooks/useFetch";
import { PropertyListResponse } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/type";
import {
  transformUnitOptions,
  UnitsApiResponse,
} from "@/components/Management/Rent And Unit/Edit-Rent/data";
import { AuthForm } from "@/components/Auth/auth-components";
import { toast } from "sonner";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { createDisbursement } from "../data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { useRouter } from "next/navigation";

const paymentModes = [
  { label: "Bank Transfer", value: "bank transfer" },
  { label: "Cash Deposit", value: "cash deposit" },
  { label: "Cash Payment", value: "cash payment" },
  { label: "Wallet", value: "wallet" },
  { label: "Other Mode of Payment", value: "other mode" },
];

const CreateDisbursement = () => {
  const router = useRouter();
  const companyId = usePersonalInfoStore((state) => state.company_id) || "";
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [reqLoading, setReqLoading] = useState(false);

  const {
    data: propertyOptionData,
    error: propertiesError,
    loading: propertiesLoading,
  } = useFetch<PropertyListResponse>("/property/all");

  const propertyOptions =
    propertyOptionData?.data.map((p) => ({
      value: p.id,
      label: p.title,
    })) || [];

  // FETCH ALL PROPERTY UNITS
  const {
    data: unitsData,
    error: unitError,
    loading: loadingUnits,
  } = useFetch<UnitsApiResponse>(`/unit/${selectedPropertyId}/all`);

  const UnitsOptions =
    unitsData?.data
      .filter((unit) => unit.is_active === "vacant")
      .map((unit) => ({
        // value: unit.id.toString(),
        value: unit.unit_name,
        label: unit.unit_name,
      })) ?? [];

  const [isAddPaymentChecked, setIsAddPaymentChecked] = useState(true);
  const [isSelectDisabled, setIsSelectDisabled] = useState(false);
  const handleGenerateInvoiceCheckboxChange = (checked: boolean) => {
    setIsSelectDisabled(checked);
  };

  // Two separate arrays for each payment type
  const [payments, setPayments] = useState<{ title: string; amount: number }[]>(
    []
  );
  const [unitPayments, setUnitPayments] = useState<
    { title: string; amount: number }[]
  >([]);
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  // Use the appropriate array based on isAddPaymentChecked
  const handleAddPaymentClick = () => {
    if (!paymentTitle || !paymentAmount) {
      return toast.warning("Please fill both payment title and payment amount");
    }
    if (paymentTitle && paymentAmount) {
      // Remove commas and parse the amount as a float
      const parsedAmount = parseFloat(paymentAmount.replace(/,/g, ""));
      if (!isNaN(parsedAmount)) {
        if (isAddPaymentChecked) {
          setPayments([
            ...payments,
            { title: paymentTitle, amount: parsedAmount },
          ]);
        } else {
          setUnitPayments([
            ...unitPayments,
            { title: paymentTitle, amount: parsedAmount },
          ]);
        }
        setPaymentTitle("");
        setPaymentAmount("");
      }
    }
  };

  // Handle deletion based on isAddPaymentChecked flag
  const handleDeletePayment = (index: number) => {
    if (isAddPaymentChecked) {
      setPayments(payments.filter((_, i) => i !== index));
    } else {
      setUnitPayments(unitPayments.filter((_, i) => i !== index));
    }
  };

  // Determine which payment list to display
  const displayedPayments = isAddPaymentChecked ? payments : unitPayments;
  const totalAmount = displayedPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );
  const CURRENCY_SYMBOL = currencySymbols.naira;

  // FUNCTION TO CREATE DISBURSEMENT
  const handleCreateDisbursement = async (data: Record<string, string>) => {
    const payload = {
      company_id: companyId,
      property_id: data.property,
      description: data.description,
      disburse_mode: data.disbursement_mode?.toLowerCase(), // 'bank transfer', 'wallet', 'cash deposit', 'bank deposit', 'other mode'
      disbursement: isAddPaymentChecked ? payments : unitPayments,
    };
    try {
      setReqLoading(true);
      const res = await createDisbursement(objectToFormData(payload));
      if (res) {
        toast.success("Disbursement Created Successfully");
        router.back();
      }
    } catch (error) {
      toast.error("Failed to create disbursement. Please try again!");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <section className="space-y-7 pb-20">
      <AuthForm onFormSubmit={handleCreateDisbursement}>
        <BackButton>Create New Disbursement</BackButton>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] max-w-[968px]">
            <Select
              required
              id="property"
              label="property"
              onChange={setSelectedPropertyId}
              options={propertyOptions}
              disabled={propertiesLoading}
              placeholder={
                propertiesLoading
                  ? "Loading properties..."
                  : propertiesError
                  ? "Error loading properties"
                  : "Select property"
              }
              error={propertiesError}
            />
            <Select
              id="disbursement_mode"
              label="disbursement mode"
              placeholder="Select Options"
              options={paymentModes}
              className="self-end"
              inputContainerClassName="bg-white"
            />
          </div>
          <TextArea
            id="description"
            label="Disbursement Description"
            required
            className="lg:max-w-[50%]"
          />
        </div>

        <div className="space-y-6">
          <div className="flex gap-1 flex-col mt-4">
            <div className="flex gap-2">
              <h3 className="text-[#092C4C] font-bold text-xl dark:text-white">
                Add Property Disbursement
              </h3>
              <Checkbox
                radio
                checked={isAddPaymentChecked}
                onChange={() => setIsAddPaymentChecked(true)}
              />
            </div>
            <p>
              Select this option if you are recording a disbursement for the
              entire property, and assign a payment title based on the event.
            </p>
          </div>
          {isAddPaymentChecked && (
            <div className="bg-white dark:bg-darkText-primary rounded-[8px] space-y-4 p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  type="text"
                  id="payment_title"
                  label="Payment Title"
                  value={paymentTitle}
                  onChange={(value) => setPaymentTitle(value as string)}
                />
                <Input
                  type="text"
                  id="amount"
                  label="Amount"
                  className="w-full"
                  CURRENCY_SYMBOL={"₦"}
                  formatNumber
                  value={paymentAmount}
                  // defaultValue={paymentAmount}
                  onChange={(value) => setPaymentAmount(value as string)}
                />
              </div>
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  size="base_medium"
                  className="py-2 px-8"
                  onClick={handleAddPaymentClick}
                >
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex gap-1 flex-col">
            <div className="flex gap-2">
              <h3 className="text-[#092C4C] font-bold text-xl dark:text-white">
                Add Unit Disbursement
              </h3>
              <Checkbox
                radio
                checked={!isAddPaymentChecked}
                onChange={() => setIsAddPaymentChecked(false)}
              />
            </div>
            <p>
              Select this option if you are disbursing payment for a specific
              unit or multiple units within the same property.
            </p>
          </div>
          {!isAddPaymentChecked && (
            <div className="p-6 custom-flex-col gap-4 bg-white dark:bg-darkText-primary rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] max-w-[968px]">
                <Select
                  id="unit"
                  label="Unit name"
                  options={UnitsOptions}
                  placeholder={
                    loadingUnits
                      ? "Loading units..."
                      : unitError
                      ? "Error loading units"
                      : "Select unit"
                  }
                  error={propertiesError}
                  value={paymentTitle}
                  onChange={(v) => {
                    const selectedOption = UnitsOptions.find(
                      (option) => option.value === v
                    );
                    // setUnitId(v);
                    setPaymentTitle(selectedOption ? selectedOption.label : "");
                  }}
                  // onChange={(v) => setPaymentTitle(v)}
                />
                <Input
                  id="amount"
                  label="Amount"
                  CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                  value={paymentAmount}
                  onChange={(v) => setPaymentAmount(v as string)}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="base_medium"
                  className="py-2 px-14"
                  onClick={handleAddPaymentClick}
                >
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>

        {displayedPayments.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-[#092C4C] font-bold text-xl dark:text-white">
              Payment Added
            </h3>

            <div className="flex bg-white dark:bg-darkText-primary w-full p-6 rounded-lg flex-col gap-8">
              <div className="w-full max-w-[968px] grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
                {displayedPayments.map((payment, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1 capitalize">
                      {payment.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[14px] text-text-secondary dark:text-darkText-2">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        }).format(payment.amount)}
                      </p>
                      <Modal>
                        <ModalTrigger aria-label={`Delete ${payment.title}`}>
                          <DeleteIconX />
                        </ModalTrigger>
                        <ModalContent>
                          <DeleteItemWarningModal
                            item={payment.title}
                            amount={payment.amount}
                            handleDelete={() => handleDeletePayment(index)}
                            useCase="invoices"
                          />
                        </ModalContent>
                      </Modal>
                    </div>
                  </div>
                ))}
              </div>
              <SectionSeparator />
              <div className="flex flex-col gap-4">
                <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                  Total Disbursement
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

        <FixedFooter className="flex items-center justify-end gap-4">
          <Button
            type="button"
            className="py-2 px-8"
            size="base_medium"
            variant="sky_blue"
          >
            Cancel
          </Button>
          <Button type="submit" className="py-2 px-8" size="base_medium">
            {reqLoading ? "Please wait..." : "Create"}
          </Button>
        </FixedFooter>
      </AuthForm>
    </section>
  );
};

export default CreateDisbursement;
