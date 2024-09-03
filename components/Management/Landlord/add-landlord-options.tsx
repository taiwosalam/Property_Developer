import React from "react";

// Imports
import Button from "../../Form/Button/button";
import AddLandlordCard from "./add-landlord-card";
import { AddLandlordOptionsProps } from "./types";

const AddLandlordOptions: React.FC<AddLandlordOptionsProps> = ({
  showForm,
}) => {
  return (
    <>
      <div className="flex justify-center gap-14">
        <AddLandlordCard
          buttonText="create"
          title="Add Landlord/Landlady"
          onClick={() => showForm("add-landlord")}
          desc="You can only add a single owner at a time here."
        />
        <AddLandlordCard
          buttonText="choose"
          title="Upload Multiple Owners"
          onClick={() => showForm("add-multiple-owners")}
          desc="You can add multiple landlords/Landladies at a time  by following the XLS format and utilizing your available records."
        />
      </div>
      <div className="flex gap-2 justify-center">
        <Button
          size="base_medium"
          className="py-2 px-8"
          onClick={() => showForm("invite-owner")}
        >
          Invite Owner
        </Button>
        <Button
          size="base_medium"
          className="py-2 px-8"
          onClick={() => showForm("invite-multiple-owners")}
        >
          Invite Multiple Owners
        </Button>
        <Button
          size="base_medium"
          className="py-2 px-8"
          onClick={() => showForm("add-landlord-with-id")}
        >
          Add with ID
        </Button>
      </div>
    </>
  );
};

export default AddLandlordOptions;
