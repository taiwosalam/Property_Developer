import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { rentPeriods } from "@/data";
import { useAddUnitStore } from "@/store/add-unit-store";
import { useState, useEffect, useMemo } from "react";
import { DeleteIconX } from "@/public/icons/icons";
import {
  formatCostInputValue,
  currencySymbols,
  formatNumber,
} from "@/utils/number-formatter";
import { useUnitForm } from "./unit-form-context";

const UnitBreakdownRenewalTenant = () => {
  const { formResetKey, unitData } = useUnitForm();
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  const CURRENCY_SYMBOL =
    currencySymbols[propertySettings?.currency || "naira"];
  const [otherChargesInput, setOtherChargesInput] = useState(
    !!parseFloat(unitData?.renew_other_charge || "0")
  );

  const initialFormValues = useMemo(() => {
    return {
      rentAmount: unitData?.renew_fee_amount
        ? formatNumber(parseFloat(unitData.renew_fee_amount))
        : "",
      serviceCharge: unitData?.renew_service_charge
        ? formatNumber(parseFloat(unitData.renew_service_charge))
        : "",
      otherCharges: unitData?.renew_other_charge
        ? formatNumber(parseFloat(unitData.renew_other_charge))
        : "",
      // Initialize VAT to "0"
      vat: unitData?.renew_vat ? formatNumber(parseFloat(unitData.renew_vat as string)) : "0",
      totalPackage: unitData?.renew_total_package
        ? formatNumber(parseFloat(unitData.renew_total_package))
        : "",
    };
  }, [
    unitData?.renew_fee_amount,
    unitData?.renew_service_charge,
    unitData?.renew_other_charge,
    unitData?.renew_vat,
    unitData?.renew_total_package,
  ]);

  const [formValues, setFormValues] = useState(initialFormValues);
  const { rentAmount, serviceCharge, vat, totalPackage, otherCharges } = formValues;
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

  // Calculate VAT for Renewal only if VAT is enabled in settings.
  // VAT is calculated by:
  //   const rentTenPercent = rentAmount * 0.10
  //   const calculatedVAT = rentTenPercent * 0.075
  useEffect(() => {
    const rentAmountValue = parseFloat(rentAmount.replace(/,/g, "")) || 0;
    const shouldCalculateVAT =
      propertySettings?.VAT?.toLowerCase() === "yes";
    const rentTenPercent = rentAmountValue * 0.10;
    const calculatedVAT = shouldCalculateVAT ? rentTenPercent * 0.075 : 0;

    setFormValues((prevValues) => ({
      ...prevValues,
      vat: formatNumber(calculatedVAT.toFixed(2)),
    }));
  }, [rentAmount, propertySettings?.VAT]);

  // Calculate the total package including VAT if enabled
  useEffect(() => {
    const total =
      (parseFloat(rentAmount.replace(/,/g, "")) || 0) +
      (parseFloat(serviceCharge.replace(/,/g, "")) || 0) +
      (parseFloat(otherCharges.replace(/,/g, "")) || 0) +
      (parseFloat(vat.replace(/,/g, "")) || 0);
    setFormValues((prevValues) => ({
      ...prevValues,
      totalPackage: formatNumber(total.toFixed(2)),
    }));
  }, [rentAmount, serviceCharge, otherCharges, vat]);

  // Reset form when formResetKey changes
  useEffect(() => {
    if (formResetKey !== 0) {
      setOtherChargesInput(!!unitData?.renew_other_charge);
      setFormValues(initialFormValues);
    }
  }, [formResetKey, initialFormValues, unitData?.renew_other_charge]);

  return (
    <div>
      <h4 className="text-primary-navy dark:text-white text-lg md:text-xl font-bold">
        Unit Fee Breakdown - Renewal Tenants
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Select
          required
          id="renew_fee_period"
          options={rentPeriods}
          label="Rent Period"
          inputContainerClassName="bg-white"
          hiddenInputClassName="unit-form-input"
          resetKey={formResetKey}
          defaultValue={unitData?.renew_fee_period || "yearly"}
        />
        <Input
          id="renew_fee_amount"
          required
          label="Rent Amount"
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={rentAmount}
          onChange={(value) => handleInputChange("rentAmount", value)}
          type="text"
        />
        <Input
          id="renew_service_charge"
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
              id="renew_other_charge"
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
        {/* Only display VAT input if VAT is enabled */}
        {propertySettings?.VAT?.toLowerCase() === "yes" && (
          <Input
            id="renew_vat"
            label="VAT Fee"
            inputClassName="bg-white unit-form-input"
            CURRENCY_SYMBOL={CURRENCY_SYMBOL}
            value={vat}
            readOnly
            type="text"
          />
        )}
        <Input
          required
          id="renew_total_package"
          label="Total Package"
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={totalPackage}
          readOnly
          type="text"
        />
      </div>
    </div>
  );
};

export default UnitBreakdownRenewalTenant;
