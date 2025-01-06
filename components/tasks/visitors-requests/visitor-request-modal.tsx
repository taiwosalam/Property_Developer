import { ModalTrigger } from "@/components/Modal/modal";
import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { VisitorRequestModalProps } from "./types";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import Button from "@/components/Form/Button/button";
import { useState } from "react";
import CheckInOutForm from "./check-in-out-form";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";

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
    "default" | "check-in" | "check-out" | "decline" | "success-action"
  >("default");
  const handleBack = () => {
    setActiveStep("default");
  };

  if (activeStep === "default") {
    return (
      <ModalPreset title="Visitation Details">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 font-medium">
          <div className="flex items-center gap-2">
            <Picture size={50} src={pictureSrc} rounded />
            <div className="text-base text-text-primary dark:text-white space-y-1">
              <p className="flex">
                <span>{userName}</span>
                <BadgeIcon color="blue" />
              </p>
              <p>
                <span className="text-text-tertiary dark:text-darkText-1">
                  ID:
                </span>{" "}
                {id}
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-4">
              <p className="text-text-tertiary min-w-[120px] dark:text-darkText-1">
                Name of Visitor
              </p>
              <p className="text-text-primary dark:text-darkText-2">
                {visitorName}
              </p>
            </div>
            <div className="flex items-start gap-4">
              <p className="text-text-tertiary min-w-[120px] dark:text-darkText-1">
                Request Date
              </p>
              <p className="text-text-primary dark:text-darkText-2">
                {requestDate}
              </p>
            </div>
            <div className="flex items-start gap-4">
              <p className="text-text-tertiary min-w-[120px] dark:text-darkText-1">
                Visitor&apos;s Phone
              </p>
              <p className="text-text-primary dark:text-darkText-2">
                {visitorPhoneNumber}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-borders-dark my-5 -mx-6 border-dashed" />
        <div className="mb-5 space-y-2 gap-5">
          <div className="flex items-start justify-between gap-1.5">
            <p className="text-text-tertiary text-base dark:text-darkText-1">
              Secret Question
            </p>
            <p className="text-text-primary text-sm text-right dark:text-darkText-2">
              {secretQuestion}
            </p>
          </div>
          <div className="flex items-start justify-between gap-1.5">
            <p className="text-text-tertiary text-base dark:text-darkText-1">
              Answer
            </p>
            <p className="text-text-primary text-sm text-right dark:text-darkText-2">
              {secretAnswer}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-text-tertiary text-base dark:text-white">
              Description:
            </p>
            <p className="text-text-primary dark:text-darkText-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
              eget dictum sem, ut molestie eros. Morbi in dolor augue. Sed
              aliquet ipsum fringilla sapien facilisis consectetur.
            </p>
          </div>
        </div>
        <div className="mb-9 text-sm">
          <p className="mb-2 text-text-label text-base font-bold dark:text-white">
            Check In
          </p>
          <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-1.5">
            <div className="flex gap-4">
              <p className="text-text-label dark:text-darkText-1 font-normal min-w-[90px] md:min-w-[unset]">
                By
              </p>
              <p className="text-text-primary dark:text-darkText-2 font-medium">
                {status === "pending" ? "---" : "David Aladiye"}
              </p>
            </div>
            <div className="flex gap-4">
              <p className="text-text-label dark:text-darkText-1 font-normal min-w-[90px] md:min-w-[unset]">
                Companion
              </p>
              <p className="text-text-primary dark:text-darkText-2 font-medium">
                {status === "pending" ? "---" : "5 People"}
              </p>
            </div>
            <div className="flex gap-4">
              <p className="text-text-label dark:text-darkText-1 font-normal min-w-[90px] md:min-w-[unset]">
                Date - Time
              </p>
              <p className="text-text-primary dark:text-darkText-2 font-medium">
                {status === "pending" ? "---" : "12/12/12 - 12:00 PM"}
              </p>
            </div>
          </div>
          <p className="text-text-label dark:text-white font-normal mb-1">
            Inventory
          </p>
          {status === "pending" ? (
            "---"
          ) : (
            <TruncatedText lines={2}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Voluptatem cum dolorum ex, dolore deleniti veniam eum quam cumque,
              fugiat asperiores temporibus neque recusandae sunt qui modi unde.
              Optio, ratione repellendus.
            </TruncatedText>
          )}
        </div>

        {/* Buttons */}
        {status === "pending" ? (
          <div className="mt-8 flex items-center justify-center gap-4 md:gap-[70px]">
            <Button
              variant="light_red"
              size="sm_bold"
              className="py-[10px] px-6 rounded-lg"
              onClick={() => setActiveStep("decline")}
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
                className="py-[10px] px-6 rounded-lg !border-brand-9 !border"
              >
                Back
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
            <p className="mb-2 text-text-label dark:text-white text-base font-bold">
              Check Out
            </p>
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-1.5">
              <div className="flex items-start gap-4">
                <p className="text-text-label dark:text-darkText-1 font-normal min-w-[90px] md:min-w-[unset]">
                  By
                </p>
                <p className="text-text-primary dark:text-darkText-2 font-medium">
                  David Aladiye
                </p>
              </div>
              <div className="flex items-start gap-4">
                <p className="text-text-label dark:text-darkText-1 font-normal min-w-[90px] md:min-w-[unset]">
                  Companion
                </p>
                <p className="text-text-primary dark:text-darkText-2 font-medium">
                  5 People
                </p>
              </div>
              <div className="flex items-start gap-4">
                <p className="text-text-label dark:text-darkText-1 font-normal min-w-[90px] md:min-w-[unset]">
                  Date - Time
                </p>
                <p className="text-text-primary dark:text-darkText-2 font-medium">
                  12/12/12 - 12:00 PM
                </p>
              </div>
            </div>
            <p className="text-text-label dark:text-white font-normal mb-1">
              Inventory
            </p>
            <TruncatedText lines={2}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Voluptatem cum dolorum ex, dolore deleniti veniam eum quam cumque,
              fugiat asperiores temporibus neque recusandae sunt qui modi unde.
              Optio, ratione repellendus.
            </TruncatedText>
          </div>
        )}
      </ModalPreset>
    );
  }
  if (
    activeStep === "check-in" ||
    activeStep === "check-out" ||
    activeStep === "decline"
  ) {
    return (
      <CheckInOutForm
        loading={false}
        onSubmit={() => { }}
        type={activeStep}
        useCase="visitor"
        handleBack={handleBack}
        pictureSrc={pictureSrc}
        userName={userName}
        id={id}
        requestDate={requestDate}
      />
    );
  }

  // if (activeStep === "success-action") {
  // return <ModalPreset type="success | failed" />
  // }
};

export default VisitorRequestModal;
