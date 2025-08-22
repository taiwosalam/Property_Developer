import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import { useDrawerStore } from "@/store/drawerStore";
import { useModal } from "../Modal/modal"; 


const LegalProcedureModal: React.FC<{
  type:
    | "tenancy_agreement"
    | "quit_notice"
    | "warning_reminder"
    | "court_process"
    | "possession"
    | "other";
  title: string;
}> = ({ type, title }) => {

  const { openDrawer } = useDrawerStore();
  const {setIsOpen} = useModal()
  const openLegalDrawer = ()=> {
    setIsOpen(false)
    openDrawer()
  }
  return (
    <LandlordTenantModalPreset
      heading={title}
      style={{ maxWidth: "600px", height: "400px" }}
    >
      <div className="space-y-5 max-w-[300px] mx-auto mt-5">
        <Select
          id="property"
          label="Select Property"
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
        {type !== "tenancy_agreement" && (
          <Select
            id="unit"
            label="Select Property Unit"
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
        )}
        <div className="w-full flex items-center justify-center">
          <Button
            className="py-2 px-8"
            size="base_medium"
            {...(type === "tenancy_agreement"
              ? { href: "/documents/create-tenancy-agreement" }
              : {})}
            onClick={
              type !== "tenancy_agreement" ? () => openLegalDrawer() : undefined
            }
          >
            Proceed
          </Button>
        </div>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default LegalProcedureModal;
