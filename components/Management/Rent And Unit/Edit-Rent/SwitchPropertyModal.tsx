import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import FormModalPreset from "../../landlord-tenant-modal-preset";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SwitchPropertyModal = () => {
  const router = useRouter();
  const [modalView, setModalView] = useState<"warning" | "form">("warning");

  if (modalView === "warning") {
    return (
      <ModalPreset type="warning" className="w-full min-w-[360px]">
        <div className="flex flex-col gap-11">
          <div className="flex flex-col gap-10">
            <p className="text-text-tertiary text-[14px]">
              Are you sure you want to proceed with moving the tenant&apos;s
              records from the current unit to another unit of another property?
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => setModalView("form")}>OK</Button>
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

  if (modalView === "form") {
    return (
      <FormModalPreset
        heading="Add Property ID"
        back={{ handleBack: () => setModalView("warning") }}
        style={{ maxWidth: "600px" }}
      >
        <div className="space-y-5 max-w-[300px] mx-auto">
          <Select
            id=""
            label="Choose Property"
            options={[
              { value: "1", label: "Option 1" },
              { value: "2", label: "Option 2" },
              { value: "3", label: "Option 3" },
              { value: "3", label: "Option 3" },
              { value: "3", label: "Option 3" },
              { value: "3", label: "Option 3" },
              { value: "3", label: "Option 3" },
              { value: "3", label: "Option 3" },
              { value: "3", label: "Option 3" },
              { value: "3", label: "Option 3" },
            ]}
          />
          <div className="w-full flex items-center justify-center">
            <Button
              onClick={() => {
                router.push(
                  "/management/rent-unit/1/edit-rent/change-property"
                );
              }}
              className="py-2 px-8"
              size="base_medium"
            >
              Add
            </Button>
          </div>
        </div>
      </FormModalPreset>
    );
  }

  return null;
};

export default SwitchPropertyModal;
