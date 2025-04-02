// Types
import type { AddServiceProviderOptionsProps } from "./types";

// Imports
import Button from "../../Form/Button/button";
import AddServiceProviderCard from "@/components/Management/add-landlord-or-tenant-card";

const AddServiceProviderOptions: React.FC<AddServiceProviderOptionsProps> = ({
  showForm,
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center gap-7 md:gap-14">
        <AddServiceProviderCard
          buttonText="create"
          title="Add Service Provider"
          onClick={() => showForm("add-service-provider")}
        />
      </div>
      <div className="mt-10 flex flex-col md:flex-row gap-2 justify-center">
        <Button
          size="base_medium"
          className="py-2 px-8"
          onClick={() => showForm("invite-service-provider")}
        >
          Invite Service Provider
        </Button>
        <Button
          size="base_medium"
          className="py-2 px-8"
          onClick={() => showForm("add-with-email")}
        >
          Add with Email/ID
        </Button>
      </div>
    </>
  );
};

export default AddServiceProviderOptions;
