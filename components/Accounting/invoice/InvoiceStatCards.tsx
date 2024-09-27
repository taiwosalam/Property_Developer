import Picture from "@/components/Picture/picture";
import { InvoiceStatCardsProps } from "../types";

const InvoiceStatCards: React.FC<InvoiceStatCardsProps> = ({
  title,
  balance,
  upvalue,
  downValue,
}) => {
  return (
    <div
      className="bg-white rounded-[14px] p-6 space-y-7"
      style={{
        boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="w-full flex justify-between">
        <div className="space-y-2">
          <p className="font-medium text-[16px] text-text-tertiary">{title}</p>
          <p className="font-bold text-[28px] text-[#202224]">₦56,689</p>
        </div>
        <div className="bg-[#8280FF] w-[60px] h-[60px] rounded-[23px] flex items-center justify-center">
          {}
          <Picture src="/icons/pdf-icon.svg" alt="invoice" size={30} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Picture src={"/icons/trending-down.svg"} size={24} />
        <p className="text-text-label font-normal text-[16px]">
          <span className="text-success-2">4.3%</span> Down from last week
        </p>
      </div>
    </div>
  );
};

export default InvoiceStatCards;
