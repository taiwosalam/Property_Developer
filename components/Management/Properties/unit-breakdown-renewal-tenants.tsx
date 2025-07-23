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
        ? formatNumber(parseFloat(unitData.renew_fee_amount))
        : "",
      agencyFee: unitData?.agency_fee
        ? formatNumber(parseFloat(unitData.agency_fee))
        : "",
      serviceCharge: unitData?.renew_service_charge
        ? formatNumber(parseFloat(unitData.renew_service_charge))
        : "",
      otherCharges: unitData?.renew_other_charge
        ? formatNumber(parseFloat(unitData.renew_other_charge))
        : "",
      securityFee: unitData?.security_fee
        ? formatNumber(
            parseFloat((unitData.renew_security_fee || "0").toString())
          )
        : "",
      // Initialize VAT to "0"
      vat: unitData?.renew_vat
        ? formatNumber(parseFloat(unitData.renew_vat as string))
        : "0",
      totalPackage: unitData?.renew_total_package
        ? formatNumber(parseFloat(unitData.renew_total_package))
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
    const shouldCalculateVAT = propertySettings?.VAT?.toLowerCase() === "yes";
    // const rentTenPercent = (rentAmountValue * agencyFeePercentage) / 100;
    const rentTenPercent = rentAmountValue * 0.1;
    const calculatedVAT = shouldCalculateVAT ? rentTenPercent * 0.075 : 0;

    setFormValues((prevValues) => ({
      ...prevValues,
      vat: formatNumber(calculatedVAT.toFixed(2)),
    }));
  }, [rentAmount, propertySettings?.VAT]);

  // Calculate Agency Fee based on rentAmount and agencyFeePercentage
  useEffect(() => {
    const rentAmountValue = parseFloat(rentAmount.replace(/,/g, "")) || 0;
    const calculatedAgencyFee = shouldChargeTenantAgencyFee
      ? (rentAmountValue * agencyFeePercentage) / 100
      : 0;

    setFormValues((prevValues) => ({
      ...prevValues,
      agencyFee: formatNumber(calculatedAgencyFee.toFixed(2)),
    }));
  }, [rentAmount, agencyFeePercentage, shouldChargeTenantAgencyFee]);

  // Calculate the total package including VAT if enabled
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
  }, [rentAmount, agencyFee, serviceCharge, otherCharges, vat]);

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

  return (
    <div className="unit-fee-breakdown-renew-tenant renewal-tenant-fee-form">
      <div className="flex items-center gap-2">
        <h4 className="text-primary-navy dark:text-white text-lg md:text-xl font-bold">
          Unit Fee Breakdown -{" "}
          {IS_RENTAL ? " Renewal Tenants" : " Renewal Occupants"}
        </h4>
        <button
          onClick={() => {
            if(!IS_RENTAL) {
               handleGoToTourStep(11);
            }else if(IS_RENTAL) {
              handleGoToTourStep(27);
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
          required
          id="renew_fee_period"
          options={rentPeriods}
          label={IS_RENTAL ? "Rent Period" : "Fee Period"}
          inputContainerClassName="bg-white"
          hiddenInputClassName="unit-form-input"
          resetKey={formResetKey}
          defaultValue={unitData?.renew_fee_period || "yearly"}
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
          label="Service Charge"
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={serviceCharge}
          onChange={(value) => handleInputChange("serviceCharge", value)}
          type="text"
          autoComplete="off"
        />
        <Input
          id="renew_security_fee"
          label="Security Fee"
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          value={securityFee}
          onChange={(value) => handleInputChange("securityFee", value)}
          type="text"
          autoComplete="off"
        />
        {shouldChargeTenantAgencyFee && (
          <Input
            id="renew_agency_fee"
            // label={IS_RENTAL ? "Management Fee" : "Agency Fee"}
            label="Management Fee"
            inputClassName="bg-white"
            CURRENCY_SYMBOL={CURRENCY_SYMBOL}
            value={agencyFee}
            readOnly
            type="text"
            autoComplete="off"
          />
        )}
        {/* Only display VAT input if VAT is enabled */}
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
