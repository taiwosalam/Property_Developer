import { Currency } from "@/utils/number-formatter";
import { FeeDetails, RentSectionTitle } from "../rent-section-container";
import { FeeDetail } from "../types";
import { useGlobalStore } from "@/store/general-store";
import { useOccupantStore } from "@/hooks/occupant-store";
import { getNewUnitFeeDetails } from "./data";
import TenantCalculationSwitch from "./switch-deduction-calculation";

export const ChangePropertyNewUnitCost: React.FC<{
  id?: string;
  isExcess?: boolean;
  title?: string;
}> = ({ id, title, isExcess }) => {
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const currentRentStats = useGlobalStore((s) => s.currentRentStats);
  const currentUnit = useGlobalStore((s) => s.currentUnit);
  const { calculation, deduction, unitData } = useOccupantStore();
  const propertyType = unitData.propertyType;
  const periodText =
    unitData.fee_period.charAt(0).toUpperCase() + unitData.fee_period.slice(1);

  // Return null if unitData is not available
  if (!unitData) {
    return null; // Or <div>Loading...</div>
  }

  const newUnitTotal = calculation
    ? Number(unitData.newTenantTotalPrice || 0)
    : Number(unitData.renewalTenantTotalPrice || 0);
  const isRental = propertyType?.toLowerCase() === "rental";
  const feeTitle = isRental ? "Breakdown" : `${periodText} Fee`;
  const finalTitle = calculation ? `${feeTitle}` : `${feeTitle}`;

  const feeDetails = getNewUnitFeeDetails(unitData, calculation, isRental);
  const headingText = isRental ? "New Rent" : "New Fee";
  const calTextPlus = isRental
    ? "Calculate the total package of the new rent, including caution deposit, service charge, agency fee, legal fee, and other charges for the tenants transferring to the new unit."
    : "Calculate the total package of the new occupant, including service charge, and other charges for the occupant transferring to the new unit.";
  const calTextMinus = isRental
    ? "Charge the tenants the same total package as renewal tenants since they were tenants in one of the units of the property before."
    : "Charge the occupant the same total package as renewal occupant since they were occupant in one of the units of the property before.";

  // NB: 💀💀💀👿ALL CLASSNAME IN PARENT DIV IS FOR TOUR GUIDE - DON'T CHANGE e.g new-rent-wrapper💀💀💀👿
  return (
    <div className="new-rent-wrapper space-y-1">
      <RentSectionTitle>{title || headingText}</RentSectionTitle>
      <TenantCalculationSwitch switches={["calculation"]} />
      {isExcess && (
        <p className="text-sm">{calculation ? calTextPlus : calTextMinus}</p>
      )}
      <FeeDetails
        noEdit
        title={finalTitle}
        feeDetails={feeDetails}
        isExcess={isExcess}
        currency={unitData.currency as Currency}
        total_package={newUnitTotal}
        deduction={deduction}
        id={id as string}
      />
    </div>
  );
};
