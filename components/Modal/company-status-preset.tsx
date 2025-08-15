import React from "react";
import Image from "next/image";

// Images
import ShieldTick from "@/public/icons/shield-tick.svg";
import Warning from "@/public/icons/warning.svg";

// Imports
import { ModalPresetProps } from "./types";
import { modal_presets } from "./data";
// Imports
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

const CommpanyStatusPreset: React.FC<ModalPresetProps> = ({
  type,
  back,
  style,
  children,
  className,
}) => {
  return (
    <div
      style={style}
      className={clsx(
        "p-8 custom-flex-col gap-4 rounded-[40px] bg-white dark:bg-black overflow-hidden text-center max-w-[90%]",
        className
      )}
    >
      <div className="flex items-center justify-between">
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
      {!back && (
        <>
          <div className="flex justify-center">
            <div
              style={{ backgroundColor: modal_presets[type] }}
              className="w-28 h-28 flex items-center justify-center rounded-full"
            >
              <Image
                // src={type === "warning" ? Warning : ShieldTick}
                src={ShieldTick}
                alt="icon"
              />
            </div>
          </div>
          <p className="text-text-primary dark:text-white text-xl font-bold capitalize">
            {type  === "warning" ? "Account Verification Unsuccessful" : "Your account verification is currently pending"}
          </p>
        </>
      )}
      {children}
    </div>
  );
};

export default CommpanyStatusPreset;
