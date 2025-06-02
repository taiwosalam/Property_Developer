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
  const { calculation, deduction, unitData, propertyType } = useOccupantStore();

  // Return null if unitData is not available
  if (!unitData) {
    return null; // Or <div>Loading...</div>
  }

  const newUnitTotal = calculation
    ? Number(unitData.newTenantTotalPrice || 0)
    : Number(unitData.renewalTenantTotalPrice || 0);
  const isRental = propertyType?.toLowerCase() === "rental";
  const feeTitle = isRental ? "Breakdown" : "Annual Fee";
  const finalTitle = calculation ? `${feeTitle}` : `${feeTitle}`;

  const feeDetails = getNewUnitFeeDetails(unitData, calculation, isRental);

   // NB: 💀💀💀👿ALL CLASSNAME IN PARENT DIV IS FOR TOUR GUIDE - DON'T CHANGE e.g new-rent-wrapper💀💀💀👿
  return (
    <div className="new-rent-wrapper space-y-1">
      <RentSectionTitle>{title || "New Rent"}</RentSectionTitle>
      <TenantCalculationSwitch switches={["calculation"]} />
      {isExcess && (
        <p className="text-sm">
          {calculation
            ? "Calculate the total package of the new rent, including caution deposit, service charge, agency fee, legal fee, and other charges for the tenants transferring to the new unit."
            : "Charge the tenants the same total package as renewal tenants since they were tenants in one of the units of the property before."}
        </p>
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
