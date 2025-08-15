// Imports
import Button from "../../Form/Button/button";
import AddLandlordOrTenantCard from "../add-landlord-or-tenant-card";
import { AddTenantOptionsProps } from "./types";

const AddTenantOptions: React.FC<AddTenantOptionsProps> = ({ showForm }) => {
  return (
    <>
      <div className="add-property-options flex items-center justify-center gap-7 md:gap-14 w-full overflow-hidden">
        <div className="flex justify-start md:justify-center md:items-center items-start w-full gap-2 overflow-x-auto custom-round-scrollbar scrollbar-hide">
          <AddLandlordOrTenantCard
            buttonText="create"
            title="Add Tenant/Occupant"
            onClick={() => showForm("add-tenant")}
            desc="You can only add a single Tenant or Occupant at a time here."
            className="!w-[250px] shrink-0"
            style={{ minWidth: "0px" }}
          />
          <AddLandlordOrTenantCard
            buttonText="choose"
            title="Upload Multiple Users"
            onClick={() => showForm("add-multiple-users")}
            desc="You can add multiple users at a time 
        by following the XLS format and utilizing
         the available records."
            className="!w-[250px] shrink-0"
            style={{ minWidth: "0px" }}
          />
        </div>
      </div>
      <div className="mt-10 flex flex-col md:flex-row gap-2 justify-center">
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
          onClick={() => showForm("add-user-with-email")}
        >
          Add User with Email
        </Button>
      </div>
    </>
  );
};

export default AddTenantOptions;
