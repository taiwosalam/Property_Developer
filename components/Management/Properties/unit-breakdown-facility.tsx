import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { rentPeriods } from "@/data";
import { useAddUnitStore } from "@/store/add-unit-store";
import { useState, useEffect, useMemo } from "react";
import { DeleteIconX, ExclamationMark } from "@/public/icons/icons";
import {
  formatNumber,
  currencySymbols,
  formatCostInputValue,
} from "@/utils/number-formatter";
import { useUnitForm } from "./unit-form-context";
import { usePathname } from "next/navigation";
import { useTourStore } from "@/store/tour-store";

const UnitBreakdownFacility = () => {
  const { formResetKey, unitData } = useUnitForm();
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  const agencyFeePercentage = parseFloat(
    String(propertySettings?.management_fee || "0")
  );

  const CURRENCY_SYMBOL =
    currencySymbols[propertySettings?.currency || "naira"];
  const [otherChargesInput, setOtherChargesInput] = useState(
    !!parseFloat(unitData?.other_charge || "0")
  );

  const initialFormValues = useMemo(() => {
    return {
      rentAmount: unitData?.fee_amount
        ? formatNumber(parseFloat(unitData.fee_amount))
        : "", // Empty string if null/undefined
      agencyFee: unitData?.agency_fee
        ? formatNumber(parseFloat(unitData.agency_fee))
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
      vat: unitData?.renew_vat
        ? formatNumber(parseFloat(unitData.renew_vat as string))
        : "0", // Default to "0" for VAT
      totalPackage: unitData?.total_package
        ? formatNumber(parseFloat(unitData.total_package))
        : "",
    };
  }, [
    unitData?.fee_amount,
    unitData?.agency_fee,
    unitData?.security_fee,
    unitData?.service_charge,
    unitData?.other_charge,
    unitData?.renew_vat,
    unitData?.total_package,
  ]);

  const [formValues, setFormValues] = useState(initialFormValues);
  const {
    rentAmount,
    agencyFee,
    securityFee,
    serviceCharge,
    otherCharges,
    vat,
    totalPackage,
  } = formValues;

  type FormField = keyof typeof formValues;

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

  // Calculate VAT
  useEffect(() => {
    const rentAmountValue = parseFloat(rentAmount.replace(/,/g, "")) || 0;
    const agencyFeeValue = (rentAmountValue * agencyFeePercentage) / 100;
    const shouldCalculateVAT = propertySettings?.VAT?.toLowerCase() === "yes";
    const rentTenPercent = rentAmountValue * 0.1;
    const calculatedVAT = shouldCalculateVAT ? rentTenPercent * 0.075 : 0;

    setFormValues((prevValues) => ({
      ...prevValues,
      vat: formatNumber(calculatedVAT.toFixed(2)),
      agencyFee: formatNumber(agencyFeeValue.toFixed(2)),
    }));
  }, [rentAmount, propertySettings, agencyFeePercentage]);

  // Calculate Total Package
  useEffect(() => {
    const total =
      (parseFloat(rentAmount.replace(/,/g, "")) || 0) +
      (parseFloat(agencyFee.replace(/,/g, "")) || 0) +
      (parseFloat(securityFee.replace(/,/g, "")) || 0) +
      (parseFloat(serviceCharge.replace(/,/g, "")) || 0) +
      (parseFloat(otherCharges.replace(/,/g, "")) || 0) +
      (parseFloat(vat.replace(/,/g, "")) || 0);

    setFormValues((prevValues) => ({
      ...prevValues,
      totalPackage: formatNumber(total.toFixed(2)),
    }));
  }, [rentAmount, securityFee, serviceCharge, otherCharges, vat, agencyFee]);

  // Reset form when formResetKey changes
  useEffect(() => {
    if (formResetKey !== 0) {
      setOtherChargesInput(!!parseFloat(unitData?.other_charge || "0"));
      setFormValues(initialFormValues);
    }
  }, [formResetKey, initialFormValues, unitData?.other_charge]);

  const { goToStep, restartTour } = useTourStore();
  const pathname = usePathname();

  const handleGoToTourStep = (stepIndex: number) => {
    goToStep(stepIndex, pathname);
  };

  const [defaultPeriod, setDefaultPeriod] = useState(
    unitData?.renew_fee_period || "yearly"
  );

  return (
    <div className="unit-fee-breakdown-new-tenant">
      <div className="flex gap-2 items-center">
        <h4 className="text-primary-navy dark:text-white text-lg md:text-xl font-bold">
          Unit Fee Breakdown
        </h4>
        <button
          onClick={() => {
            if (pathname.startsWith("/manager")) {
              handleGoToTourStep(27);
            } else if (pathname.startsWith("/accountant")) {
              handleGoToTourStep(26);
            } else {
              handleGoToTourStep(28);
            }
          }}
          type="button"
          className="text-orange-normal"
        >
          <ExclamationMark />
        </button>
      </div>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Select
          id="fee_period"
          required
          options={rentPeriods}
          label="Fee Period"
          inputContainerClassName="bg-white"
          onChange={setDefaultPeriod}
          hiddenInputClassName="unit-form-input"
          resetKey={formResetKey}
          defaultValue={unitData?.fee_period || "yearly"}
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
          autoComplete="off"
        />
        <Input
          id="agency_fee"
          label="Management Fee"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={agencyFee}
          readOnly
          type="text"
          autoComplete="off"
        />
        <Input
          id="security_fee"
          label={`Security Fee (${defaultPeriod})`}
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={securityFee}
          onChange={(value) => handleInputChange("securityFee", value)}
          type="text"
          autoComplete="off"
        />
        <Input
          id="service_charge"
          label={`Service Charge (${defaultPeriod})`}
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={serviceCharge}
          onChange={(value) => handleInputChange("serviceCharge", value)}
          type="text"
          autoComplete="off"
        />
        {propertySettings?.VAT?.toLowerCase() === "yes" && (
          <Input
            id="vat_amount"
            label="Value Added Tax (VAT)"
            inputClassName="bg-white unit-form-input"
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
          inputClassName="bg-white unit-form-input"
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
      </div>
    </div>
  );
};

export default UnitBreakdownFacility;
