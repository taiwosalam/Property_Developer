import Picture from "@/components/Picture/picture";
import { InvoiceStatCardsProps } from "../invoice/types";
import { CardBlueWalletIcon } from "@/public/icons/icons";
import { useThemeStore } from "@/store/themeStore";

const ExpensesStatCard: React.FC<InvoiceStatCardsProps> = ({
  title,
  balance,
  upvalue,
  downValue,
}) => {
  const primaryColor = useThemeStore((state) => state.primaryColor);
  return (
    <div
      className="bg-white dark:bg-darkText-primary rounded-[14px] p-6 space-y-7"
      style={{
        boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="w-full flex justify-between">
        <div className="space-y-2">
          <p className="font-medium text-[16px] text-text-tertiary dark:text-darkText-1">
            {title}
          </p>
          <p className="font-bold text-[28px] text-[#202224] dark:text-white">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            })
              .format(balance)
              .split(".")}
          </p>
        </div>
        <div
          className={`w-[60px] h-[60px] rounded-[23px] flex items-center justify-center ${
            title === "Total Expenses"
              ? "bg-status-error-1"
              : title === "Part Payment"
              ? "bg-status-success-1"
              : "bg-status-caution-1"
          } `}
        >
          {title === "Total Expenses" && (
            <Picture src={"/icons/send.svg"} alt="send" size={30} />
          )}
          {title === "Part Payment" && (
            <CardBlueWalletIcon width={45} height={35} fill={primaryColor} />
          )}
          {(title === "Balance" || title === "Total Pending Vat") && (
            <Picture
              src={"/icons/orange-card.svg"}
              alt="icon"
              width={35}
              height={28}
            />
          )}
        </div>
      </div>
      {upvalue && (
        <div className="flex items-center gap-2">
          <Picture src={"/icons/trending-up-red.svg"} size={24} />
          <p className="text-text-label font-normal text-[16px]">
            <span className="text-status-error-2">4.3%</span> Up from last week
          </p>
        </div>
      )}
      {downValue && (
        <div className="flex items-center gap-2">
          <Picture
            src={
              title === "Part Payment" || title === "Balance"
                ? "/icons/trending-down-green.svg"
                : "/icons/trending-down.svg"
            }
            size={24}
          />
          <p className="text-text-label font-normal text-[16px]">
            <span
              className={`${
                title === "Part Payment" || title === "Balance"
                  ? "text-status-success-3"
                  : "text-status-error-2"
              }`}
            >
              4.3%
            </span>{" "}
            Down from last week
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpensesStatCard;
