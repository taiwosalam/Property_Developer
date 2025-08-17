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
import Text from "../Form/Text/text";

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
        "p-8 custom-flex-col gap-4 rounded-[40px] bg-white dark:bg-black text-center max-w-[90%] max-h-[60vh] overflow-y-auto scrollbar-hide",
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
              className="md:w-28 w-20 h-20 md:h-28 flex items-center justify-center rounded-full"
            >
              <Image
                src={type === "rejected" ? Warning : ShieldTick}
                // src={ShieldTick}
                alt="icon"
                className="w-10 md:w-20 h-10 md:h-20"
              />
            </div>
          </div>
          <Text size="sm_bold" className="capitalize">
            {type  === "rejected" ? "Account Verification Unsuccessful" : "Your account verification is currently pending"}
          </Text>
        </>
      )}
      {children}
    </div>
  );
};

export default CommpanyStatusPreset;
