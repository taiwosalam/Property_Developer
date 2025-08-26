import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";

const SelectModal = () => {
  return (
    <LandlordTenantModalPreset
      className="!max-w-[600px]"
      heading="Add Staff With ID"
    >
      <div className="flex justify-center items-center flex-col gap-3">
        <Input
          className="w-[60%]"
          label="Enter Staff ID"
          id="staff id"
          placeholder="Enter Staff ID"
        />
        <Button
          className="max-w-[100px] !p-2 grid place-items-center text-center"
          onClick={() => {}}
        >
          Submit
        </Button>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default SelectModal;
