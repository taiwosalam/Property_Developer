import { ModalTrigger } from "@/components/Modal/modal";
import { XIcon } from "@/public/icons/icons";
import type { PropertyRequestModalProps, LabelValuePairProps } from "./types";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { empty } from "@/app/config";
import { useGlobalStore } from "@/store/general-store";

const LabelValuePair: React.FC<LabelValuePairProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <p className="text-text-tertiary text-base dark:text-darkText-1">
        {label}
      </p>
      <p className="text-text-secondary capitalize text-sm text-right dark:text-darkText-2">
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
  location,
  createdAt,
  updatedAt,
  userId,
  pictureSrc
}) => {
  const router = useRouter();
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);



  const goToMessage = () => {
    if (!userId) {
      toast.warning("User ID not Found!");
      return;
    }

    // Set the user data in the global store
    const newMessageUserData = {
      branch_id: 0,
      id: userId,
      imageUrl: pictureSrc || empty,
      name: userName || "Unknown User",
      position: "agent",
    };
    setGlobalStore("messageUserData", newMessageUserData);

    // Redirect to the messaging page
    router.push(`/messages/${userId}`);
  };

  return (
    <ModalPreset title="Property Request Details">
      <div className="space-y-2 text-base">
        <LabelValuePair label="Location" value={location ?? ""} />
        <LabelValuePair label="Category" value={category} />
        <LabelValuePair label="Property Type" value={propertyType} />
        <LabelValuePair label="Sub Type" value={subType} />
        <LabelValuePair
          label="Budget Range"
          value={`${minBudget} - ${maxBudget}`}
        />
        <LabelValuePair label="Date created" value={createdAt} />
        <LabelValuePair label="Last Updated" value={updatedAt} />
        <div className="border-t border-brand-7 !my-5 -mx-6 border-dashed" />
        <p className="text-text-tertiary dark:text-white">Other Details:</p>
        {/* <LabelValuePair label="Request Type" value={requestType} /> */}
        <LabelValuePair label="Name" value={userName} />
        <LabelValuePair label="Phone" value={phoneNumber} />
        <div className="space-y-1">
          <p className="text-text-tertiary dark:text-white">Requirement:</p>
          <TruncatedText>
            <p className="text-text-secondary text-sm dark:text-darkText-2">
              {description}
            </p>
          </TruncatedText>
        </div>

        <button
          // onClick={() => router.push(`/messages/${props?.userId}`)}
          onClick={goToMessage}
          type="button"
          aria-label="Message"
          className=" flex justify-end ml-auto border border-brand-9 text-brand-9 rounded-[4px] px-4 py-1 bg-brand-9 text-white mt-4"
        >
          Message
        </button>
      </div>
    </ModalPreset>
  );
};

export default PropertyRequestModal;
