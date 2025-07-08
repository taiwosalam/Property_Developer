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
import { mapNumericToYesNo } from "@/utils/checkFormDataForImageOrAvatar";

const UnitBreakdownNewTenant = () => {
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  const agencyFeePercentage = parseFloat(
    String(propertySettings?.agency_fee || "0")
  );

  const { formResetKey, unitData } = useUnitForm();
  const CURRENCY_SYMBOL =
    currencySymbols[propertySettings?.currency || "naira"];
  const [otherChargesInput, setOtherChargesInput] = useState(
    !!parseFloat(unitData?.other_charge || "0")
  );

  const initialFormValues = useMemo(() => {
    return {
      rentAmount: unitData?.fee_amount
        ? formatNumber(parseFloat(unitData.fee_amount))
        : "",
      agencyFee: unitData?.agency_fee
        ? formatNumber(parseFloat(unitData.agency_fee))
        : "",
      legalFee: unitData?.legal_fee
        ? formatNumber(parseFloat(unitData.legal_fee))
        : "",
      serviceCharge: unitData?.service_charge
        ? formatNumber(parseFloat(unitData.service_charge))
        : "",
      cautionFee: unitData?.caution_fee
        ? formatNumber(parseFloat(unitData.caution_fee))
        : "",
      inspectionFee: unitData?.inspection_fee
        ? formatNumber(parseFloat(unitData.inspection_fee))
        : "",
      otherCharges: unitData?.other_charge
        ? formatNumber(parseFloat(unitData.other_charge))
        : "",
      vat: unitData?.vat
        ? formatNumber(parseFloat(unitData.vat as string))
        : "0",
      totalPackage: unitData?.total_package
        ? formatNumber(parseFloat(unitData.total_package))
        : "",
    };
  }, [
    unitData?.fee_amount,
    unitData?.agency_fee,
    unitData?.legal_fee,
    unitData?.service_charge,
    unitData?.caution_fee,
    unitData?.inspection_fee,
    unitData?.other_charge,
    unitData?.vat,
    unitData?.total_package,
  ]);

  const [formValues, setFormValues] = useState(initialFormValues);
  const {
    rentAmount,
    agencyFee,
    legalFee,
    serviceCharge,
    cautionFee,
    inspectionFee,
    otherCharges,
    vat,
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

  // Calculate VAT (only if VAT is enabled in settings)
  useEffect(() => {
    const rentAmountValue = parseFloat(rentAmount.replace(/,/g, "")) || 0;
    // Calculate Agency Fee based on percentage
    const agencyFeeValue = (rentAmountValue * agencyFeePercentage) / 100;
    const legalFeeValue = (rentAmountValue * agencyFeePercentage) / 100;
    const shouldCalculateVAT = propertySettings?.VAT?.toLowerCase() === "yes";
    const vatValue = shouldCalculateVAT
      ? (agencyFeeValue + legalFeeValue) * 0.075
      : 0;

    setFormValues((prevValues) => ({
      ...prevValues,
      agencyFee: formatNumber(agencyFeeValue.toFixed(2)),
      legalFee: formatNumber(legalFeeValue.toFixed(2)),
      vat: formatNumber(vatValue.toFixed(2)),
    }));
  }, [rentAmount, legalFee, agencyFeePercentage, propertySettings?.VAT]);

  // Calculate the total package
  useEffect(() => {
    const total =
      (parseFloat(rentAmount.replace(/,/g, "")) || 0) +
      (parseFloat(agencyFee.replace(/,/g, "")) || 0) +
      (parseFloat(legalFee.replace(/,/g, "")) || 0) +
      (parseFloat(serviceCharge.replace(/,/g, "")) || 0) +
      (parseFloat(cautionFee.replace(/,/g, "")) || 0) +
      (parseFloat(inspectionFee.replace(/,/g, "")) || 0) +
      (parseFloat(otherCharges.replace(/,/g, "")) || 0) +
      (parseFloat(vat.replace(/,/g, "")) || 0);

    setFormValues((prevValues) => ({
      ...prevValues,
      totalPackage: formatNumber(total.toFixed(2)),
    }));
  }, [
    rentAmount,
    agencyFee,
    legalFee,
    serviceCharge,
    cautionFee,
    inspectionFee,
    otherCharges,
    vat,
  ]);

  // Reset form when formResetKey changes
  useEffect(() => {
    if (formResetKey !== 0) {
      setOtherChargesInput(!!unitData?.other_charge);
      setFormValues(initialFormValues);
    }
  }, [formResetKey, initialFormValues, unitData?.other_charge]);

  return (
    <div className="unit-fee-breakdown-new-tenant">
      <h4 className="text-primary-navy dark:text-white text-lg md:text-xl font-bold">
        Unit Fee Breakdown - New Tenant
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Select
          id="fee_period"
          required
          options={rentPeriods}
          label="Rent Period"
          inputContainerClassName="bg-white"
          resetKey={formResetKey}
          hiddenInputClassName="unit-form-input"
          defaultValue={unitData?.fee_period || "yearly"}
        />
        <Input
          id="fee_amount"
          label="Rent Amount"
          required
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={rentAmount}
          onChange={(value) => handleInputChange("rentAmount", value)}
          type="text"
          autoComplete="off"
        />
        <Input
          id="service_charge"
          label="Service Charge"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={serviceCharge}
          onChange={(value) => handleInputChange("serviceCharge", value)}
          type="text"
          autoComplete="off"
        />
        <Input
          id="agency_fee"
          label="Agency Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={agencyFee}
          readOnly
          type="text"
          autoComplete="off"
        />
        <Input
          id="legal_fee"
          label="Legal Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={legalFee}
          onChange={(value) => handleInputChange("legalFee", value)}
          type="text"
          autoComplete="off"
        />
        <Input
          id="caution_fee"
          label="Caution Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={cautionFee}
          onChange={(value) => handleInputChange("cautionFee", value)}
          type="text"
          autoComplete="off"
        />
        <Input
          id="inspection_fee"
          label="Inspection Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={inspectionFee}
          onChange={(value) => handleInputChange("inspectionFee", value)}
          type="text"
          autoComplete="off"
        />
        {/* Only display VAT input if VAT is enabled */}
        {propertySettings?.VAT?.toLowerCase() === "yes" && (
          <Input
            id="vat_amount"
            label="Value Added Tax (VAT)"
            inputClassName="bg-white"
            CURRENCY_SYMBOL={CURRENCY_SYMBOL}
            value={vat}
            readOnly
            type="text"
            autoComplete="off"
          />
        )}

        <Input
          id="other_charge"
          label="Other Charges"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={otherCharges}
          onChange={(value) => handleInputChange("otherCharges", value)}
          type="text"
          autoComplete="off"
        />
        <Input
          required
          id="total_package"
          label="Total Package"
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={totalPackage}
          readOnly
          type="text"
          autoComplete="off"
          />

        <Select
          required
          options={["yes", "no"]}
          isSearchable={false}
          id="negotiation"
          label="Are you open to negotiation?"
          inputContainerClassName="bg-white"
          dropdownRefClassName="!w-[160px]"
          resetKey={formResetKey}
          hiddenInputClassName="unit-form-input"
          defaultValue={mapNumericToYesNo(unitData?.negotiation) || "no"}
        />
      </div>
    </div>
  );
};

export default UnitBreakdownNewTenant;
