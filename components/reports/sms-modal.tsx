import { ModalTrigger } from "@/components/Modal/modal";
import { XIcon } from "@/public/icons/icons";

export interface SMSRecord {
  id: string;
  user_id: string;
  client_name: string;
  phone_number: string;
  date: string;
  time: string;
  message: string;
}

const LabelValuePair: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <p className="text-text-secondary dark:text-darkText-1">{label}</p>
      <p className="text-text-tertiary dark:text-darkText-2 text-right">
        {value}
      </p>
    </div>
  );
};

const SMSModal: React.FC<SMSRecord> = ({
  user_id,
  client_name,
  phone_number,
  date,
  time,
  message,
}) => {
  return (
    <div className="w-[600px] max-w-[80%] max-h-[85%] h-fit rounded-lg bg-white dark:bg-darkText-primary overflow-x-auto custom-round-scrollbar font-medium">
      {/* Header */}
      <div className="py-5 bg-brand-1 flex items-center justify-center sticky dark:bg-darkText-primary top-0 z-[2]">
        <span className="font-medium text-[16px] text-text-secondary dark:text-white">
          SMS Details
        </span>
        <ModalTrigger close className="absolute top-4 right-6 dark:text-white">
          <XIcon size="30" />
        </ModalTrigger>
      </div>

      {/* Body */}
      <div className="bg-white dark:bg-darkText-primary  p-6 text-sm">
        <div className="space-y-2">
          <LabelValuePair label="User ID" value={user_id} />
          <LabelValuePair label="Client Name" value={client_name} />
          <LabelValuePair label="Phone Number" value={phone_number} />
          <LabelValuePair label="Date" value={date} />
          <LabelValuePair label="Time" value={time} />
        </div>
        <hr className="border-t-2 my-6 -mx-6 border-[#C0C2C833]" />
        <p className="text-text-secondary mb-1 dark:text-white">Message:</p>
        <p className="text-text-tertiary dark:text-darkText-1">{message}</p>
      </div>
    </div>
  );
};

export default SMSModal;
