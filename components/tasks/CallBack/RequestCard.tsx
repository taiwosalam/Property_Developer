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
import Link from "next/link";
import { empty } from "@/app/config";
import { truncateText } from "../vehicles-record/data";
import { useRouter } from "next/navigation";
import { getBadgeColor } from "@/lib/utils";
import { useGlobalStore } from "@/store/general-store";

const UserDetailItems: React.FC<UserDetailItemsProp> = ({ label, value }) => (
  <div>
    <p className="font-medium text-[16px] text-text-tertiary dark:text-white">
      {label}:
    </p>
    <p className="font-medium text-sm text-text-secondary capitalize dark:text-darkText-1">
      {value}
    </p>
  </div>
);

const RequestCard: React.FC<RequestCardProps> = (props) => {
  const {
    cardType,
    userName,
    requestDate,
    pictureSrc,
    cardViewDetails,
    requestId,
  } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

  const handleViewDetails = () => {
    setModalOpen(true);
  };

  const handleResolve = () => {
    // console.log("Resolve button clicked");
  };

  const handlePreview = () => {
    console.log("Preview button clicked");
  };

  const handleButtonClick = () => {
    if (cardType === "callback") {
      props.status === "completed" ? handleViewDetails() : handleResolve();
    } else if (cardType === "visitor") {
      handleViewDetails();
    } else if (cardType === "property") {
      handleViewDetails();
    } else if (cardType === "agent-community") {
      handlePreview();
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
    } else if (cardType === "agent-community") {
      return "Preview";
    } else return "nothing";
  };

  //console.log(props.status);

  return (
    <div
      className="bg-white dark:bg-darkText-primary rounded-[8px] py-[18px] space-y-[21px]"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="px-[18px] flex items-center justify-between flex-wrap gap-2 capitalize">
        <div className="flex gap-2">
          <Picture size={50} src={pictureSrc || empty} rounded />
          <div className="space-y-1">
            <div className="flex items-center gap-0.5">
              <span className="text-base font-medium capitalize">
                {truncateText(userName, 30)}
              </span>
              {cardType === "visitor" && (
                <BadgeIcon color={getBadgeColor(props.tier_id) || "gray"} />
              )}
            </div>
            {cardType !== "agent-community" ? (
              <div className="flex items-center gap-1">
                <span className="text-base font-medium text-text-tertiary">
                  Date of Request:
                </span>
                <span className="text-base font-medium">{requestDate}</span>
              </div>
            ) : (
              <p className="text-base font-medium text-brand-9">
                {props.userTitle}
              </p>
            )}
          </div>
        </div>
        {/* I noticed that the property request card has no status */}
        {/* {cardType !== "property" && cardType !== "agent-community" && ( */}
        {cardType !== "property" && (
          <p
            className={clsx(
              "p-2 font-normal text-xs capitalize ml-auto w-[85px] text-center",
              props.status === "completed" || props.status === "active"
                ? "bg-status-success-1 border-status-success-1 text-status-success-2"
                : props.status === "pending" || props.status === "inactive"
                ? "bg-status-caution-1 border-status-caution-1 text-status-caution-2"
                : props.status === "in-progress" ||
                  props.status === "checked_in"
                ? "bg-[rgba(140,98,255,0.19)] border-[rgba(140,98,255,0.19)] text-[#9747FF]"
                : props.status === "decline" || props.status === "cancelled"
                ? "bg-[rgba(233,33,46,0.10)] border-[rgba(233,33,46,0.10)] text-status-error-primary"
                : ""
            )}
          >
            {props.status === "checked_in"
              ? "In Progress"
              : props.status === "cancelled"
              ? "Declined"
              : props.status}
          </p>
        )}
      </div>
      <div
        className={clsx(
          "py-2 px-[18px] flex items-center justify-between text-base font-medium custom-secondary-bg text-text-secondary dark:text-white"
        )}
      >
        <p className="capitalize">
          {cardType === "callback"
            ? "Request For Call Back"
            : cardType === "visitor"
            ? "Book For Visitors"
            : cardType === "property"
            ? "Property Request"
            : cardType === "agent-community"
            ? `${truncateText(props.propertyTitle, 30)}`
            : cardType === "deposit"
            ? "Caution Deposit Request"
            : ""}
        </p>
        {/* Property card and agent community card has no ID on display */}
        {cardType !== "property" && cardType !== "agent-community" ? (
          <p>ID: {requestId}</p>
        ) : cardType === "agent-community" ? (
          <p>{requestDate}</p>
        ) : null}
      </div>
      <div className="px-[18px] grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-4">
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
          : cardType === "agent-community"
          ? cardViewDetails.map(({ label, accessor }, index) => {
              return (
                <div
                  key={index}
                  className={clsx(
                    "col-span-1"
                    // index === 0 && "sm:col-span-2",
                    // index === 1 && "sm:col-span-1",
                    // index < 2 && "row-span-1"
                  )}
                >
                  <UserDetailItems
                    label={label}
                    value={String(props[accessor])}
                  />
                </div>
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
        {cardType === "agent-community" ? (
          <div className="flex items-center gap-2">
            {!props.user && (
              <button
                onClick={() => router.push(`/messages`)}
                type="button"
                aria-label="Message"
                className="mr-4 border border-brand-9 text-brand-9 rounded-[4px] px-4 py-1"
              >
                Messsage
              </button>
            )}

            {/* <Link
              href={`/management/agent-request/${
                props.user ? "my-properties-request/" : ""
              }${requestId}/manage`}
              className={`mr-4 border bg-brand-9 text-white rounded-[4px] px-5 py-1 ${
                props.user
                  ? "bg-transparent !text-brand-9 border border-brand-9"
                  : ""
              }`}
            >
              Manage
            </Link> */}

            <Link
              href={`/management/agent-request/${
                props.user ? "my-properties-request/" : ""
              }${requestId}/preview`}
              className="mr-4 border bg-brand-9 text-white rounded-[4px] px-5 py-1"
            >
              Preview
            </Link>
          </div>
        ) : (
          <Button
            size="sm_medium"
            className="py-2 px-8"
            onClick={handleButtonClick}
          >
            {buttonText()}
          </Button>
        )}
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
              props={props}
              closeModal={() => {
                setModalOpen(false);
              }}
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
