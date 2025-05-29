"use client";

import { useEffect, useState } from "react";
// Types
import type { AddPropertyModalViews } from "./types";

import AddPropertyOptionsView from "./add-property-options";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import AddPropertyWithId from "./add-property-with-id";
import { useTourStore } from "@/store/tour-store";

const AddPropertyModal = ({ isOpen }: { isOpen?: boolean }) => {
  const [view, setView] = useState<AddPropertyModalViews>("options");
  const { tour: tourState, setTourState } = useTourStore();

  // Sync tour with modal view
  useEffect(() => {
    if (!isOpen || !tourState.run || tourState.tourKey !== "PropertiesTour")
      return;
    const stepIndex = tourState.stepIndex;
    if (stepIndex === 3 && view !== "options") {
      console.log("AddPropertyModal: Setting view to options for tour step 3");
      setView("options");
    } else if (stepIndex === 4 && view !== "add-property-with-id") {
      console.log(
        "AddPropertyModal: Setting view to add-property-with-id for tour step 4"
      );
      setView("add-property-with-id");
    }
  }, [isOpen, view, tourState, setView]);

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
      heading: "Request Property with ID",
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
