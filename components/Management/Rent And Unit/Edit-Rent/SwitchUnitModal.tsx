"use client";

import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import Switch from "@/components/Form/Switch/switch";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import MenuModalPreset from "../../landlord-tenant-modal-preset";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { transformUnitOptions, UnitsApiResponse } from "./data";
import { useOccupantStore } from "@/hooks/occupant-store";
import { toast } from "sonner";
import { useRole } from "@/hooks/roleContext";

const SwitchUnitModal: React.FC<{
  isRental: boolean;
  propertyId: number;
  unitId: number;
}> = ({ isRental, propertyId, unitId }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const { calculation, deduction, setCalculation, setDeduction } =
    useOccupantStore();
  const [checked1, setChecked1] = useState(calculation);
  const [checked2, setChecked2] = useState(deduction);
  const router = useRouter();
  const [modalView, setModalView] = useState<"warning" | "menu">("warning");
  const [unitsOptions, setUnitsOptions] = useState<any[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const { role } = useRole();

  const {
    data: unitsData,
    error: unitsError,
    loading: UnitsLoading,
  } = useFetch<UnitsApiResponse>(`/unit/${propertyId}/all`);

  useEffect(() => {
    if (unitsData) {
      const unitsTransformOptions = transformUnitOptions(unitsData).filter(
        (unit) => unit.value !== unitId
      );
      setUnitsOptions(unitsTransformOptions);
    }
  }, [unitsData, unitId]);

  // console.log("unitsOptions", unitsData);

  useEffect(() => {
    setChecked1(calculation);
  }, [calculation]);

  useEffect(() => {
    setChecked2(deduction);
  }, [deduction]);

  const handleChecked1Click = () => {
    const newChecked1 = !checked1;
    setChecked1(newChecked1);
    setCalculation(newChecked1);
  };

  const handleChecked2Click = () => {
    const newChecked2 = !checked2;
    setChecked2(newChecked2);
    setDeduction(newChecked2);
  };

  const getBasePath = () => {
    switch (role) {
      case "director":
        return "/management";
      case "staff":
        return "/staff/management";
      case "manager":
        return "/manager/management";
      case "account":
        return "/accountant/management";
      default:
        return "/unauthorized";
    }
  }

  const handleContinue = () => {
    if (!selectedUnitId) {
      toast.warning("Please select a unit");
      return;
    }
    router.push(
      `${getBasePath()}/rent-unit/${id}/edit-rent/change-unit?type=${propertyType}&p=${propertyId}&u=${selectedUnitId}`
    );
  };

  const proceedToSelectUnit = () => {
    router.push(
      `${getBasePath()}/rent-unit/${id}/edit-rent/select-unit?type=${propertyType}&p=${propertyId}`
    );
  };

  if (modalView === "warning") {
    return (
      <ModalPreset type="warning">
        <div className="flex flex-col gap-10">
          <p className="text-text-tertiary text-[14px]">
            Are you sure you want to proceed with moving the{" "}
            {isRental ? "tenant's" : "occupant's"} records from the current unit
            to another unit of the same property?
          </p>
          <div className="flex flex-col gap-2">
            {/* <Button onClick={() => setModalView("menu")}>Proceed</Button> */}
            <Button onClick={proceedToSelectUnit}>Proceed</Button>
            <ModalTrigger asChild close>
              <Button variant="blank" className="text-brand-9">
                Back
              </Button>
            </ModalTrigger>
          </div>
        </div>
      </ModalPreset>
    );
  }

  if (modalView === "menu") {
    return (
      <MenuModalPreset
        heading="Transfer To New Unit"
        back={{ handleBack: () => setModalView("warning") }}
        style={{
          maxWidth: "600px",
          height: isRental ? "auto" : "400px",
          overflow: "visible",
        }}
      >
        <div className="flex flex-col gap-14">
          {isRental && (
            <div className="flex flex-col gap-4 text-text-secondary text-[14px] font-medium">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    size={15}
                    checked={checked1}
                    onClick={handleChecked1Click}
                    // onClick={() => {
                    //   setChecked1((x) => !x);
                    // }}
                  />
                  <p>Calculation</p>
                </div>
                <p>
                  {!checked1
                    ? "Charge the tenants the same total package as renewal tenants since they were tenants in one of the units of the property before."
                    : "Calculate the total package of the new rent, including caution deposit, Service Charge, agency fee, legal fee and other Charges for the tenants that you are transferring to the new unit."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  size={15}
                  checked={checked2}
                  onClick={handleChecked2Click}
                />
                <p>Deduction</p>
              </div>
              <p>
                {!checked2
                  ? "Deduct the current outstanding rent balance from the cost of the new unit when calculating the total cost."
                  : "Do not deduct the current outstanding rent balance from the cost of the new unit that the tenants are moving into."}
              </p>
            </div>
          )}
          <div className="flex items-center justify-center my-auto relative z-[1000]">
            <div className="space-y-5">
              <Select
                id=""
                label="Select Unit"
                className="min-w-[300px]"
                options={unitsOptions}
                onChange={setSelectedUnitId}
                placeholder={
                  UnitsLoading
                    ? "Loading Units..."
                    : unitsError
                    ? "Error loading Units"
                    : "Select Unit"
                }
                error={unitsError}
                disabled={UnitsLoading}
              />
              <div className="w-full flex items-center justify-center">
                <Button
                  onClick={handleContinue}
                  className="py-2 px-8"
                  size="base_medium"
                >
                  Proceed
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MenuModalPreset>
    );
  }
  return null;
};

export default SwitchUnitModal;
