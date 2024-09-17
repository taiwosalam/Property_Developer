import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { rentPeriods } from "@/data";
import { useAddUnitStore } from "@/store/add-unit-store";
import { useState, useEffect } from "react";
import { DeleteIconX } from "@/public/icons/icons";
import { formatNumber, currencySymbols } from "@/utils/number-formatter";

const emptyStateValues = {
  rentAmount: 0,
  otherCharges: 0,
  serviceCharge: 0,
  totalPackage: 0,
};

const UnitBreakdownRenewalTenant = () => {
  const formResetKey = useAddUnitStore((s) => s.formResetKey);
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  const agencyFeePercentageString = propertySettings?.agency_fee || "10%";
  const agencyFeePercentage = parseFloat(agencyFeePercentageString || "0"); // Convert '5%' to 5
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"]; // Should be gotten from store from API
  const [otherChargesLabel, setOtherChargesLabel] = useState("");
  const [formValues, setFormValues] = useState(emptyStateValues);
  const { rentAmount, serviceCharge, totalPackage, otherCharges } = formValues;
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

  // Calculate the total package
  useEffect(() => {
    const total = rentAmount + serviceCharge + otherCharges;

    setFormValues((prevValues) => ({
      ...prevValues,
      totalPackage: total,
    }));
  }, [rentAmount, serviceCharge, otherCharges]);

  // reset form
  useEffect(() => {
    setOtherChargesLabel("");
    setFormValues(emptyStateValues);
  }, [formResetKey]);

  return (
    <div>
      <h4 className="text-primary-navy text-lg md:text-xl font-bold">
        Unit Rent Breakdown - Renewal Tenants
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Select
          required
          id="renewal_rent_period"
          options={rentPeriods}
          label="Rent Period"
          inputContainerClassName="bg-white"
        />
        <Input
          id="renewal_rent_amount"
          required
          label="Rent Amount"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={formatNumber(rentAmount)}
          onChange={(value) => handleInputChange("rentAmount", value)}
          type="text"
        />
        <Input
          id="renewal_service_charge"
          label="Service Charge"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={formatNumber(serviceCharge)}
          onChange={(value) => handleInputChange("serviceCharge", value)}
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
        <Input
          required
          id="renewal_total_package"
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

export default UnitBreakdownRenewalTenant;
