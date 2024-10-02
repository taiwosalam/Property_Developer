import { ModalTrigger } from "@/components/Modal/modal";
import Picture from "@/components/Picture/picture";
import { XIcon } from "@/public/icons/icons";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { VisitorRequestModalProps } from "./types";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import Button from "@/components/Form/Button/button";
import { useState } from "react";
import CheckInOutForm from "./check-in-out-form";
// import ModalPreset from "@/components/Modal/modal-preset";

const VisitorRequestModal: React.FC<VisitorRequestModalProps> = ({
  status,
  pictureSrc,
  id,
  userName,
  visitorName,
  visitorPhoneNumber,
  requestDate,
  secretQuestion,
  secretAnswer,
}) => {
  const [activeStep, setActiveStep] = useState<
    "default" | "check-in" | "check-out" | "success-action"
  >("default");
  const handleBack = () => {
    setActiveStep("default");
  };

  if (activeStep === "default") {
    return (
      <div className="w-[600px] max-w-[80%] max-h-[85%] rounded-lg overflow-x-auto custom-round-scrollbar">
        {/* Header */}
        <div className="bg-brand-1 text-base text-text-primary py-4 text-center sticky top-0 z-[2]">
          Visitation Details
          <ModalTrigger
            close
            className="absolute top-[50%] translate-y-[-50%] right-6"
          >
            <XIcon size="30" />
          </ModalTrigger>
        </div>
        {/* Body */}
        <div className="bg-white p-6">
          <div className="flex items-center justify-between font-medium">
            <div className="flex items-center gap-2">
              <Picture size={50} src={pictureSrc} rounded />
              <div className="text-base text-text-primary space-y-1">
                <p className="flex items-center">
                  <span>{userName}</span>
                  <BadgeIcon color="blue" />
                </p>
                <p>
                  <span className="text-text-tertiary">ID:</span> {id}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-4">
                <p className="text-text-tertiary min-w-[120px]">
                  Name of Visitor
                </p>
                <p className="text-text-primary">{visitorName}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-text-tertiary min-w-[120px]">Request Date</p>
                <p className="text-text-primary">{requestDate}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-text-tertiary min-w-[120px]">
                  Visitor&apos;s Phone
                </p>
                <p className="text-text-primary">{visitorPhoneNumber}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-borders-dark my-5 -mx-6 border-dashed" />
          <div className="mb-5 space-y-2 gap-5">
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary text-base">Secret Question</p>
              <p className="text-text-primary text-sm">{secretQuestion}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary text-base">Answer</p>
              <p className="text-text-primary text-sm">{secretAnswer}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-text-tertiary text-base">Description:</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent eget dictum sem, ut molestie eros. Morbi in dolor
                augue. Sed aliquet ipsum fringilla sapien facilisis consectetur.
              </p>
            </div>
          </div>
          <div className="mb-9 text-sm">
            <p className="mb-2 text-text-label text-base font-bold">Check In</p>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-text-label font-normal">By</p>
                <p className="text-text-primary font-medium">
                  {status === "pending" ? "---" : "David Aladiye"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-text-label font-normal">Companion</p>
                <p>{status === "pending" ? "---" : "5 People"}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-text-label font-normal">Date - Time</p>
                <p>{status === "pending" ? "---" : "12/12/12 - 12:00 PM"}</p>
              </div>
            </div>
            <p className="text-text-label font-normal mb-1">Inventory</p>
            {status === "pending" ? (
              "---"
            ) : (
              <TruncatedText lines={2}>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Voluptatem cum dolorum ex, dolore deleniti veniam eum quam
                cumque, fugiat asperiores temporibus neque recusandae sunt qui
                modi unde. Optio, ratione repellendus.
              </TruncatedText>
            )}
          </div>

          {/* Buttons */}
          {status === "pending" ? (
            <div className="mt-8 flex items-center justify-center gap-[70px]">
              <Button
                variant="light_red"
                size="sm_bold"
                className="py-[10px] px-6 rounded-lg"
              >
                Decline
              </Button>
              <Button
                size="sm_bold"
                className="py-[10px] px-6 rounded-lg"
                onClick={() => setActiveStep("check-in")}
              >
                Check In
              </Button>
            </div>
          ) : status === "in-progress" ? (
            <div className="mt-8 flex items-center justify-center gap-[70px]">
              <ModalTrigger asChild close>
                <Button
                  variant="sky_blue"
                  size="sm_bold"
                  className="py-[10px] px-6 rounded-lg border-brand-primary border-[1px]"
                >
                  Return
                </Button>
              </ModalTrigger>
              <Button
                size="sm_bold"
                className="py-[10px] px-6 rounded-lg"
                onClick={() => setActiveStep("check-out")}
              >
                Check Out
              </Button>
            </div>
          ) : (
            <div className="text-sm">
              <p className="mb-2 text-text-label text-base font-bold">
                Check Out
              </p>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-text-label font-normal">By</p>
                  <p className="text-text-primary font-medium">David Aladiye</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-text-label font-normal">Companion</p>
                  <p className="text-text-primary font-medium">5 People</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-text-label font-normal">Date - Time</p>
                  <p className="text-text-primary font-medium">
                    12/12/12 - 12:00 PM
                  </p>
                </div>
              </div>
              <p className="text-text-label font-normal mb-1">Inventory</p>
              <TruncatedText lines={2}>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Voluptatem cum dolorum ex, dolore deleniti veniam eum quam
                cumque, fugiat asperiores temporibus neque recusandae sunt qui
                modi unde. Optio, ratione repellendus.
              </TruncatedText>
            </div>
          )}
        </div>
      </div>
    );
  }
  if (activeStep === "check-in") {
    return (
      <CheckInOutForm
        type="check-in"
        handleBack={handleBack}
        pictureSrc={pictureSrc}
        userName={userName}
        id={id}
      />
    );
  }
  if (activeStep === "check-out") {
    return (
      <CheckInOutForm
        type="check-out"
        handleBack={handleBack}
        pictureSrc={pictureSrc}
        userName={userName}
        id={id}
      />
    );
  }

  // if (activeStep === "success-action") {
  // return <ModalPreset type="success | failed" />
  // }
};

export default VisitorRequestModal;
