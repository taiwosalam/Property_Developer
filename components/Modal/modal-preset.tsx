import React from "react";
import Image from "next/image";

// Images
import ShieldTick from "@/public/icons/shield-tick.svg";

// Imports
import { ModalPresetProps } from "./types";
import { modal_presets } from "./data";

const ModalPreset: React.FC<ModalPresetProps> = ({ type, children }) => {
  return (
    <div className="p-8 custom-flex-col gap-4 rounded-[40px] bg-white overflow-hidden text-center">
      <div className="flex justify-center">
        <div
          style={{ backgroundColor: modal_presets[type] }}
          className="w-28 h-28 flex items-center justify-center rounded-full"
        >
          <Image src={ShieldTick} alt="icon" />
        </div>
      </div>
      <p className="text-text-primary text-xl font-bold capitalize">{type}</p>
      {children}
    </div>
  );
};

export default ModalPreset;
