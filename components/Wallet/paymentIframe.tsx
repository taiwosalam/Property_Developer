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

// import { useEffect, useState } from "react";
// import { checkPaymentStatus } from "./data";
// import { toast } from "sonner";

// interface PaymentIframeProps {
//   paymentUrl: string;
//   reference: string;
//   onPaymentConfirmed: () => void;
//   onClose: () => void;
// }

// const PaymentIframe: React.FC<PaymentIframeProps> = ({
//   paymentUrl,
//   reference,
//   onPaymentConfirmed,
//   onClose,
// }) => {
//   const [iframeLoaded, setIframeLoaded] = useState(false);

//   useEffect(() => {
//     if (!reference) return;
//     const polling = setInterval(async () => {
//       try {
//         const res = await checkPaymentStatus(reference);
//         if (res) {
//           clearInterval(polling);
//           window.dispatchEvent(new Event("refetch-wallet"));
//           onPaymentConfirmed(); // Notify parent that payment is confirmed
//         }
//       } catch (error) {
//         toast.error("Failed to add");
//       }
//     }, 5000);
//     return () => clearInterval(polling);
//   }, [reference, onPaymentConfirmed]);

//   return (
//     // <div className="bg-transparent relative w-full md:w-[80%] lg:w-[40%] h-full">
//     <div className='bg-transparent rounded-lg shadow-lgw-full md:w-[80%] lg:w-[40%] h-full relative'>
//       <iframe
//         src={paymentUrl}
//         className={`w-full h-full rounded-lg transition-opacity duration-500 ${
//           iframeLoaded ? "opacity-100" : "opacity-0"
//         }`}
//         onLoad={() => setIframeLoaded(true)}
//         title="Payment"
//       />
//       {!iframeLoaded && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
//         </div>
//       )}
//       <button
//         onClick={onClose}
//         className="absolute top-2 right-2 z-10 p-2 bg-white text-gray-600 hover:text-black text-xl font-bold rounded-full shadow"
//       >
//         &times;
//       </button>
//     </div>
//   );
// };

// export default PaymentIframe;
