import { ModalTrigger } from "@/components/Modal/modal";
import { XIcon } from "@/public/icons/icons";
import type { PropertyRequestModalProps, LabelValuePairProps } from "./types";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";

const LabelValuePair: React.FC<LabelValuePairProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <p className="text-text-tertiary text-base dark:text-darkText-1">
        {label}
      </p>
      <p className="text-text-secondary text-sm text-right dark:text-darkText-2">
        {value}
      </p>
    </div>
  );
};

const PropertyRequestModal: React.FC<PropertyRequestModalProps> = ({
  state,
  lga,
  propertyType,
  category,
  minBudget,
  maxBudget,
  subType,
  requestType,
  userName,
  phoneNumber,
  description,
}) => {
  return (
    <ModalPreset title="Property Request Details">
      <div className="space-y-2 text-base">
        <LabelValuePair label="Location (State)" value={state} />
        <LabelValuePair label="LGA" value={lga} />
        <LabelValuePair label="Category" value={category} />
        <LabelValuePair label="Property Type" value={propertyType} />
        <LabelValuePair label="Sub Type" value={subType} />
        <LabelValuePair
          label="Budget Range"
          value={`${minBudget} - ${maxBudget}`}
        />
        <div className="border-t border-brand-7 !my-5 -mx-6 border-dashed" />
        <p className="text-text-tertiary dark:text-white">Other Details:</p>
        <LabelValuePair label="Request Type" value={requestType} />
        <LabelValuePair label="Name" value={userName} />
        <LabelValuePair label="Phone" value={phoneNumber} />
        <div className="space-y-1">
          <p className="text-text-tertiary dark:text-white">Description:</p>
          <p className="text-text-secondary text-sm dark:text-darkText-2">
            {description}
          </p>
        </div>
      </div>
    </ModalPreset>
  );
};

export default PropertyRequestModal;
