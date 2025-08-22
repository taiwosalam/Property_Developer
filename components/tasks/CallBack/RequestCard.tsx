import clsx from "clsx";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Button from "@/components/Form/Button/button";
import { ReplyIcon2 } from "@/public/icons/icons";
import Picture from "@/components/Picture/picture";
import samplePicture from "@/public/empty/SampleLandlord.jpeg";
import { RequestCardProps, UserDetailItemsProp } from "./types";
import { Modal, ModalContent } from "@/components/Modal/modal";
import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { resolveCallRequest } from "@/app/(nav)/tasks/inquires/data";
import { usePermission } from "@/hooks/getPermission";
import { useRole } from "@/hooks/roleContext";

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
    userId,
    id,
  } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const { role } = useRole();
  // PERMISSIONS
  const canApproveCautionDeposit =
    usePermission(role, "Can approve and refund caution deposit") ||
    role === "director";

  const [isResolving, setIsResolving] = useState(false);

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

  const handleViewDetails = () => {
    setModalOpen(true);
  };

  const handleResolve = async () => {
    if (!id) return;

    try {
      setIsResolving(true);
      const res = await resolveCallRequest(id);

      if (res) {
        toast.success("Resolved successfully");
      }
    } catch (error) {
    } finally {
      setIsResolving(false);
    }
    //
  };

  const handlePreview = () => {};

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
      return props.status === "completed"
        ? "Details"
        : isResolving
        ? "Please wait..."
        : "Resolve";
    } else if (cardType === "property") {
      return "More Details";
    } else if (cardType === "deposit") {
      return "More Details";
    } else if (cardType === "agent-community") {
      return "Preview";
    } else return "nothing";
  };

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
          <Picture
            size={50}
            src={pictureSrc || empty}
            rounded
            className="object-cover"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-0.5">
              <span className="text-base font-medium capitalize">
                {truncateText(userName, 30)}
              </span>

              {cardType === "visitor" && props?.tier_id && (
                <BadgeIcon color={getBadgeColor(props?.tier_id) || "gray"} />
              )}
              {cardType === "deposit" && props?.tier_id && (
                <BadgeIcon color={getBadgeColor(props?.tier_id) || "gray"} />
              )}
              {cardType === "property" && props?.tier_id && (
                <BadgeIcon color={getBadgeColor(props?.tier_id) || "gray"} />
              )}

              {cardType === "callback" && props?.tier_id && (
                <BadgeIcon color={getBadgeColor(props?.tier_id) || "gray"} />
              )}
              {cardType === "agent-community" && props?.tier === "2" && (
                <BadgeIcon color={"gray"} />
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
                  props.status === "checked_in" ||
                  props.status === "progress"
                ? "bg-[rgba(140,98,255,0.19)] border-[rgba(140,98,255,0.19)] text-[#9747FF]"
                : props.status === "decline" || props.status === "cancelled"
                ? "bg-[rgba(233,33,46,0.10)] border-[rgba(233,33,46,0.10)] text-status-error-primary"
                : props.status === "approved"
                ? "bg-blue-300/45 text-blue-600"
                : ""
            )}
          >
            {props.status === "checked_in" || props.status === "progress"
              ? "In-Progress"
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
                accessor === "secretQuestion" ||
                accessor === "purpose" ||
                accessor === "visitorName" ||
                accessor === "visitorPhoneNumber" ||
                accessor === "propertyName" ||
                accessor === "unitName" ||
                accessor === "branch"
                  ? String(props[accessor])
                  : "attached";
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
        {cardType === "deposit" ||
          cardType === "property" ||
          (cardType === "visitor" && (
            <button
              // onClick={() => router.push(`/messages/${props?.userId}`)}
              onClick={goToMessage}
              type="button"
              aria-label="Message"
              className="mr-4 border border-brand-9 text-brand-9 rounded-[4px] px-4 py-1"
            >
              Message
            </button>
          ))}

        {cardType === "property" ||
          (cardType === "deposit" && (
            <button
              // onClick={() => router.push(`/messages/${props?.userId}`)}
              onClick={goToMessage}
              type="button"
              aria-label="Message"
              className="mr-4 border border-brand-9 text-brand-9 rounded-[4px] px-4 py-1"
            >
              Message
            </button>
          ))}
        {cardType === "property" && userId && (
          <button
            // onClick={() => router.push(`/messages/${props?.userId}`)}
            onClick={goToMessage}
            type="button"
            aria-label="Message"
            className="mr-4 border border-brand-9 text-brand-9 rounded-[4px] px-4 py-1"
          >
            Message
          </button>
        )}
        {cardType === "callback" && (
          <button
            // onClick={() => router.push(`/messages/${props?.userId}`)}
            onClick={goToMessage}
            type="button"
            aria-label="Message"
            className="mr-4 border border-brand-9 text-brand-9 rounded-[4px] px-4 py-1"
          >
            Message
          </button>
        )}
        {cardType === "agent-community" ? (
          <div className="flex items-center gap-2">
            {!props.user && (
              <button
                // onClick={() => router.push(`/messages/${props?.userId}`)}
                onClick={goToMessage}
                type="button"
                aria-label="Message"
                className="mr-4 border border-brand-9 text-brand-9 rounded-[4px] px-4 py-1"
              >
                Message
              </button>
            )}

            {/* <Link
              href={`/community/agent-request//${
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
              href={`/community/agent-request/${
                props.user ? "my-properties-request/" : ""
              }${props.slug}/preview`}
              className="mr-4 border bg-brand-9 text-white rounded-[4px] px-5 py-1"
            >
              Preview
            </Link>
          </div>
        ) : (
          <>
            {/* {cardType === "deposit" ? (
              canApproveCautionDeposit && (
                <Button
                  disabled={isResolving}
                  size="sm_medium"
                  className="py-2 px-8"
                  onClick={handleButtonClick}
                >
                  {buttonText()}
                </Button>
              )
            ) : ( */}
            <Button
              disabled={isResolving}
              size="sm_medium"
              className="py-2 px-8"
              onClick={handleButtonClick}
            >
              {buttonText()}
            </Button>
            {/* )} */}
          </>
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
              tier_id={props?.tier_id}
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
              location={props.location}
              createdAt={props.createdAt}
              updatedAt={props.updatedAt}
              lga={props.lga}
              userId={props?.userId}
              pictureSrc={props?.pictureSrc}
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
              status={props?.status}
              is_examine={props?.is_examine}
              is_inventory={props?.is_inventory}
              is_maintain={props?.is_maintain}
              maintain_at={props?.maintain_at}
              examine_by={props?.examine_by}
              rejected_at={props?.rejected_at}
              created_at={props?.created_at}
              request_from={props?.request_from}
              examined_at={props?.examined_at}
              maintain_by={props?.maintain_by}
              inventory_at={props?.inventory_at}
              inventory_by={props?.inventory_by}
              refunded_amount={props?.refunded_amount}
              resolved_by={props?.resolved_by}
              resolved_date={props?.resolved_date}
              onDataUpdate={props?.onDataUpdate}
              inventory={props?.inventory_media || []}
              has_inventory={props?.has_inventory}
            />
          ) : null}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RequestCard;
