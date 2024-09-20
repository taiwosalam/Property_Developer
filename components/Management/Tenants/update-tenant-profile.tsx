import React from "react";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";

const UpdateTenantProfile = () => {
  return (
    <LandlordTenantModalPreset heading={"Update Tenants/Occupant Profile"}>
      <form className="flex justify-center" onSubmit={() => {}}>
        <div className="custom-flex-col gap-5 w-[300px]">
          <Input
            id="profile_id"
            label="Input Profile ID"
            inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
          />
          <div className="flex justify-center">
            <Button type="submit" size="base_medium" className="py-2 px-8">
              Update
            </Button>
          </div>
        </div>
      </form>
    </LandlordTenantModalPreset>
  );
};

export default UpdateTenantProfile;
