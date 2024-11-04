"use client";

import ModalPreset from "../landlord-tenant-modal-preset";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";

const AddOccupantWithId = () => {
  return (
    <ModalPreset heading="Add occupant with ID" style={{ maxWidth: "600px" }}>
      <form className="flex justify-center" onSubmit={() => {}}>
        <div className="custom-flex-col gap-5 w-[300px]">
          <Input
            id="profile_id"
            label="Input Occupant ID"
            inputClassName="rounded-[8px]"
          />
          <div className="flex justify-center">
            <Button type="submit" size="base_medium" className="py-2 px-8">
              invite
            </Button>
          </div>
        </div>
      </form>
    </ModalPreset>
  );
};

export default AddOccupantWithId;
