// Types
import { WalletFundsCardsHeadingProps } from "./types";
import { BankIcon } from "@/public/icons/icons";

export const WalletFundsCardsHeading: React.FC<
  WalletFundsCardsHeadingProps
> = ({ title, desc }) => (
  <>
    <div className="flex gap-2">
      <div className="flex items-start">
        <BankIcon />
      </div>
      <div className="custom-flex-col gap-[2px]">
        <p className="text-text-primary dark:text-white text-base font-medium capitalize">
          {title}
        </p>
        <p className="text-text-tertiary text-sm dark:text-darkText-1 font-medium">
          {desc}
        </p>
      </div>
    </div>
    <div className="h-[1px] border border-dashed border-borders-dark"></div>
  </>
);
