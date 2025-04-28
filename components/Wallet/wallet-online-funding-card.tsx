import { useState } from "react";
import Input from "../Form/Input/input";
import Button from "../Form/Button/button";
import { currencySymbols } from "@/utils/number-formatter";
import { WalletFundsCardsHeading } from "./wallet-components";
import { fundWallet } from "./data";
import { toast } from "sonner";

interface WalletOnlineFundingCardProps {
  onPaymentInitiated?: (url: string, reference: string) => void;
}

const WalletOnlineFundingCard = ({
  onPaymentInitiated,
}: WalletOnlineFundingCardProps) => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    if (amount > 0) {
      setLoading(true);
      const data = await fundWallet(amount);
      const newPaymentUrl = data?.payment_url?.url;
      const newReference = data?.reference;

      if (newPaymentUrl && newReference) {
        onPaymentInitiated?.(newPaymentUrl, newReference); // ✅ Safe function call
      }

      setLoading(false);
    }
  };

  return (
    <div className="p-[18px] rounded-2xl overflow-hidden bg-neutral-2 dark:bg-darkText-primary dark:border dark:border-[#3C3D37] custom-flex-col gap-2">
      <WalletFundsCardsHeading
        title="online funding"
        desc="We partner with a third party for wallet funding through any local ATM card. They apply a 1.5% VAT rate and ₦100 fee for each debit transaction. The fee is waived for transactions under ₦2500."
      />
      <div className="custom-flex-col gap-6">
        <Input
          id="amount"
          CURRENCY_SYMBOL={currencySymbols.naira}
          label="Input the amount you wish to deposit"
          inputClassName="bg-white"
          labelclassName="normal-case"
          formatNumber
          onChange={(value) => setAmount(parseFloat(value.replace(/,/g, "")))}
        />
        <div className="flex justify-end">
          <Button
            size="xs_medium"
            className="py-1 px-2"
            onClick={handleProceed}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Proceed"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletOnlineFundingCard;
