import Button from "@/components/Form/Button/button";
import { XIcon } from "@/public/icons/icons";

interface InsufficientBalanceProps {
  onNext: () => void;
  onClose: () => void;
  message?: string;
}

const InsufficientBalance = ({
  onNext,
  onClose,
  message,
}: InsufficientBalanceProps) => {
  return (
    <div className="bg-white dark:bg-[#3C3D37] rounded-lg shadow-xl p-6 min-w-[400px] max-w-[500px] z-[10002] text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-start">
        <h3 className="text-lg dark:text-white font-semibold mb-2">
          Insufficient Balabce
        </h3>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 dark:text-white hover:text-blue-700 dark:hover:text-gray-300"
          aria-label="Close modal"
        >
          <XIcon size="30" />
        </button>
      </div>
      <p className="text-sm dark:text-white mb-4">
        {message || "Sorry, your current balance is not enough to subscribe."}
      </p>
      <div className="gap-2 flex w-full justify-end items-end">
        <Button
          type="button"
          size="sm_normal"
          className="px-4 py-2 text-white capitalize rounded-md text-sm"
          onClick={onNext}
          aria-label="Proceed to upgrade"
        >
          Proceed
        </Button>
        <Button
          variant="border"
          size="sm_normal"
          className="px-4 py-2 dark:text-white"
          onClick={onClose}
          aria-label="Cancel"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default InsufficientBalance;
