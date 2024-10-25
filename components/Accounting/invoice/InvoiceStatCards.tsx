import Picture from "@/components/Picture/picture";
import { InvoiceStatCardsProps } from "./types";

const InvoiceStatCards: React.FC<InvoiceStatCardsProps> = ({
  title,
  balance,
  upvalue,
  downValue,
}) => {
  return (
    <div
      className="bg-white dark:bg-darkText-primary rounded-[14px] p-6 space-y-7"
      style={{
        boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="w-full flex justify-between">
        <div className="space-y-2">
          <p className="font-medium text-[16px] text-text-tertiary">{title}</p>
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
            title === "Total Paid Receipts" ||
            title === "Total Credit" ||
            title === "Total Paid Vat"
              ? "bg-[#E6FAEE]"
              : title === "Total Paid Receipts" ||
                title === "Total Receipts Created" ||
                title === "Total Vat Created" ||
                title === "Total Amount"
              ? "bg-[#93C5FD]"
              : "bg-status-error-1"
          } `}
        >
          {(title === "Total Paid Receipts" ||
            title === "Total Credit" ||
            title === "Total Paid Vat") && (
            <Picture src={"/icons/receive.svg"} alt="invoice" size={30} />
          )}
          {(title === "Total Receipts Created" ||
            title === "Total Vat Created" ||
            title === "Total Amount") && (
            <Picture src={"/icons/blue-wallet.svg"} alt="invoice" size={30} />
          )}
          {title === "Total Pending Receipts" ? (
            <Picture src={"/icons/orange-card.svg"} alt="invoice" size={30} />
          ) : title === "Total Debit" ||
            title === "Total Outstanding Receipts" ? (
            <Picture src={"/icons/send.svg"} alt="invoice" size={30} />
          ) : null}
        </div>
      </div>
      {upvalue && (
        <div className="flex items-center gap-2">
          <Picture src={"/icons/trending-up.svg"} size={24} />
          <p className="text-text-label font-normal text-[16px]">
            <span className="text-status-success-2">{upvalue}%</span> Up from
            last week
          </p>
        </div>
      )}
      {downValue && (
        <div className="flex items-center gap-2">
          <Picture src={"/icons/trending-down.svg"} size={24} />
          <p className="text-text-label font-normal text-[16px]">
            <span className="text-status-error-2">{downValue}%</span> Down from
            last week
          </p>
        </div>
      )}
    </div>
  );
};

export default InvoiceStatCards;
