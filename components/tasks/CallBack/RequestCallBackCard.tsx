import clsx from "clsx";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Button from "@/components/Form/Button/button";
import Picture from "@/components/Picture/picture";
import samplePicture from "@/public/empty/SampleLandlord.jpeg";
import {
  CardProps,
  UserDetailItemsProp,
  // CallRequestCardProps,
  // VisitorRequestCardProps,
} from "./types";
import { Modal, ModalContent } from "@/components/Modal/modal";
import { useState } from "react";
import CallRequestModal from "./CallRequestModal";
import VisitorRequestModal from "../visitors-requests/visitor-request-modal";

const UserDetailItems: React.FC<UserDetailItemsProp> = ({ label, value }) => (
  <div className="w-[170px]">
    <p className="font-medium text-[16px] text-text-tertiary">{label}:</p>
    <p className="font-medium text-sm text-text-secondary capitalize">
      {value}
    </p>
  </div>
);

// const isCallBackRequestProps = (
//   props: CardProps
// ): props is CallRequestCardProps => {
//   return props.cardType === "callback";
// };

// const isVisitorRequestProps = (
//   props: CardProps
// ): props is VisitorRequestCardProps => {
//   return props.cardType === "visitor";
// };

const RequestCallBackCard: React.FC<CardProps> = (props) => {
  const {
    cardType,
    userName,
    requestDate,
    requestId,
    status,
    pictureSrc,
    cardViewDetails,
    branch,
    propertyName,
  } = props;

  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetails = () => {
    setModalOpen(true);
  };

  const handleResolve = () => {
    // console.log("Resolve button clicked");
  };

  const handleButtonClick = () => {
    if (cardType === "callback") {
      status === "completed" ? handleViewDetails() : handleResolve();
    } else if (cardType === "visitor") {
      handleViewDetails();
    }
  };

  const buttonText = () => {
    if (cardType === "visitor") {
      return "Details";
    } else if (cardType === "callback") {
      return status === "completed" ? "Details" : "Resolve";
    } else return "nothing";
  };

  return (
    <div
      className="bg-white rounded-[8px] py-[18px] space-y-[21px]"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="px-[18px] flex items-center justify-between">
        <div className="flex gap-2">
          <Picture size={50} src={pictureSrc || samplePicture} rounded />
          <div className="space-y-1">
            <div className="flex items-center gap-0.5">
              <span className="text-[16px] font-medium">{userName}</span>
              <BadgeIcon color="blue" />
            </div>
            <div className="flelx items-center space-x-1">
              <span className="text-[16px] font-medium text-text-tertiary">
                Date of Request:
              </span>
              <span className="text-[16px] font-medium">{requestDate}</span>
            </div>
          </div>
        </div>
        <p
          className={clsx(
            "p-2 font-normal text-xs border capitalize",
            status === "completed"
              ? "bg-success-1 border-success-1 text-success-2"
              : "bg-status-caution-1 border-status-caution-1 text-status-caution-2"
          )}
        >
          {status}
        </p>
      </div>
      <div
        className={clsx(
          "py-2 px-[18px] flex items-center justify-between",
          cardType === "callback"
            ? "bg-brand-7 text-brand-1"
            : "bg-status-caution-2 text-text-secondary"
        )}
      >
        <p>
          {cardType === "callback"
            ? "Request For Call Back"
            : "Book For Visitors"}
        </p>
        <p>ID: {requestId}</p>
      </div>
      <div className="px-[18px] grid grid-cols-3 gap-x-5 gap-y-4">
        {cardViewDetails.map(({ label, accessor }, index) => {
          const value =
            cardType === "visitor" &&
            (accessor === "secretQuestion" || accessor === "purpose")
              ? "attached"
              : String(props[accessor as keyof CardProps]);
          return <UserDetailItems key={index} label={label} value={value} />;
        })}
      </div>
      <div className="flex justify-end px-[18px]">
        <Button
          size="sm_medium"
          className="py-2 px-8"
          onClick={handleButtonClick}
        >
          {buttonText()}
        </Button>
      </div>
      <Modal
        state={{
          isOpen: modalOpen,
          setIsOpen: setModalOpen,
        }}
      >
        <ModalContent>
          {cardType === "callback" ? (
            <CallRequestModal
              branch={branch}
              requesterName={userName}
              requesterPicture={pictureSrc || samplePicture}
              requestDate={requestDate}
              phoneNumber={props.phoneNumber}
              propertyName={propertyName}
              propertyAddress={props.propertyAddress}
              accountOfficer={props.accountOfficer}
              resolvedBy={props.resolvedBy}
              resolvedDateTime={props.resolvedDateTime}
            />
          ) : cardType === "visitor" ? (
            <VisitorRequestModal
              status={status}
              pictureSrc={pictureSrc}
              id={requestId}
              userName={userName}
              visitorName={props.visitorName}
              visitorPhoneNumber={props.visitorPhoneNumber}
              secretQuestion={props.secretQuestion}
              requestDate={requestDate}
              secretAnswer={props.secretAnswer}
            />
          ) : null}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RequestCallBackCard;
