import React from "react";
import Image from "next/image";

// Images
import ShieldTick from "@/public/icons/shield-tick.svg";
import Warning from "@/public/icons/warning.svg";

// Imports
import { ModalPresetProps } from "./types";
import { modal_presets } from "./data";
import clsx from "clsx";
import { ArrowLeft } from "lucide-react";

interface ExtendedModalPresetProps extends ModalPresetProps {
  customWidth?: string;
  back?: () => void;
}

const ModalPreset: React.FC<ExtendedModalPresetProps> = ({
  type,
  style,
  children,
  className,
  customWidth,
  back,
}) => {
  return (
    <div
      style={style} // Apply any inline styles passed via style prop
      className={clsx(
        "p-8 custom-flex-col gap-4 rounded-[40px] bg-white dark:bg-black overflow-hidden text-center",
        customWidth ? customWidth : "max-w-[326px]", // Use customWidth if provided, else default to:max-w-[326px]
        className // Allow additional custom classes
      )}
    >
      <div className="flex items-start justify-start">
        {back ? (
          <button
            onClick={back}
            className="w-6 h-6 flex items-center justify-center"
          >
            <ArrowLeft size={18} color="currentColor" />
          </button>
        ) : (
          <div></div>
        )}
      </div>
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
