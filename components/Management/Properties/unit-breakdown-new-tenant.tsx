import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { rentPeriods } from "@/data";
import { useAddUnitStore } from "@/store/add-unit-store";
import { useState, useEffect } from "react";
import { DeleteIconX } from "@/public/icons/icons";
import {
  formatNumber,
  currencySymbols,
  formatCostInputValue,
} from "@/utils/number-formatter";
import { useUnitForm } from "./unit-form-context";

const emptyStateValues = {
  rentAmount: "",
  agencyFee: "",
  legalFee: "",
  serviceCharge: "",
  cautionFee: "",
  inspectionFee: "",
  otherCharges: "",
  totalPackage: "",
};

const UnitBreakdownNewTenant = () => {
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  const agencyFeePercentageString = propertySettings?.agency_fee || "10%";
  const agencyFeePercentage = parseFloat(agencyFeePercentageString || "0"); // Convert '5%' to 5
  const { formResetKey } = useUnitForm();
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"]; // Should be gotten from store from API
  const [otherChargesInput, setOtherChargesInput] = useState(false);

  const [formValues, setFormValues] = useState(emptyStateValues);
  const {
    rentAmount,
    agencyFee,
    legalFee,
    serviceCharge,
    cautionFee,
    inspectionFee,
    otherCharges,
    totalPackage,
  } = formValues;

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

  useEffect(() => {
    const rentAmountValue = parseFloat(rentAmount.replace(/,/g, "")) || 0;
    const agencyFeeValue = (rentAmountValue * agencyFeePercentage) / 100;

    setFormValues((prevValues) => ({
      ...prevValues,
      agencyFee: formatNumber(parseFloat(agencyFeeValue.toFixed(2))),
      legalFee: formatNumber(parseFloat(agencyFeeValue.toFixed(2))),
    }));
  }, [rentAmount, agencyFeePercentage]);

  // Calculate the total package
  useEffect(() => {
    const total =
      (parseFloat(rentAmount.replace(/,/g, "")) || 0) +
      (parseFloat(agencyFee.replace(/,/g, "")) || 0) +
      (parseFloat(legalFee.replace(/,/g, "")) || 0) +
      (parseFloat(serviceCharge.replace(/,/g, "")) || 0) +
      (parseFloat(cautionFee.replace(/,/g, "")) || 0) +
      (parseFloat(inspectionFee.replace(/,/g, "")) || 0) +
      (parseFloat(otherCharges.replace(/,/g, "")) || 0);

    setFormValues((prevValues) => ({
      ...prevValues,
      totalPackage: formatNumber(parseFloat(total.toFixed(2))),
    }));
  }, [
    rentAmount,
    agencyFee,
    legalFee,
    serviceCharge,
    cautionFee,
    inspectionFee,
    otherCharges,
  ]);

  // reset form
  useEffect(() => {
    setOtherChargesInput(false);
    setFormValues(emptyStateValues);
  }, [formResetKey]);

  return (
    <div>
      <h4 className="text-primary-navy text-lg md:text-xl font-bold">
        Unit Rent Breakdown - New Tenant
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Select
          id="rent_period"
          required
          options={rentPeriods}
          label="Rent Period"
          inputContainerClassName="bg-white"
          resetKey={formResetKey}
        />
        <Input
          id="rent_amount"
          label="Rent Amount"
          required
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={rentAmount}
          onChange={(value) => handleInputChange("rentAmount", value)}
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
        <Input
          id="agency_fee"
          label="Agency Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={agencyFee}
          readOnly
          disabled
          type="text"
        />
        <Input
          id="legal_fee"
          label="Legal Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={legalFee}
          onChange={(value) => handleInputChange("legalFee", value)}
          type="text"
        />
        <Input
          id="caution_fee"
          label="Caution Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={cautionFee}
          onChange={(value) => handleInputChange("cautionFee", value)}
          type="text"
        />
        <Input
          id="inspection_fee"
          label="Inspection Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={inspectionFee}
          onChange={(value) => handleInputChange("inspectionFee", value)}
          type="text"
        />
        {otherChargesInput && (
          <div className="relative">
            <Input
              id="other_charges"
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
        <Select
          required
          options={["yes", "no"]}
          isSearchable={false}
          id="open_to_negotiation"
          label="Are you open to negotiation?"
          inputContainerClassName="bg-white"
          dropdownRefClassName="!w-[160px]"
          resetKey={formResetKey}
        />
        <Input
          required
          id="total_package"
          label="Total Package"
          inputClassName="bg-white"
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

export default UnitBreakdownNewTenant;
