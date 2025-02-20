// Imports
import { useEffect, useState } from "react";
import Input from "../Form/Input/input";
import Button from "../Form/Button/button";
import { currencySymbols } from "@/utils/number-formatter";
import { WalletFundsCardsHeading } from "./wallet-components";
import { checkPaymentStatus, fundWallet } from "./data";
import ReactDOM from "react-dom";
import { toast } from "sonner";
import { useModal } from "../Modal/modal";
import { CancelIcon } from "@/public/icons/icons";

const WalletOnlineFundingCard = () => {
  const [amount, setAmount] = useState(0);
  const {isOpen, setIsOpen} = useModal()
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!reference) return;
    const checkPayment = async () => {
      try {
        const res = await checkPaymentStatus(reference);
        if (res){
          console.log("res here", res)
          clearInterval(polling);
          setIsModalOpen(false); // Close modal
          window.dispatchEvent(new Event("refetch-wallet"));
          setIsOpen(false)
          setReference(null); // 
        }
      } catch (error) {
        toast.error("Failed to add")
      }
    };
    const polling = setInterval(checkPayment, 5000);
    return () => clearInterval(polling); 
  }, [reference]);

  const handleProceed = async () => {
    if (amount > 0) {
      setLoading(true);
      const data = await fundWallet(amount);
      const paymentUrl = data?.payment_url?.url;
      const reference = data?.reference;

      if (paymentUrl && reference) {
        setIsModalOpen(true);
        setPaymentUrl(paymentUrl);
        setReference(reference);
      }
      setLoading(false);
    }
  };

  // const handleProceed = async () => {
  //   if (amount > 0) {
  //     setLoading(true);
  //     // const paymentUrl = await fundWallet(amount);
  //     const data = await fundWallet(amount);
  //     const paymentUrl = data?.payment_url.url;
  //     const reference = data?.reference;
  //     console.log("data", data);
  //     if (paymentUrl) {
  //       // window.open(paymentUrl, "_blank");
  //       setIsModalOpen(true);
  //       setPaymentUrl(paymentUrl);
  //       // window.location.href = paymentUrl;
  //     }
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <div className="p-[18px] rounded-2xl overflow-hidden bg-neutral-2 dark:bg-darkText-primary dark:border dark:border-[#3C3D37] custom-flex-col gap-2">
        <WalletFundsCardsHeading
          title="online funding"
          desc="We partner with a third party for wallet funding through any local ATM card. They apply a 1.5% VAT rate and ₦100 fee for each debit transaction. The fee is waived for transactions under ₦2500."
        />
        <div></div>
        <div className="custom-flex-col gap-6">
          <Input
            id="amount"
            CURRENCY_SYMBOL={currencySymbols.naira}
            label="Input the amount you wish to deposit"
            inputClassName="bg-white"
            labelclassName="normal-case"
            formatNumber
            onChange={(value) => {
              setAmount(parseFloat(value.replace(/,/g, "")));
            }}
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
      {/* Modal using React Portal */}
      {isModalOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[650px] h-[80%] relative">
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold bg-brand-9 rounded-full"
              >
                <CancelIcon size={36} />
              </button>

              {/* iFrame to load the payment URL */}
              <iframe src={paymentUrl} className="w-full h-full rounded-lg" />
            </div>
          </div>,
          document.body // Render modal outside the page container
        )}
    </>
  );
};

export default WalletOnlineFundingCard;
