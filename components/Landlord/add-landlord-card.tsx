import React from "react";

// Types
import type { AddLandlordCardProps } from "./types";

// Imports
import Button from "../Form/Button/button";

const AddLandlordCard: React.FC<AddLandlordCardProps> = ({
  desc,
  title,
  onClick,
  buttonText,
}) => {
  return (
    <div className="w-[250px] h-[250px] flex gap-5 flex-col text-center items-center justify-center rounded-2xl border border-solid border-brand-9 bg-neutral-2">
      <p className="text-brand-9 text-xl font-medium capitalize">{title}</p>
      <p className="text-[#606060] text-xs font-normal">{desc}</p>
      <Button onClick={onClick} size="base_medium" className="py-2 px-8">
        {buttonText}
      </Button>
    </div>
  );
};

export default AddLandlordCard;
