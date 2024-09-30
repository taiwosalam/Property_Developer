import clsx from "clsx";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Button from "@/components/Form/Button/button";
import { ReplyIcon2 } from "@/public/icons/icons";
import Picture from "@/components/Picture/picture";
import samplePicture from "@/public/empty/SampleLandlord.jpeg";
import { RequestCardProps, UserDetailItemsProp } from "./types";
import { Modal, ModalContent } from "@/components/Modal/modal";
import { useState } from "react";
import CallRequestModal from "./CallRequestModal";
import VisitorRequestModal from "../visitors-requests/visitor-request-modal";
import PropertyRequestModal from "../property-requests/property-request-modal";
import DepositRequestModal from "../deposit-requests/deposit-request-modal";

const UserDetailItems: React.FC<UserDetailItemsProp> = ({ label, value }) => (
  <div className="w-[170px]">
    <p className="font-medium text-[16px] text-text-tertiary">{label}:</p>
    <p className="font-medium text-sm text-text-secondary capitalize">
      {value}
    </p>
  </div>
);

const RequestCard: React.FC<RequestCardProps> = (props) => {
  const {
    cardType,
    userName,
    requestDate,
    requestId,
    pictureSrc,
    cardViewDetails,
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
      props.status === "completed" ? handleViewDetails() : handleResolve();
    } else if (cardType === "visitor") {
      handleViewDetails();
    } else if (cardType === "property") {
      handleViewDetails();
    } else if (cardType === "deposit") {
      handleViewDetails();
    }
  };

  const buttonText = () => {
    if (cardType === "visitor") {
      return "Details";
    } else if (cardType === "callback") {
      return props.status === "completed" ? "Details" : "Resolve";
    } else if (cardType === "property") {
      return "More Details";
    } else if (cardType === "deposit") {
      return "More Details";
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
        {/* I noticed that the property request card has no status */}
        {cardType !== "property" && props.status && (
          <p
            className={clsx(
              "p-2 font-normal text-xs border capitalize",
              props.status === "completed"
                ? "bg-success-1 border-success-1 text-success-2"
                : "bg-status-caution-1 border-status-caution-1 text-status-caution-2"
            )}
          >
            {props.status}
          </p>
        )}
      </div>
      <div
        className={clsx(
          "py-2 px-[18px] flex items-center justify-between text-base font-medium",
          cardType === "callback"
            ? "bg-brand-7 text-brand-1"
            : cardType === "visitor"
            ? "bg-status-caution-2 text-text-secondary"
            : cardType === "property"
            ? "bg-brand-1 text-text-secondary bg-opacity-60"
            : cardType === "deposit"
            ? "bg-success-1 text-text-secondary"
            : ""
        )}
      >
        <p>
          {cardType === "callback"
            ? "Request For Call Back"
            : cardType === "visitor"
            ? "Book For Visitors"
            : cardType === "property"
            ? "Property Request"
            : cardType === "deposit"
            ? "Caution Deposit Request"
            : ""}
        </p>
        {/* Property card has no ID on display */}
        {cardType !== "property" && <p>ID: {requestId}</p>}
      </div>
      <div className="px-[18px] grid grid-cols-3 gap-x-5 gap-y-4">
        {cardType === "callback"
          ? cardViewDetails.map(({ label, accessor }, index) => {
              return (
                <UserDetailItems
                  key={index}
                  label={label}
                  value={String(props[accessor])}
                />
              );
            })
          : cardType === "visitor"
          ? cardViewDetails.map(({ label, accessor }, index) => {
              const value =
                accessor === "secretQuestion" || accessor === "purpose"
                  ? "attached"
                  : String(props[accessor]);
              return (
                <UserDetailItems key={index} label={label} value={value} />
              );
            })
          : cardType === "property"
          ? cardViewDetails.map(({ label, accessor }, index) => {
              return (
                <UserDetailItems
                  key={index}
                  label={label}
                  value={String(props[accessor])}
                />
              );
            })
          : cardType === "deposit"
          ? cardViewDetails.map(({ label, accessor }, index) => {
              return (
                <UserDetailItems
                  key={index}
                  label={label}
                  value={String(props[accessor])}
                />
              );
            })
          : null}
      </div>
      <div className="flex justify-end px-[18px]">
        {(cardType === "property" || cardType === "deposit") && (
          <button type="button" aria-label="Message" className="mr-4">
            <ReplyIcon2 />
          </button>
        )}
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
              branch={props.branch}
              requesterName={userName}
              requesterPicture={pictureSrc || samplePicture}
              requestDate={requestDate}
              phoneNumber={props.phoneNumber}
              propertyName={props.propertyName}
              propertyAddress={props.propertyAddress}
              accountOfficer={props.accountOfficer}
              resolvedBy={props.resolvedBy}
              resolvedDateTime={props.resolvedDateTime}
            />
          ) : cardType === "visitor" ? (
            <VisitorRequestModal
              status={props.status}
              pictureSrc={pictureSrc}
              id={requestId}
              userName={userName}
              visitorName={props.visitorName}
              visitorPhoneNumber={props.visitorPhoneNumber}
              secretQuestion={props.secretQuestion}
              requestDate={requestDate}
              secretAnswer={props.secretAnswer}
            />
          ) : cardType === "property" ? (
            <PropertyRequestModal
              state={props.state}
              lga={props.lga}
              propertyType={props.propertyType}
              category={props.category}
              minBudget={props.minBudget}
              maxBudget={props.maxBudget}
              subType={props.subType}
              requestType={props.requestType}
              userName={userName}
              phoneNumber={props.phoneNumber}
              description={props.description}
            />
          ) : cardType === "deposit" ? (
            <DepositRequestModal
              requestId={requestId}
              propertyName={props.propertyName}
              state={props.state}
              unitDetails={props.unitDetails}
              branch={props.branch}
              amount={props.amount}
            />
          ) : null}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RequestCard;
