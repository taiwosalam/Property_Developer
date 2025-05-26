import { useEffect } from "react";
import { checkPaymentStatus } from "./data";
import { toast } from "sonner";

interface PaymentIframeProps {
  paymentUrl: string;
  reference: string;
  onPaymentConfirmed: () => void;
  onClose: () => void;
}

const PaymentIframe: React.FC<PaymentIframeProps> = ({
  paymentUrl,
  reference,
  onPaymentConfirmed,
  onClose,
}) => {
  useEffect(() => {
    if (!reference) return;
    const polling = setInterval(async () => {
      try {
        const res = await checkPaymentStatus(reference);
        if (res) {
          clearInterval(polling);
          window.dispatchEvent(new Event("refetch-wallet"));
          onPaymentConfirmed(); // Notify parent that payment is confirmed
        }
      } catch (error) {
        toast.error("Failed to add");
      }
    }, 5000);
    return () => clearInterval(polling);
  }, [reference, onPaymentConfirmed]);

  return (
    <div className="relative w-full md:w-[85%] lg:w-[50%] h-full">
      <iframe src={paymentUrl} className="w-full h-full rounded-lg" />
      <button
        onClick={onClose}
        className="absolute top-13 right-10 z-10 py-2 px-3 bg-white text-gray-600 hover:text-black text-xl font-bold rounded-full shadow"
      >
        &times;
      </button>
    </div>
  );
};

export default PaymentIframe;
