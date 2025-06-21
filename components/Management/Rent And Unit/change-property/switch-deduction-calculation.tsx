import Switch from "@/components/Form/Switch/switch";
import { SectionSeparator } from "@/components/Section/section-components";
import { useOccupantStore } from "@/hooks/occupant-store";
import React from "react";

type SwitchType = "calculation" | "deduction";

interface TenantCalculationSwitchProps {
  switches?: SwitchType[]; // Array of switches to display
}

const TenantCalculationSwitch: React.FC<TenantCalculationSwitchProps> = ({
  switches = ["calculation", "deduction"], // Default to both switches
}) => {
  const { calculation, deduction, unitData, setCalculation, setDeduction } =
    useOccupantStore();
  const propertyType = unitData.propertyType;
  const isRental = propertyType?.toLowerCase() === "rental";

  const calTextPlus = isRental
    ? "Calculate the total package of the new rent, including caution deposit, service charge, agency fee, legal fee, and other charges for the tenants transferring to the new unit."
    : "Calculate the total package of the new occupant, including service charge, and other charges for the occupant transferring to the new unit.";
  const calTextMinus = isRental
    ? "Charge the tenants the same total package as renewal tenants since they were tenants in one of the units of the property before."
    : "Charge the occupant the same total package as renewal occupant since they were occupant in one of the units of the property before.";
  const deductPlus = isRental
    ? "Deduct the current outstanding rent balance from the cost of the new unit when calculating the total cost."
    : "Deduct the current outstanding rent balance from the cost of the new unit when calculating the total cost.";
  const deductMinus = isRental
    ? "Do not deduct the current outstanding rent balance from the cost of the new units that the tenants are moving into."
    : "Do not deduct the current outstanding rent balance from the cost of the new units that the occupants are moving into.";

  const handleCalculationToggle = () => {
    setCalculation(!calculation);
  };

  const handleDeductionToggle = () => {
    setDeduction(!deduction);
  };

  // Validate switches prop
  const validSwitches = switches.filter((s) =>
    ["calculation", "deduction"].includes(s)
  );

  if (validSwitches.length === 0) return null;

  return (
    <>
      <SectionSeparator className="my-4 h-[2px]" />
      <div className="space-y-6 text-text-secondary dark:text-darkText-1 text-sm font-medium">
        {validSwitches.includes("calculation") && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={calculation}
                onClick={handleCalculationToggle}
                aria-label="Toggle calculation"
              />
              <p>Calculation</p>
            </div>
            <p>{calculation ? calTextPlus : calTextMinus}</p>
          </div>
        )}
        {validSwitches.includes("deduction") && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={deduction}
                onClick={handleDeductionToggle}
                aria-label="Toggle deduction"
              />
              <p>Deduction</p>
            </div>
            <p>{deduction ? deductPlus : deductMinus}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TenantCalculationSwitch;
