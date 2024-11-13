"use client";

import { useState } from "react";
// Types
import type { AddPropertyModalViews } from "./types";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import AddPropertyOptionsView from "./add-property-options";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";

const AddPropertyModal = () => {
 
  const [view, setView] = useState<AddPropertyModalViews>("options");
  const handleBack = () => {
    setView("options");
  };
  const modal_states: Record<
    AddPropertyModalViews,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    options: {
      heading: "Add Property",
      content: <AddPropertyOptionsView setModalView={setView} />,
    },
    "add-property-with-id": {
      heading: "Add Property with ID",
      content: (
        <form className="flex justify-center" onSubmit={() => {}}>
          <div className="custom-flex-col gap-5 w-[300px]">
            <Input
              id="profile_id"
              label="Input property ID"
              inputClassName="rounded-[8px]"
            />
            <div className="flex justify-center">
              <Button type="submit" size="base_medium" className="py-2 px-8">
                invite
              </Button>
            </div>
          </div>
        </form>
      ),
    },
  };

  return (
    <LandlordTenantModalPreset
      heading={modal_states[view].heading}
      back={view !== "options" ? { handleBack } : undefined}
    >
      {modal_states[view].content}
    </LandlordTenantModalPreset>
  );
};

export default AddPropertyModal;
