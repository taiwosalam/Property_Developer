import { ModalTrigger } from "@/components/Modal/modal";
import { XIcon } from "@/public/icons/icons";
import type { PropertyRequestModalProps, LabelValuePairProps } from "./types";

const LabelValuePair: React.FC<LabelValuePairProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <p className="text-text-tertiary text-base">{label}</p>
      <p className="text-text-secondary text-sm text-right">{value}</p>
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
    <div className="w-[600px] max-w-[80%] max-h-[85%] rounded-lg overflow-x-auto custom-round-scrollbar font-medium">
      {/* Header */}
      <div className="bg-brand-1 text-base text-text-primary py-4 text-center sticky top-0 z-[2]">
        Property Request Details
        <ModalTrigger
          close
          className="absolute top-[50%] translate-y-[-50%] right-6"
        >
          <XIcon size="30" />
        </ModalTrigger>
      </div>
      {/* Body */}
      <div className="bg-white p-6 space-y-2 text-base">
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
        <p className="text-text-tertiary">Other Details:</p>
        <LabelValuePair label="Request Type" value={requestType} />
        <LabelValuePair label="Name" value={userName} />
        <LabelValuePair label="Phone" value={phoneNumber} />
        <div className="space-y-1">
          <p className="text-text-tertiary">Description:</p>
          <p className="text-text-secondary text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyRequestModal;
