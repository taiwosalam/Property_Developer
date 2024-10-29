import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import Switch from "@/components/Form/Switch/switch";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { DeleteIconX } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SwitchUnitModal = () => {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const router = useRouter();
  return (
    <div>
      <ModalPreset type="warning" className="w-full min-w-[360px]">
        <div className="flex flex-col gap-11">
          <div className="flex flex-col gap-10">
            <p className="text-text-tertiary text-[14px]">
              Are you sure you want to proceed with moving the tenant&apos;s
              records from the current unit to another unit of the same
              property?
            </p>
            <div className="flex flex-col gap-2">
              <Modal>
                <ModalTrigger asChild>
                  <Button>OK</Button>
                </ModalTrigger>
                <ModalContent>
                  <div className="w-[700px] max-w-[80%] max-h-[60vh] h-full rounded-[20px] bg-white overflow-y-auto custom-round-scrollbar">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-solid border-[#B8B8B8] sticky z-[1] top-0 px-[30px] pt-[12px] md:pt-[30px] bg-white">
                      <div className="flex items-center gap-2">
                        <p className="text-primary-navy text-base md:text-lg lg:text-xl font-bold capitalize">
                          Transfer To New Unit
                        </p>
                      </div>
                      <ModalTrigger
                        close
                        className="p-2"
                        type="button"
                        aria-label="close"
                      >
                        <DeleteIconX size={34} />
                      </ModalTrigger>
                    </div>
                    {/* body */}
                    <div className="flex flex-col gap-14 p-6">
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
                            id="dfsjhgv"
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
                                  "/management/rent-unit/edit-rent/change-unit"
                                );
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ModalContent>
              </Modal>
              <ModalTrigger asChild close>
                <Button variant="blank" className="text-brand-9">
                  Back
                </Button>
              </ModalTrigger>
            </div>
          </div>
        </div>
      </ModalPreset>
    </div>
  );
};

export default SwitchUnitModal;
