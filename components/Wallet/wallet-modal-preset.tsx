// Types
import type { WalletModalPresetProps } from "./types";
import { cn } from "@/lib/utils";

// Imports
import { XIcon } from "@/public/icons/icons";
import { ArrowLeft } from "lucide-react";
import { ModalTrigger } from "../Modal/modal";

const WalletModalPreset: React.FC<WalletModalPresetProps> = ({
  back,
  title,
  style,
  children,
  headerClassName,
}) => {
  return (
    <div
      // Please dont change the styles
      className="w-[600px] max-w-[80%] max-h-[85%] bg-white dark:bg-darkText-primary rounded-lg overflow-auto custom-round-scrollbar"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
        ...style,
      }}
    >
      <div
        className={cn(
          "custom-flex-col py-4 px-6 bg-brand-1 dark:bg-[#3C3D37] sticky top-0 z-[2]",
          headerClassName
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
          <ModalTrigger close>
            <XIcon size="30" />
          </ModalTrigger>
        </div>
        <p className="text-text-secondary dark:text-white text-base font-medium text-center capitalize">
          {title}
        </p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default WalletModalPreset;
