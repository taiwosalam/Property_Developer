"use client";

import { useEffect, useState } from "react";
// Types
import type { AddPropertyModalViews } from "./types";

import AddPropertyOptionsView from "./add-property-options";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import AddPropertyWithId from "./add-property-with-id";
import { useTourStore } from "@/store/tour-store";

const AddPropertyModal = ({ isOpen, id }: { isOpen?: boolean; id?: number }) => {
  const [view, setView] = useState<AddPropertyModalViews>("options");
  const { tour: tourState, setTourState } = useTourStore();

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
      content: <AddPropertyOptionsView id={id} setModalView={setView} />,
    },
    "add-property-with-id": {
      heading: "Request Property with ID",
      content: <AddPropertyWithId />,
    },
  };

  return (
    <LandlordTenantModalPreset
      heading={modal_states[view].heading}
      style={{ overflow: "hidden" }}
      back={view !== "options" ? { handleBack } : undefined}
    >
      {modal_states[view].content}
    </LandlordTenantModalPreset>
  );
};

export default AddPropertyModal;
