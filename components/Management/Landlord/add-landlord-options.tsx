// Imports
import useWindowWidth from "@/hooks/useWindowWidth";
import Button from "../../Form/Button/button";
import AddLandlordOrTenantCard from "../add-landlord-or-tenant-card";
// import { AddLandlordOptionsProps } from "./types";

type AddLandlordModalOptions =
  | "options"
  | "add-landlord"
  | "add-multiple-owners"
  | "invite-owner"
  | "invite-multiple-owners"
  | "add-landlord-with-email";

interface AddLandlordOptionsProps {
  showForm: React.Dispatch<React.SetStateAction<AddLandlordModalOptions>>;
}
const AddLandlordOptions: React.FC<AddLandlordOptionsProps> = ({
  showForm,
}) => {
  const { isMobile } = useWindowWidth();
  return (
    <>
      <div className="add-property-options flex items-center justify-center gap-7 md:gap-14 w-full overflow-hidden">
        <div className="flex justify-start md:justify-center md:items-center items-start w-full gap-2 overflow-x-auto custom-round-scrollbar scrollbar-hide">
          <AddLandlordOrTenantCard
            buttonText="create"
            title="Add Landlord/Landlady"
            onClick={() => showForm("add-landlord")}
            desc="You can only add a single owner at a time here."
            className="!w-[250px] shrink-0"
            style={{ minWidth: "0px"}}
          />
          <AddLandlordOrTenantCard
            buttonText="choose"
            title="Upload Multiple Owners"
            onClick={() => showForm("add-multiple-owners")}
            desc="You can add multiple landlords/Landladies at a time  by following the XLS format and utilizing your available records."
            className="!w-[250px] shrink-0"
            style={{ minWidth: "0px"}}
          />
        </div>
      </div>
      <div className="mt-10 flex flex-col md:flex-row gap-2 justify-center">
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
          onClick={() => showForm("add-landlord-with-email")}
        >
          Add with Email
        </Button>
      </div>
    </>
  );
};

export default AddLandlordOptions;
