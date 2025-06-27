import { ModalTrigger } from "@/components/Modal/modal";
import Picture from "@/components/Picture/picture";
import BadgeIcon, {
  BadgeIconColors,
  tierColorMap,
} from "@/components/BadgeIcon/badge-icon";
import { VisitorRequestModalProps } from "./types";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import Button from "@/components/Form/Button/button";
import { useState } from "react";
import CheckInOutForm from "./check-in-out-form";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";
import {
  handleCheckIn,
  handleCheckOut,
  handleDecline,
  ICheckInPayload,
  IDeclinePayload,
} from "@/app/(nav)/tasks/visitors/data";
import { toast } from "sonner";

// import ModalPreset from "@/components/Modal/modal-preset";

const getCurrentDateTime = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const time = now.toTimeString().split(" ")[0]; // Format: HH:MM:SS
  return { date, time };
};

const VisitorRequestModal: React.FC<VisitorRequestModalProps> = ({
  props,
  closeModal,
}) => {
  const [activeStep, setActiveStep] = useState<
    "default" | "check-in" | "check-out" | "decline" | "success-action"
  >("default");
  const handleBack = () => {
    setActiveStep("default");
  };

  const [loading, setLoading] = useState(false);

  const handleOnSubmitCheckIn = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!props.requestId) return;

    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const { date, time } = getCurrentDateTime();
    const data: ICheckInPayload = {
      inventory: formData.get("inventory") as string,
      companion: formData.get("companion") as string,
      check_in_date: date,
      check_in_time: time,
    };
    try {
      setLoading(true);
      const res = await handleCheckIn(props.requestId, data);
      if (res) {
        toast.success("Check in successful");
        closeModal?.();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleOnSubmitCheckOut = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    if (!props?.requestId) {
      return;
    }
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { date, time } = getCurrentDateTime();

    const data: ICheckInPayload = {
      inventory: formData.get("inventory") as string,
      companion: formData.get("companion") as string,
      check_out_date: date,
      check_out_time: time,
    };
    try {
      setLoading(true);
      const res = await handleCheckOut(props?.requestId, data);
      if (res) {
        toast.success("Check out successful");
        setActiveStep("success-action");
        window.dispatchEvent(new Event("refetchVisitors"));
        closeModal?.();
      }
    } catch (error) {
      toast.error("Check out failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOnSubmitDecline = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!props?.requestId) {
      return;
    }
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { date, time } = getCurrentDateTime();

    const reason = formData.get("inventory") as string;

    if (!reason || reason.trim() === "") {
      toast.warning("Please provide a reason for declining this request.");
      return;
    }

    const data: IDeclinePayload = {
      reason: formData.get("inventory") as string,
      decline_date: date,
      decline_time: time,
    };
    try {
      setLoading(true);
      const res = await handleDecline(props?.requestId, data);
      if (res) {
        toast.success("Request declined successfully");
        setActiveStep("success-action");
        window.dispatchEvent(new Event("refetchVisitors"));
        closeModal?.();
      }
    } catch (error) {
      toast.error("Failed to decline request");
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (tier?: number): BadgeIconColors | undefined => {
    if (!tier || tier === 0) return undefined;
    return tierColorMap[tier as keyof typeof tierColorMap] || "blue";
  };

  if (activeStep === "default") {
    return (
      <ModalPreset title="Visitation Details">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 font-medium">
          <div className="flex items-center gap-2">
            <Picture size={50} src={props?.pictureSrc} rounded />
            <div className="text-base text-text-primary dark:text-white space-y-1">
              <p className="flex items-center">
                <span>{props?.userName}</span>
                {props?.tier_id && (
                  <BadgeIcon color={getBadgeColor(props?.tier_id) || "gray"} />
                )}
              </p>
              <p>
                <span className="text-text-tertiary dark:text-darkText-1">
                  ID:
                </span>{" "}
                {props?.id}
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-4">
              <p className="text-text-tertiary min-w-[120px] dark:text-darkText-1">
                Name of Visitor
              </p>
              <p className="text-text-primary dark:text-darkText-2">
                {props?.visitorName}
              </p>
            </div>
            <div className="flex items-start gap-4">
              <p className="text-text-tertiary min-w-[120px] dark:text-darkText-1">
                Request Date
              </p>
              <p className="text-text-primary dark:text-darkText-2">
                {props?.requestDate}
              </p>
            </div>
            <div className="flex items-start gap-4">
              <p className="text-text-tertiary min-w-[120px] dark:text-darkText-1">
                Visitor&apos;s Phone
              </p>
              <p className="text-text-primary dark:text-darkText-2">
                {props?.visitorPhoneNumber}
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
              {props?.secretQuestion}
            </p>
          </div>
          <div className="flex items-start justify-between gap-1.5">
            <p className="text-text-tertiary text-base dark:text-darkText-1">
              Answer
            </p>
            <p className="text-text-primary text-sm text-right dark:text-darkText-2">
              {props?.secretAnswer}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-text-tertiary text-base dark:text-white">
              Description:
            </p>
            <p className="text-text-primary dark:text-darkText-2">
              {props?.purpose}
            </p>
          </div>
        </div>
        <div className="mb-9 text-sm">
          <p
            className={`mb-2 text-text-label text-base font-bold dark:text-white ${
              props.checked_status === "cancelled" ? "text-red-500" : ""
            }`}
          >
            {props.checked_status === "cancelled" ? "Decline" : "Check In"}
          </p>
          <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-1.5">
            <div className="flex gap-4">
              <p className="text-text-label dark:text-darkText-1 font-normal min-w-[90px] md:min-w-[unset]">
                By
              </p>
              <p className="text-text-primary dark:text-darkText-2 font-medium capitalize">
                {props?.checked_in_by || "____ ____"}
              </p>
            </div>
            {props.status !== "cancelled" && (
              <div className="flex gap-4">
                <p className="text-text-label dark:text-darkText-1 font-normal min-w-[90px] md:min-w-[unset]">
                  Companion
                </p>
                <p className="text-text-primary dark:text-darkText-2 font-medium capitalize">
                  {props?.check_in_companion || "___ ___"}
                </p>
              </div>
            )}
            <div className="flex gap-4">
              <p className="text-text-label dark:text-darkText-1 font-normal min-w-[90px] md:min-w-[unset]">
                Date - Time
              </p>
              <p className="text-text-primary dark:text-darkText-2 font-medium">
                {`${props?.check_in_date || "___ ___"} - ${
                  props?.check_in_time || "___ ___"
                }`}
              </p>
            </div>
          </div>
          {props.checked_status !== "cancelled" && (
            <p className="text-text-label dark:text-white font-normal mb-1">
              Inventory
            </p>
          )}
          {props.status === "pending" ? (
            "---"
          ) : (
            <TruncatedText lines={2}>
              {props.status !== "cancelled" && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: props?.check_in_inventory,
                  }}
                />
              )}
            </TruncatedText>
          )}

          {props.checked_status === "cancelled" && (
            <div className="space-y-2 mt-2">
              <p className="text-text-label dark:text-darkText-1 font-normal min-w-[90px] md:min-w-[unset]">
                Decline Reason
              </p>
              <p className="text-text-primary dark:text-darkText-2 font-medium">
                {"Reason for declined"}
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        {/* Buttons */}
        {props.checked_status === "pending" ? (
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
        ) : props.checked_status === "checked_in" ? (
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
        ) : props.checked_status === "cancelled" ? (
          <div className="mt-8 flex items-center justify-center gap-[70px]">
            {/* <ModalTrigger asChild close>
              <Button
                variant="sky_blue"
                size="sm_bold"
                className="py-[10px] px-6 rounded-lg !border-brand-9 !border"
              >
                Back
              </Button>
            </ModalTrigger> */}
            {/* <Button
              variant="light_red"
              size="sm_bold"
              className="py-[10px] px-6 rounded-lg"
              onClick={() => setActiveStep("decline")} // Adjust the action as needed
            >
              View Cancellation Details
            </Button> */}
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
                  {props?.checked_out_by || "___ ___"}
                </p>
              </div>
              <div className="flex items-start gap-4">
                <p className="text-text-label dark:text-darkText-1 font-normal min-w-[90px] md:min-w-[unset]">
                  Companion
                </p>
                <p className="text-text-primary dark:text-darkText-2 font-medium">
                  {props?.check_out_companion || "___ ___"}
                </p>
              </div>
              <div className="flex items-start gap-4">
                <p className="text-text-label dark:text-darkText-1 font-normal min-w-[90px] md:min-w-[unset]">
                  Date - Time
                </p>
                <p className="text-text-primary dark:text-darkText-2 font-medium">
                  {`${props?.check_out_date || "___ ___"} - ${
                    props?.check_out_time || "___ ___"
                  }`}
                </p>
              </div>
            </div>
            <p className="text-text-label dark:text-white font-normal mb-1">
              Inventory
            </p>
            <TruncatedText lines={2}>
              <div
                dangerouslySetInnerHTML={{ __html: props?.check_out_inventory }}
              />
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
    const handlers = {
      "check-in": handleOnSubmitCheckIn,
      "check-out": handleOnSubmitCheckOut,
      decline: handleOnSubmitDecline,
    };
    return (
      <CheckInOutForm
        loading={loading}
        onSubmit={handlers[activeStep]}
        type={activeStep}
        useCase="visitor"
        handleBack={handleBack}
        pictureSrc={props?.pictureSrc}
        userName={props?.userName}
        id={props?.id}
        requestDate={props?.requestDate}
      />
    );
  }

  // if (activeStep === "success-action") {
  // return <ModalPreset type="success | failed" />
  // }
};

export default VisitorRequestModal;
