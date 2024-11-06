import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import Switch from "@/components/Form/Switch/switch";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import MenuModalPreset from "../../landlord-tenant-modal-preset";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SwitchUnitModal: React.FC<{ isRental: boolean }> = ({ isRental }) => {
  const searchParams = useSearchParams();
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const router = useRouter();
  const [modalView, setModalView] = useState<"warning" | "menu">("warning");

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
            <Button onClick={() => setModalView("menu")}>OK</Button>
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
        style={{ maxWidth: "600px", height: isRental ? "auto" : "400px" }}
      >
        <div className="flex flex-col gap-14">
          {isRental && (
            <div className="flex flex-col gap-4 text-text-secondary text-[14px] font-medium">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    size={15}
                    checked={checked1}
                    onClick={() => {
                      setChecked1((x) => !x);
                    }}
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
                  onClick={() => {
                    setChecked2((x) => !x);
                  }}
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
          <div className="flex items-center justify-center my-auto">
            <div className="space-y-5">
              <Select
                id=""
                label="Select Unit"
                className="min-w-[300px]"
                options={[
                  { value: "1", label: "Option 1" },
                  { value: "2", label: "Option 2" },
                  { value: "3", label: "Option 3" },
                ]}
              />
              <div className="w-full flex items-center justify-center">
                <Button
                  onClick={() => {
                    router.push(
                      `/management/rent-unit/1/edit-rent/change-unit?type=${propertyType}`
                    );
                  }}
                  className="py-2 px-8"
                  size="base_medium"
                >
                  Add
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
