import React from "react";

// Types
import type { WalletModalPresetProps } from "./types";

// Images
import Cancel from "@/public/icons/cancel.svg";

// Imports
import Picture from "../Picture/picture";
import { ArrowLeft } from "lucide-react";
import { ModalTrigger } from "../Modal/modal";

const WalletModalPreset: React.FC<WalletModalPresetProps> = ({
  back,
  title,
  children,
}) => {
  return (
    <div
      className="w-[600px] bg-white rounded-lg overflow-hidden custom-flex-col"
      style={{
        border: "1px solid rgba(193, 194, 195, 0.40)",
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="custom-flex-col gap-[2px] py-4 px-6 bg-brand-1">
        <div className="flex items-center justify-between">
          {back ? (
            <button
              onClick={back}
              className="w-6 h-6 flex items-center justify-center"
            >
              <ArrowLeft size={18} color="#010A23" />
            </button>
          ) : (
            <div></div>
          )}
          <ModalTrigger close>
            <Picture src={Cancel} alt="close" size={24} />
          </ModalTrigger>
        </div>
        <div className="flex justify-center">
          <p className="text-text-secondary text-base font-medium">{title}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default WalletModalPreset;
