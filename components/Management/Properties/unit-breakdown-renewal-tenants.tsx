import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { rentPeriods } from "@/data";
import { useAddUnitStore } from "@/store/add-unit-store";
import { useState, useEffect } from "react";
import { DeleteIconX } from "@/public/icons/icons";
import {
  formatCostInputValue,
  currencySymbols,
  formatNumber,
} from "@/utils/number-formatter";
import { useUnitForm } from "./unit-form-context";

const emptyStateValues = {
  rentAmount: "",
  otherCharges: "",
  serviceCharge: "",
  totalPackage: "",
};

const UnitBreakdownRenewalTenant = () => {
  const { formResetKey } = useUnitForm();
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  const CURRENCY_SYMBOL =
    currencySymbols[propertySettings?.currency || "naira"];
  const [otherChargesInput, setOtherChargesInput] = useState(false);
  const [formValues, setFormValues] = useState(emptyStateValues);
  const { rentAmount, serviceCharge, totalPackage, otherCharges } = formValues;
  type FormField = keyof typeof formValues;
  // Update formValues based on input changes
  const handleInputChange = (field: FormField, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: formatCostInputValue(value),
    }));
  };

  const addOtherCharges = () => {
    setOtherChargesInput(true);
  };

  const handleRemoveOtherCharges = () => {
    setOtherChargesInput(false);
    setFormValues((prevValues) => ({
      ...prevValues,
      otherCharges: "0",
    }));
  };

  // Calculate the total package
  useEffect(() => {
    const total =
      (parseFloat(rentAmount.replace(/,/g, "")) || 0) +
      (parseFloat(serviceCharge.replace(/,/g, "")) || 0) +
      (parseFloat(otherCharges.replace(/,/g, "")) || 0);
    setFormValues((prevValues) => ({
      ...prevValues,
      totalPackage: formatNumber(parseFloat(total.toFixed(2))),
    }));
  }, [rentAmount, serviceCharge, otherCharges]);

  // reset form
  useEffect(() => {
    setOtherChargesInput(false);
    setFormValues(emptyStateValues);
  }, [formResetKey]);

  return (
    <div>
      <h4 className="text-primary-navy dark:text-white text-lg md:text-xl font-bold">
        Unit Fee Breakdown - Renewal Tenants
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Select
          required
          id="fee_period_renew"
          options={rentPeriods}
          label="Fee Period"
          inputContainerClassName="bg-white"
          hiddenInputClassName="unit-form-input"
          resetKey={formResetKey}
        />
        <Input
          id="fee_amount_renew"
          required
          label="Fee Amount"
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={rentAmount}
          onChange={(value) => handleInputChange("rentAmount", value)}
          type="text"
        />
        <Input
          id="service_charge_renew"
          label="Service Charge"
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={serviceCharge}
          onChange={(value) => handleInputChange("serviceCharge", value)}
          type="text"
        />
        {otherChargesInput && (
          <div className="relative">
            <Input
              id="other_charges_renew"
              label="Other Charges"
              inputClassName="bg-white"
              CURRENCY_SYMBOL={CURRENCY_SYMBOL}
              value={otherCharges}
              onChange={(value) => handleInputChange("otherCharges", value)}
              type="text"
            />
            <button
              type="button"
              aria-label="Remove Other Charges"
              onClick={handleRemoveOtherCharges}
              className="absolute top-0 right-0 w-[18px] h-[18px]"
            >
              <DeleteIconX size={20} />
            </button>
          </div>
        )}
        {!otherChargesInput && (
          <button
            type="button"
            onClick={addOtherCharges}
            className="text-brand-9 text-xs md:text-sm font-normal md:self-end md:justify-self-start"
          >
            Add Other Charges
          </button>
        )}
        <Input
          required
          id="total_package_renew"
          label="Total Package"
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={totalPackage}
          readOnly
          disabled
          type="text"
        />
      </div>
    </div>
  );
};

export default UnitBreakdownRenewalTenant;
