"use client";

import { useState } from "react";
import Image from "next/image";
// Types
import type { AddPropertiesModalViews } from "./types";
import { ModalTrigger } from "@/components/Modal/modal";
// Images
import CloseCircle from "@/public/icons/close-circle.svg";
import ChevronLeft from "@/public/icons/chevron-left.svg";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import AddPropertiesOptionsView from "./add-property-options";

const AddPropertyModal = () => {
  const [view, setView] = useState<AddPropertiesModalViews>("options");
  const handleBack = () => {
    setView("options");
  };
  const modal_states: Record<
    AddPropertiesModalViews,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    options: {
      heading: "Add Property",
      content: <AddPropertiesOptionsView setModalView={setView} />,
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
    <div className="w-[900px] max-w-[80%] max-h-[85%] rounded-[20px] bg-white overflow-x-auto custom-round-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-solid border-[#B8B8B8] sticky z-[1] top-0 px-[30px] pt-[12px] md:pt-[30px] bg-white">
        <div className="flex items-center gap-2">
          {view !== "options" && (
            <button type="button" onClick={handleBack}>
              <Image
                src={ChevronLeft}
                alt="back"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          )}
          <p className="text-primary-navy text-base md:text-lg lg:text-xl font-bold capitalize">
            {modal_states[view].heading}
          </p>
        </div>
        <ModalTrigger close className="p-2" type="button">
          <Image
            src={CloseCircle}
            alt="close"
            width={34}
            height={34}
            className="min-w-[34px] min-h-[34px]"
          />
        </ModalTrigger>
      </div>
      {/* body */}
      <div className="px-[30px] pt-10 pb-[44px] md:pb-[56px]">
        {modal_states[view].content}
      </div>
    </div>
  );
};

export default AddPropertyModal;
