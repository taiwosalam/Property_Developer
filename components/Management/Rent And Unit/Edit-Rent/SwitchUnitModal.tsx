import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import Switch from "@/components/Form/Switch/switch";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import MenuModalPreset from "../../landlord-tenant-modal-preset";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SwitchUnitModal = () => {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const router = useRouter();
  const [modalView, setModalView] = useState<"warning" | "menu">("warning");

  if (modalView === "warning") {
    return (
      <ModalPreset type="warning" className="w-full min-w-[360px]">
        <div className="flex flex-col gap-11">
          <div className="flex flex-col gap-10">
            <p className="text-text-tertiary text-[14px]">
              Are you sure you want to proceed with moving the tenant&apos;s
              records from the current unit to another unit of the same
              property?
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
        </div>
      </ModalPreset>
    );
  }

  if (modalView === "menu") {
    return (
      <MenuModalPreset
        heading="Transfer To New Unit"
        back={{ handleBack: () => setModalView("warning") }}
        style={{ maxWidth: "600px" }}
      >
        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  size={15}
                  onClick={() => {
                    setChecked1(checked1 === false ? true : false);
                  }}
                  checked={checked1 == true}
                />
                <p className="text-text-secondary text-[14px] font-medium">
                  Calculation
                </p>
              </div>
              <p className="text-text-secondary text-[14px] font-medium">
                {checked1 == false
                  ? "Calculate the total package of the new fee, including service charge and other Charges) for the occupant that you are transferring to the new unit."
                  : "Calculate the total package of the new rent, including caution deposit, Service Charge, agency fee, legal fee and other Charges) for the tenants that you are transferring to the new unit."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                size={15}
                onClick={() => {
                  setChecked2(checked2 === false ? true : false);
                }}
                checked={checked2 == true}
              />
              <p className="text-text-secondary text-[14px] font-medium">
                Deduction
              </p>
            </div>
            <p className="text-text-secondary text-[14px] font-medium">
              {checked2 == false
                ? "Calculate the total package of the new fee, including service charge and other Charges) for the occupant                          that you are transferring to the new unit."
                : "Do not deduct the current outstanding fee balance from the cost of the new unit that the occupant are moving into."}
            </p>
          </div>
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
                    router.push("/management/rent-unit/edit-rent/change-unit");
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
