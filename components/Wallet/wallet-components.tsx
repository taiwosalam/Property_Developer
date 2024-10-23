// Types
import { WalletFundsCardsHeadingProps } from "./types";

// Images
import Bank from "@/public/icons/bank.svg";

// Imports
import Picture from "../Picture/picture";

export const WalletFundsCardsHeading: React.FC<
  WalletFundsCardsHeadingProps
> = ({ title, desc }) => (
  <>
    <div className="flex gap-2">
      <div className="flex items-start">
        <Picture src={Bank} alt="bank" size={18} />
      </div>
      <div className="custom-flex-col gap-[2px]">
        <p className="text-text-primary dark:text-white text-base font-medium capitalize">
          {title}
        </p>
        <p className="text-text-tertiary text-sm dark:text-darkText-1 font-medium">{desc}</p>
      </div>
    </div>
    <div className="h-[1px] border border-dashed border-borders-dark"></div>
  </>
);
