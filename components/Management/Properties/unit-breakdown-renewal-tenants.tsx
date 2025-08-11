import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { rentPeriods } from "@/data";
import { useAddUnitStore } from "@/store/add-unit-store";
import { useState, useEffect, useMemo } from "react";
import { DeleteIconX, ExclamationMark } from "@/public/icons/icons";
import {
  formatCostInputValue,
  currencySymbols,
  formatNumber,
} from "@/utils/number-formatter";
import { useUnitForm } from "./unit-form-context";
import { useTourStore } from "@/store/tour-store";
import { usePathname } from "next/navigation";

const UnitBreakdownRenewalTenant = () => {
  const { formResetKey, unitData } = useUnitForm();
  const propertySettings = useAddUnitStore((s) => s.propertySettings);
  const propertyType = useAddUnitStore((state) => state.propertyType);
  const CURRENCY_SYMBOL =
    currencySymbols[propertySettings?.currency || "naira"];

  const shouldChargeTenantAgencyFee =
    propertySettings?.who_to_charge_renew_tenant?.toLowerCase() === "tenants" ||
    propertySettings?.who_to_charge_renew_tenant?.toLowerCase() === "both";
  const IS_RENTAL = propertyType === "rental";
  const agencyFeePercentage = IS_RENTAL
    ? Number(propertySettings?.agency_fee || 0)
    : Number(propertySettings?.management_fee || 0);
  const [otherChargesInput, setOtherChargesInput] = useState(
    !!parseFloat(unitData?.renew_other_charge || "0")
  );

  const initialFormValues = useMemo(() => {
    return {
      rentAmount: unitData?.renew_fee_amount
        ? formatNumber(parseFloat(unitData.renew_fee_amount) || 0)
        : "",
      agencyFee: unitData?.agency_fee
        ? formatNumber(parseFloat(unitData.agency_fee) || 0)
        : "",
      serviceCharge: unitData?.renew_service_charge
        ? formatNumber(parseFloat(unitData.renew_service_charge) || 0)
        : "",
      otherCharges: unitData?.renew_other_charge
        ? formatNumber(parseFloat(unitData.renew_other_charge) || 0)
        : "",
      securityFee: unitData?.security_fee
        ? formatNumber(parseFloat(unitData.renew_security_fee as string) || 0)
        : "",
      vat: unitData?.renew_vat
        ? formatNumber(parseFloat(unitData.renew_vat as string) || 0)
        : "0",
      totalPackage: unitData?.renew_total_package
        ? formatNumber(parseFloat(unitData.renew_total_package) || 0)
        : "",
    };
  }, [
    unitData?.renew_fee_amount,
    unitData?.agency_fee,
    unitData?.renew_service_charge,
    unitData?.renew_other_charge,
    unitData?.renew_vat,
    unitData?.renew_total_package,
    unitData?.renew_security_fee,
    unitData?.renew_fee_period,
    unitData?.security_fee,
  ]);

  const [formValues, setFormValues] = useState(initialFormValues);
  const {
    rentAmount,
    agencyFee,
    serviceCharge,
    vat,
    totalPackage,
    otherCharges,
    securityFee,
  } = formValues;
  type FormField = keyof typeof formValues;

  const parseCurrencyValue = (value: string): number => {
    const cleanedValue = value.replace(/,/g, "");
    return isNaN(parseFloat(cleanedValue)) ? 0 : parseFloat(cleanedValue);
  };

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

  // Calculate VAT for Renewal
  useEffect(() => {
    const rentAmountValue = parseCurrencyValue(rentAmount);
    const shouldCalculateVAT = propertySettings?.VAT?.toLowerCase() === "yes";
    const rentTenPercent = rentAmountValue * 0.1;
    const calculatedVAT = shouldCalculateVAT ? rentTenPercent * 0.075 : 0;

    setFormValues((prevValues) => ({
      ...prevValues,
      vat: formatNumber(calculatedVAT.toFixed(2)),
    }));
  }, [rentAmount, propertySettings?.VAT]);

  // Calculate Agency Fee
  useEffect(() => {
    const rentAmountValue = parseCurrencyValue(rentAmount);
    const calculatedAgencyFee = shouldChargeTenantAgencyFee
      ? (rentAmountValue * agencyFeePercentage) / 100
      : 0;

    setFormValues((prevValues) => ({
      ...prevValues,
      agencyFee: formatNumber(calculatedAgencyFee.toFixed(2)),
    }));
  }, [rentAmount, agencyFeePercentage, shouldChargeTenantAgencyFee]);

  // Calculate Total Package
  useEffect(() => {
    const total =
      parseCurrencyValue(rentAmount) +
      parseCurrencyValue(agencyFee) +
      parseCurrencyValue(securityFee) +
      parseCurrencyValue(serviceCharge) +
      parseCurrencyValue(otherCharges) +
      parseCurrencyValue(vat);
    setFormValues((prevValues) => ({
      ...prevValues,
      totalPackage: formatNumber(total.toFixed(2)),
    }));
  }, [rentAmount, agencyFee, serviceCharge, otherCharges, vat, securityFee]);

  // Reset form when formResetKey changes
  useEffect(() => {
    if (formResetKey !== 0) {
      setOtherChargesInput(!!unitData?.renew_other_charge);
      setFormValues(initialFormValues);
    }
  }, [formResetKey, initialFormValues, unitData?.renew_other_charge]);

  const { goToStep, restartTour } = useTourStore();
  const pathname = usePathname();

  const handleGoToTourStep = (stepIndex: number) => {
    goToStep(stepIndex, pathname);
  };

  const handleTourSection = () => {
    if (!IS_RENTAL && pathname.startsWith("/manager")) {
      goToStep(28);
    }
    if (IS_RENTAL && pathname.startsWith("/accountant")) {
      goToStep(32);
    } else if (!IS_RENTAL && pathname.startsWith("/accountant")) {
      goToStep(27);
    } else if (!IS_RENTAL) {
      handleGoToTourStep(29);
    } else if (IS_RENTAL && pathname.startsWith("/manager")) {
      handleGoToTourStep(33);
    } else if (IS_RENTAL && pathname) {
      handleGoToTourStep(34);
    }
  };

  const [defaultPeriod, setDefaultPeriod] = useState(
    unitData?.renew_fee_period || "yearly"
  );

  return (
    <div className="unit-fee-breakdown-renew-tenant renewal-tenant-fee-form">
      <div className="flex items-center gap-2">
        <h4 className="text-primary-navy dark:text-white text-lg md:text-xl font-bold">
          Unit Fee Breakdown -{" "}
          {IS_RENTAL ? " Renewal Tenants" : " Renewal Occupants"}
        </h4>
        <button
          onClick={handleTourSection}
          type="button"
          className="text-orange-normal"
        >
          <ExclamationMark />
        </button>
      </div>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Select
          required
          id="renew_fee_period"
          options={rentPeriods}
          label={IS_RENTAL ? "Rent Period" : "Fee Period"}
          inputContainerClassName="bg-white"
          hiddenInputClassName="unit-form-input"
          resetKey={formResetKey}
          defaultValue={unitData?.renew_fee_period || "yearly"}
          onChange={setDefaultPeriod}
        />
        <Input
          id="renew_fee_amount"
          required
          label={IS_RENTAL ? "Rent Amount" : "Fee Amount"}
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={rentAmount}
          onChange={(value) => handleInputChange("rentAmount", value)}
          type="text"
          autoComplete="off"
        />
        <Input
          id="renew_service_charge"
          label={`Service Charge (${defaultPeriod})`}
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={serviceCharge}
          onChange={(value) => handleInputChange("serviceCharge", value)}
          type="text"
          autoComplete="off"
        />
        {!IS_RENTAL && (
          <Input
            id="renew_security_fee"
            label={`Security Fee (${defaultPeriod})`}
            inputClassName="bg-white unit-form-input"
            CURRENCY_SYMBOL={CURRENCY_SYMBOL}
            value={securityFee}
            onChange={(value) => handleInputChange("securityFee", value)}
            type="text"
            autoComplete="off"
          />
        )}
        {shouldChargeTenantAgencyFee && (
          <Input
            id="renew_agency_fee"
            label="Management Fee"
            inputClassName="bg-white"
            CURRENCY_SYMBOL={CURRENCY_SYMBOL}
            value={agencyFee}
            readOnly
            type="text"
            autoComplete="off"
          />
        )}
        {propertySettings?.VAT?.toLowerCase() === "yes" && (
          <Input
            id="renew_vat_amount"
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
          id="renew_other_charge"
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
          id="renew_total_package"
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

export default UnitBreakdownRenewalTenant;
