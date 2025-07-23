import { useEffect } from "react";
import { checkPaymentStatus } from "./data";
import { toast } from "sonner";
import { usePersonalInfoStore } from "@/store/personal-info-store";

interface PaymentIframeProps {
  paymentUrl: string;
  reference: string;
  onPaymentConfirmed: () => void;
  onClose: () => void;
  page?: "manager" | "account";
}

const PaymentIframe: React.FC<PaymentIframeProps> = ({
  paymentUrl,
  reference,
  onPaymentConfirmed,
  onClose,
  page,
}) => {
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  useEffect(() => {
    if (!reference) return;
    const polling = setInterval(async () => {
      try {
        // if (page === "manager" && (!BRANCH_ID || BRANCH_ID === 0)) {
        //   toast.error("Cannot find a valid branch ID");
        //   return;
        // }
        // const param = page === "manager" ? `branch=${BRANCH_ID}` : "";
        const res = await checkPaymentStatus(reference);
        if (res) {
          clearInterval(polling);
          if (page === "manager") {
            window.dispatchEvent(new Event("refetch-branch-data"));
          } else {
            window.dispatchEvent(new Event("refetch-wallet"));
            window.dispatchEvent(new Event("/wallets/dashboard"));
          }
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
