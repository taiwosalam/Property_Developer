import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { rentPeriods } from "@/data";
import { useAddUnitStore } from "@/store/add-unit-store";
import { useState, useEffect } from "react";
import { DeleteIconX } from "@/public/icons/icons";
import { formatNumber, currencySymbols } from "@/utils/number-formatter";

const emptyStateValues = {
  rentAmount: 0,
  agencyFee: 0,
  legalFee: 0,
  serviceCharge: 0,
  cautionFee: 0,
  inspectionFee: 0,
  otherCharges: 0,
  totalPackage: 0,
};

const UnitBreakdownNewTenant = () => {
  const formResetKey = useAddUnitStore((s) => s.formResetKey);
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  const agencyFeePercentageString = propertySettings?.agency_fee || "10%";
  const agencyFeePercentage = parseFloat(agencyFeePercentageString || "0"); // Convert '5%' to 5
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"]; // Should be gotten from store from API
  const [otherChargesLabel, setOtherChargesLabel] = useState("");

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
    // Remove commas from the formatted value and convert to a number
    const unformattedValue = parseFloat(value.replace(/,/g, "")) || 0;
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: unformattedValue,
    }));
  };
  const addOtherCharges = () => {
    const label = prompt("Enter the name of the charge:", "Other Charges");
    setOtherChargesLabel(label || "Other Charges");
  };

  const handleRemoveOtherCharges = () => {
    setOtherChargesLabel("");
    setFormValues((prevValues) => ({
      ...prevValues,
      otherCharges: 0,
    }));
  };

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      agencyFee: (prevValues.rentAmount * agencyFeePercentage) / 100,
      legalFee: (prevValues.rentAmount * agencyFeePercentage) / 100,
    }));
  }, [rentAmount, agencyFeePercentage]);

  // Calculate the total package
  useEffect(() => {
    const total =
      rentAmount +
      agencyFee +
      legalFee +
      serviceCharge +
      cautionFee +
      inspectionFee +
      otherCharges;

    setFormValues((prevValues) => ({
      ...prevValues,
      totalPackage: total,
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
    setOtherChargesLabel("");
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
          value={formatNumber(rentAmount)}
          onChange={(value) => handleInputChange("rentAmount", value)}
          type="text"
        />
        <Input
          id="service_charge"
          label="Service Charge"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={formatNumber(serviceCharge)}
          onChange={(value) => handleInputChange("serviceCharge", value)}
          type="text"
        />
        <Input
          id="agency_fee"
          label="Agency Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={formatNumber(agencyFee)}
          readOnly
          disabled
          type="text"
        />
        <Input
          id="legal_fee"
          label="Legal Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={formatNumber(legalFee)}
          onChange={(value) => handleInputChange("legalFee", value)}
          type="text"
        />
        <Input
          id="caution_fee"
          label="Caution Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={formatNumber(cautionFee)}
          onChange={(value) => handleInputChange("cautionFee", value)}
          type="text"
        />
        <Input
          id="inspection_fee"
          label="Inspection Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={formatNumber(inspectionFee)}
          onChange={(value) => handleInputChange("inspectionFee", value)}
          type="text"
        />
        {otherChargesLabel && (
          <div className="relative">
            <Input
              id="other_charges"
              label={otherChargesLabel}
              inputClassName="bg-white"
              CURRENCY_SYMBOL={CURRENCY_SYMBOL}
              value={formatNumber(otherCharges)}
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
        {!otherChargesLabel && (
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
          value={formatNumber(totalPackage)}
          readOnly
          disabled
          type="text"
        />
      </div>
    </div>
  );
};

export default UnitBreakdownNewTenant;
