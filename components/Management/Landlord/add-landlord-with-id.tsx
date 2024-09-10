import React from "react";

// Imports
import Input from "../../Form/Input/input";
import Button from "../../Form/Button/button";

const AddLandlordWithId = () => {
  return (
    <div className="flex justify-center">
      <div className="custom-flex-col gap-5 w-[300px]">
        <Input id="profile-id" label="Input Profile ID" />
        <div className="flex justify-center">
          <Button size="base_medium" className="py-2 px-8">
            invite
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddLandlordWithId;
