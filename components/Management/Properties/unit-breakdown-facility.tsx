import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { rentPeriods } from "@/data";
import { useAddUnitStore } from "@/store/add-unit-store";
import { useState, useEffect, useMemo } from "react";
import { DeleteIconX } from "@/public/icons/icons";
import {
  formatNumber,
  currencySymbols,
  formatCostInputValue,
} from "@/utils/number-formatter";
import { useUnitForm } from "./unit-form-context";

const UnitBreakdownFacility = () => {
  const { formResetKey, unitData } = useUnitForm();
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  const CURRENCY_SYMBOL =
    currencySymbols[propertySettings?.currency || "naira"];
  const [otherChargesInput, setOtherChargesInput] = useState(
    !!unitData?.other_charge
  );

  const initialFormValues = useMemo(() => {
    return {
      rentAmount: unitData?.fee_amount
        ? formatNumber(parseFloat(unitData.fee_amount))
        : "",
      securityFee: unitData?.security_fee
        ? formatNumber(parseFloat(unitData.security_fee))
        : "",
      serviceCharge: unitData?.service_charge
        ? formatNumber(parseFloat(unitData.service_charge))
        : "",
      otherCharges: unitData?.other_charge
        ? formatNumber(parseFloat(unitData.other_charge))
        : "",
      totalPackage: unitData?.total_package
        ? formatNumber(parseFloat(unitData.total_package))
        : "",
    };
  }, [
    unitData?.fee_amount,
    unitData?.security_fee,
    unitData?.service_charge,
    unitData?.other_charge,
    unitData?.total_package,
  ]);

  const [formValues, setFormValues] = useState(initialFormValues);
  const { rentAmount, securityFee, serviceCharge, otherCharges, totalPackage } =
    formValues;

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
      (parseFloat(securityFee.replace(/,/g, "")) || 0) +
      (parseFloat(serviceCharge.replace(/,/g, "")) || 0) +
      (parseFloat(otherCharges.replace(/,/g, "")) || 0);

    setFormValues((prevValues) => ({
      ...prevValues,
      totalPackage: formatNumber(parseFloat(total.toFixed(2))),
    }));
  }, [rentAmount, securityFee, serviceCharge, otherCharges]);

  // reset form
  useEffect(() => {
    if (formResetKey !== 0) {
      setOtherChargesInput(!!unitData?.other_charge);
      setFormValues(initialFormValues);
    }
  }, [formResetKey, initialFormValues, unitData?.other_charge]);

  return (
    <div>
      <h4 className="text-primary-navy dark:text-white text-lg md:text-xl font-bold">
        Unit Fee Breakdown
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Select
          id="fee_period"
          required
          options={rentPeriods}
          label="Fee Period"
          inputContainerClassName="bg-white"
          resetKey={formResetKey}
          hiddenInputClassName="unit-form-input"
        />
        <Input
          id="fee_amount"
          label="Fee Amount"
          required
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={rentAmount}
          onChange={(value) => handleInputChange("rentAmount", value)}
          type="text"
        />
        <Input
          id="security_fee"
          label="Security Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={securityFee}
          onChange={(value) => handleInputChange("securityFee", value)}
          type="text"
        />
        <Input
          id="service_charge"
          label="Service Charge"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={serviceCharge}
          onChange={(value) => handleInputChange("serviceCharge", value)}
          type="text"
        />

        {otherChargesInput && (
          <div className="relative">
            <Input
              id="other_charge"
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
          id="total_package"
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

export default UnitBreakdownFacility;
