import { XIcon } from "@/public/icons/icons";
import { useModal } from "./modal";
import parse from "html-react-parser";

const CautionDepositModal = () => {
  const { setIsOpen } = useModal();
  return (
    <div className="absolute bg-white dark:bg-[#3C3D37] rounded-lg shadow-xl p-6 min-w-[400px] max-w-[500px] z-[10002] text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-start">
        <h3 className="text-lg dark:text-white font-semibold mb-2">
          🛡 Caution Deposit
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-sm text-gray- dark:text-white hover:text-blue-700 dark:hover:text-gray-300"
          aria-label="Close tour"
        >
          <XIcon size="30" />
        </button>
      </div>

      <p className="text-sm dark:text-white mb-4">
        A caution deposit is a refundable amount collected upfront from a tenant
        or client to serve as a financial safeguard against potential damages,
        unpaid fees, or any breach of agreement during their use of a property,
        service, or facility.
      </p>
      <p className="text-sm dark:text-white mb-4">
        Once deducted at the start of a tenancy, the deposit is securely stored
        and only returned after the tenant moves out - subject to a successful
        final inspection confirming no outstanding issues.
      </p>
      <p className="text-sm dark:text-white mb-4">
        You can specify who holds the deposit (landlord or manager) directly
        within your property settings.
      </p>
    </div>
  );
};

export default CautionDepositModal;
