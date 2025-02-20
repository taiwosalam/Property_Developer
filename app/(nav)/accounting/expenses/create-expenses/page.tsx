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
import { useEffect, useState } from "react";
import DeleteItemWarningModal from "@/components/Accounting/expenses/delete-item-warning-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { DeleteIconX } from "@/public/icons/icons";
import { useSearchParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { SinglePropertyResponse, transformSinglePropertyData } from "@/app/(nav)/management/properties/[id]/data";
import { transformUnitOptions, UnitsApiResponse } from "@/components/Management/Rent And Unit/Edit-Rent/data";
import MultiSelect from "@/components/Form/MultiSelect/multiselect";
import MultiSelectObj from "@/components/Form/MultiSelect/multi-select-object";
import { PropertyListResponse } from "@/app/(nav)/management/rent-unit/[id]/edit-rent/type";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { AuthForm } from "@/components/Auth/auth-components";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { createExpense } from "../data";


const CreateExpensePage = () => {
  const companyId = usePersonalInfoStore((state) => state.company_id) || '';
  const [payments, setPayments] = useState<{ payment_title: string; amount: number }[]>(
    []
  );
  const searchParams = useSearchParams();
  const property_id = searchParams.get("p");
  const [reqLoading, setReqLoading] = useState(false)
  const [unitsOptions, setUnitsOptions] = useState<any[]>([]);
  const [unitsSelected, setUnitsSelecetd] = useState<any[]>([])
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const handleAddPaymentClick = () => {
    if (paymentTitle && paymentAmount) {
      // Remove commas and parse the amount as a float
      const parsedAmount = parseFloat(paymentAmount.replace(/,/g, ""));
      if (!isNaN(parsedAmount)) {
        setPayments([
          ...payments,
          { payment_title: paymentTitle, amount: parsedAmount },
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

  const handleDeletePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const [selectedPropertyId, setSelectedPropertyId] = useState('')

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

  //FETCH D PROPERTY DATA
  const { data, loading, error, isNetworkError } =
    useFetch<SinglePropertyResponse>(`property/${selectedPropertyId}/view`);
  const propertyData = data ? transformSinglePropertyData(data) : null;

  // FETCH ALL PROPERTY UNITS
  const {
    data: unitsData,
    error: unitError,
    loading: loadingUnits,
  } = useFetch<UnitsApiResponse>(`/unit/${selectedPropertyId}/all`);

  useEffect(() => {
    if (unitsData) {
      const unitsTransformOptions = transformUnitOptions(unitsData);
      setUnitsOptions(unitsTransformOptions);
    }
  }, [unitsData]);

  // console.log("payments", payments)

  const handleCreateExpense = async (data: Record<string, string>) => {
    const payload = {
      company_id: companyId,
      property_id: 2,
      description: data.expenses_description,
      // unit: data.units,
      unit: unitsSelected,
      payments: payments
    }
    
    try {
      setReqLoading(true)
      const res = await createExpense(objectToFormData(payload))
      if (res){
        toast.success("Expense created Successfully.")
      }
    } catch (error) {
      toast.error("Failed to create expenses, please try again!");
    }finally{
      setReqLoading(false)
    }
  }

  return (
    <section className="space-y-7 pb-[100px]">
      <AuthForm onFormSubmit={handleCreateExpense}>
        <BackButton>Create New Expense</BackButton>
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] max-w-[968px]">
            <Select
              id="property"
              label={`Choose Property`}
              onChange={setSelectedPropertyId}
              options={propertyOptions}
              disabled={propertiesLoading}
              placeholder={
                propertiesLoading
                  ? 'Loading properties...'
                  : propertiesError
                    ? 'Error loading properties'
                    : 'Select property'
              }
              error={propertiesError}
            />
            <MultiSelectObj
              id="units"
              options={unitsOptions}
              onValueChange={setUnitsSelecetd}
              label="Unit Name"
              className="max-w-[300px]"
              placeholder={
                loadingUnits
                  ? 'Loading units...'
                  : propertiesError
                    ? 'Error loading Units'
                    : 'Select Unit'
              }
            />
          </div>

          <div className='max-w-[968px]'>
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
                disabled={reqLoading}
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
                      {payment.payment_title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[14px] text-text-secondary dark:text-darkText-2">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        }).format(payment.amount)}
                      </p>
                      <Modal>
                        <ModalTrigger aria-label={`Delete ${payment.payment_title}`}>
                          <DeleteIconX />
                        </ModalTrigger>
                        <ModalContent>
                          <DeleteItemWarningModal
                            item={payment.payment_title}
                            amount={payment.amount}
                            handleDelete={() => handleDeletePayment(index)}
                            useCase="expenses"
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
          {/* <Button variant="border" size="sm_normal" className="py-2 px-8">
          Cancel
        </Button> */}
          <Button disabled={reqLoading} type="submit" size="sm_normal" className="py-2 px-8">
           {reqLoading ? "Please wait..." : "Create"}
          </Button>
        </FixedFooter>
      </AuthForm>
    </section>
  );
};

export default CreateExpensePage;
