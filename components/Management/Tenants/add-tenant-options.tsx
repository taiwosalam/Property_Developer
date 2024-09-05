// Imports
import Button from "../../Form/Button/button";
import AddLandlordOrTenantCard from "../add-landlord-or-tenant-card";
import { AddTenantOptionsProps } from "./types";

const AddTenantOptions: React.FC<AddTenantOptionsProps> = ({ showForm }) => {
  return (
    <>
      <div className="flex justify-center gap-14">
        <AddLandlordOrTenantCard
          buttonText="create"
          title="Add Tenant/Occupant"
          onClick={() => showForm("add-tenant")}
          desc="You can only add a single Tenant or Occupant at a time here."
        />
        <AddLandlordOrTenantCard
          buttonText="choose"
          title="Upload Multiple Owners"
          onClick={() => showForm("add-multiple-users")}
          desc="You can add multiple users at a time 
        by following the XLS format and utilizing
         the available records."
        />
      </div>
      <div className="flex gap-2 justify-center">
        <Button
          size="base_medium"
          className="py-2 px-8"
          onClick={() => showForm("invite-single-user")}
        >
          Invite Single User
        </Button>
        <Button
          size="base_medium"
          className="py-2 px-8"
          onClick={() => showForm("invite-multiple-users")}
        >
          Invite Multiple Users
        </Button>
        <Button
          size="base_medium"
          className="py-2 px-8"
          onClick={() => showForm("add-user-with-id")}
        >
          Add User with ID
        </Button>
      </div>
    </>
  );
};

export default AddTenantOptions;
