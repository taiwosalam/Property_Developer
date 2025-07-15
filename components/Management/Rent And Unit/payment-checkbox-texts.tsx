import React from "react";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import { useGlobalStore } from "@/store/general-store";
import dayjs, { Dayjs } from "dayjs";

type PaymentConfirmationTextProps = {
  isWebUser: boolean;
  isRental: boolean;
  nonNaira: boolean;
  selectedOptions?: Record<string, boolean>;
  currency?: string;
  startDate?: Dayjs | null;
};

const PaymentConfirmationText: React.FC<PaymentConfirmationTextProps> = ({
  isWebUser,
  isRental,
  nonNaira,
  selectedOptions,
  currency,
  startDate,
}) => {
  const canSubmitRent = useGlobalStore((state) => state.canSubmitRent);
  const setGlobalStore = useGlobalStore((state) => state.setGlobalInfoStore);

  // Always reset canSubmitRent to false on mount
  React.useEffect(() => {
    setGlobalStore("canSubmitRent", false);
  }, [setGlobalStore]);

  // If date is in the past
  if (startDate?.isBefore(dayjs(), "day")) {
    return (
      <div className="custom-flex-col gap-1">
        <div className="flex items-start gap-2">
          <Checkbox
            radio
            checked={canSubmitRent}
            onChange={() => setGlobalStore("canSubmitRent", !canSubmitRent)}
          />
          <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
            {`You have selected a past date for the ${
              isRental ? "Tenant" : "Occupant"
            }, which indicates
            that you are recording an outstanding ${
              isRental ? "rent" : "Fee"
            } balance for the client,
            not initiating a new ${isRental ? "rent" : "Fee"} payment.`}
          </p>
        </div>
        {nonNaira && (
          <div className="flex items-start gap-2">
            <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
              Your property was listed in a currency other than Naira. As a
              result, automatic payments and wallet transactions are not
              supported. You will need to handle all payments manually.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Web user
  if (isWebUser) {
    return (
      <div className="custom-flex-col gap-1">
        <div className="flex items-start gap-2">
          <Checkbox
            radio
            checked={canSubmitRent}
            onChange={() => setGlobalStore("canSubmitRent", !canSubmitRent)}
          />
          <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
            Confirms that you have received payment for the{" "}
            {isRental ? "rent" : "fee"}.
          </p>
        </div>
        {nonNaira && (
          <div className="flex items-start gap-2">
            <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
              Your property was listed in a currency other than Naira. As a
              result, automatic payments and wallet transactions are not
              supported. You will need to handle all payments manually.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Mobile or other user
  return (
    <div className="custom-flex-col gap-1">
      <div className="flex items-start gap-2">
        <Checkbox
          radio
          checked={canSubmitRent}
          onChange={() => setGlobalStore("canSubmitRent", !canSubmitRent)}
        />
        <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
          {selectedOptions?.["create_invoice"]
            ? `${isRental ? "Rent" : "Fee"} will commence upon ${
                isRental ? "tenant" : "occupant"
              } making payment for the generated invoice. If payment has already been received, you can click 'Create Invoice' to begin the ${
                isRental ? "rent" : "Fee"
              } immediately.`
            : `Confirms that you have received payment for the ${
                isRental ? "rent" : "fee"
              }.${
                currency === "naira"
                  ? ` However, if you intend to receive the payment, you can click 'create invoice' for ${
                      isRental ? "tenant" : "occupant"
                    } to make the payment.`
                  : ""
              }`}
        </p>
      </div>

      {/* NON NAIRA */}
      {nonNaira && (
        <div className="flex items-start gap-2">
          <p className="text-sm font-normal text-text-secondary dark:text-darkText-1 w-fit mr-auto">
            Your property was listed in a currency other than Naira. As a
            result, automatic payments and wallet transactions are not
            supported. You will need to handle all payments manually.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmationText;
