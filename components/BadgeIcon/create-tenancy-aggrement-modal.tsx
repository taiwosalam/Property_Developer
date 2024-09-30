import React from "react";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import Button from "../Form/Button/button";
import Input from "../Form/Input/input";

const CreateTenancyAggrementModal = () => {
  return (
    <LandlordTenantModalPreset
      style={{ maxWidth: "714px" }}
      heading="Create Tenancy Agreement"
    >
      <div className="flex justify-center">
        <div className="custom-flex-col gap-5">
          <Input id="property-id" label="property ID" inputClassName="min-w-[300px]" />
          <div className="flex justify-center">
            <Button size="base_bold" className="py-2 px-8">
              add
            </Button>
          </div>
        </div>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default CreateTenancyAggrementModal;
