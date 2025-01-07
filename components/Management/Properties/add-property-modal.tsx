"use client";

import { useState } from "react";
// Types
import type { AddPropertyModalViews } from "./types";

import AddPropertyOptionsView from "./add-property-options";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import AddPropertyWithId from "./add-property-with-id";

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
      content: <AddPropertyWithId />,
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
