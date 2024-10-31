import React from "react";
import Image from "next/image";

// Images
import ShieldTick from "@/public/icons/shield-tick.svg";
import Warning from "@/public/icons/warning.svg";

// Imports
import { ModalPresetProps } from "./types";
import { modal_presets } from "./data";
import clsx from "clsx";

const ModalPreset: React.FC<ModalPresetProps> = ({
  type,
  style,
  children,
  className,
}) => {
  return (
    <div
      style={style}
      className={clsx(
        "p-8 custom-flex-col gap-4 rounded-[40px] bg-white dark:bg-black overflow-hidden text-center max-w-[326px]",
        className
      )}
    >
      <div className="flex justify-center">
        <div
          style={{ backgroundColor: modal_presets[type] }}
          className="w-28 h-28 flex items-center justify-center rounded-full"
        >
          <Image src={type === "warning" ? Warning : ShieldTick} alt="icon" />
        </div>
      </div>
      <p className="text-text-primary dark:text-white text-xl font-bold capitalize">
        {type}
      </p>
      {children}
    </div>
  );
};

export default ModalPreset;
