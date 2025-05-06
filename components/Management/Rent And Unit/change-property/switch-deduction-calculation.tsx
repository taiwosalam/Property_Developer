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
  const { calculation, deduction, setCalculation, setDeduction } =
    useOccupantStore();

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
            <p>
              {calculation
                ? "Calculate the total package of the new rent, including caution deposit, service charge, agency fee, legal fee, and other charges for the tenants transferring to the new unit."
                : "Charge the tenants the same total package as renewal tenants since they were tenants in one of the units of the property before."}
            </p>
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
            <p>
              {deduction
                ? "Deduct the current outstanding rent balance from the cost of the new unit when calculating the total cost."
                : "Do not deduct the current outstanding rent balance from the cost of the new units that the occupants are moving into."}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default TenantCalculationSwitch;
