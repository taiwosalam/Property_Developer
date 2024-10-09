import { ModalTrigger } from "@/components/Modal/modal";
import {
  XIcon,
  AttachmentIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@/public/icons/icons";
import { empty } from "@/app/config";
import Image from "next/image";

export interface EmailRecord {
  id: string;
  user_id: string;
  client_name: string;
  branch: string;
  date: string;
  time: string;
  from: string;
  to: string;
  headline: string;
  message: string;
}

const LabelValuePair: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <p className="text-text-secondary">{label}</p>
      <p className="text-text-tertiary text-right">{value}</p>
    </div>
  );
};

const EmailModal: React.FC<EmailRecord> = ({
  date,
  time,
  from,
  to,
  headline,
  message,
}) => {
  return (
    <div className="w-[600px] max-w-[80%] max-h-[85%] h-fit rounded-lg bg-white overflow-x-auto custom-round-scrollbar font-medium">
      {/* Header */}
      <div className="py-5 bg-brand-1 flex items-center justify-center sticky top-0 z-[2]">
        <span className="font-medium text-[16px] text-text-secondary">
          Email Details
        </span>
        <ModalTrigger close className="absolute top-4 right-6">
          <XIcon size="30" />
        </ModalTrigger>
      </div>

      {/* Body */}
      <div className="bg-white p-6 text-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <p>
              <span className="text-text-secondary">From:</span>{" "}
              <span className="text-text-tertiary">{from}</span>
            </p>
            <p>
              <span className="text-text-secondary">To:</span>{" "}
              <span className="text-text-tertiary">{to}</span>
            </p>
          </div>
          <p>
            <span className="text-text-secondary">Headline:</span>{" "}
            <span className="text-text-tertiary">{headline}</span>
          </p>
        </div>
        <hr className="border-t-2 my-4 -mx-6 border-[#C0C2C833]" />
        <div className="space-y-[18px]">
          <div className="space-y-1">
            <p className="text-text-secondary">Message</p>
            <p className="text-text-tertiary">{message}</p>
          </div>
          <div className="space-y-4">
            <p className="text-text-secondary flex items-center gap-1">
              <AttachmentIcon /> <span>Attachment</span>
            </p>
            <div className="flex items-center gap-3 flex-wrap [&>*]:flex-shrink-0 [&>*]:w-[100px] [&>*]:h-[100px] [&>*]:relative [&>*]:overflow-hidden [&>*]:rounded-lg">
              <div>
                <Image src={empty} alt="empty" fill className="object-cover" />
              </div>
              <div>
                <Image src={empty} alt="empty" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
        <hr className="border-t-2 my-6 border-brand-7 border-dotted" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p>Other Mail</p>
            <div className="flex items-center gap-3 text-text-tertiary">
              <button type="button" aria-label="Previous">
                <ArrowLeftIcon />
              </button>
              <button type="button" aria-label="Next">
                <ArrowRightIcon />
              </button>
            </div>
          </div>
          <div className="py-4 px-[18px] rounded-lg bg-brand-1 space-y-1    ">
            <LabelValuePair label="From" value={from} />
            <LabelValuePair label="To" value={to} />
            <LabelValuePair label="Date" value={`${date} ${time}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
