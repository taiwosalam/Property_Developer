import React from "react";

// Imports
import Input from "../../Form/Input/input";
import Button from "../../Form/Button/button";

const InviteOwner = () => {
  return (
    <div className="flex justify-center">
      <div className="custom-flex-col gap-5 w-[300px]">
        <Input id="name" label="name" />
        <Input id="email" label="email" type="email" />
        <div className="flex justify-center">
          <Button size="base_medium" className="py-2 px-8">
            invite
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteOwner;
