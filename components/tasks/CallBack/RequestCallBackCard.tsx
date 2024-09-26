import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Button from "@/components/Form/Button/button";
import Picture from "@/components/Picture/picture";
import samplePicture from "@/public/empty/SampleLandlord.jpeg";
import { RequestCallBackCardProps, userDeailItemsProp } from "./types";
import { Modal, ModalContent } from "@/components/Modal/modal";
import { useState } from "react";
import CallRequestModal from "./CallRequestModal";

const UserDetailItems: React.FC<userDeailItemsProp> = ({ label, value }) => (
  <div className="w-[170px]">
    <p className="font-medium text-[16px] text-text-tertiary">{label}:</p>
    <p className="font-medium text-sm text-text-secondary">{value}</p>
  </div>
);

const RequestCallBackCard: React.FC<RequestCallBackCardProps> = ({
  userDetails,
  userName,
  requestDate,
  requestId,
  status,
  pictureSrc,
  phoneNumber,
  propertyName,
  propertyAddress,
  branch,
  accountOfficer,
  resolvedBy,
  resolvedDateTime,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleViewDetails = () => {
    setModalOpen(true);
    console.log("View Details button clicked");
  };

  const handleResolve = () => {
    console.log("Resolve button clicked");
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
          <div>
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
        <div
          className={`p-2 font-normal text-xs ${
            status === "completed"
              ? "bg-success-1 border border-success-1 text-success-2"
              : "bg-[#FFF8EE] border border-[#FFF8EE] text-[#FFBB53]"
          }`}
        >
          {status === "completed" ? "Completed" : "Pending"}
        </div>
      </div>
      <div className="bg-[#2563EB] text-[#EFF6FF] py-2 px-[18px] flex items-center justify-between">
        <p>Request For Call Back</p>
        <p>ID: {requestId}</p>
      </div>
      <div className="px-[18px] grid grid-cols-3 gap-x-5 gap-y-4">
        {userDetails.map((detail, index) => (
          <UserDetailItems
            key={index}
            label={detail.label}
            value={detail.value}
          />
        ))}
      </div>
      <Modal
        state={{
          isOpen: modalOpen,
          setIsOpen: setModalOpen,
        }}
      >
        <ModalContent>
          <CallRequestModal
            requesterName={userName}
            requesterPicture={pictureSrc || samplePicture}
            requestDate={requestDate}
            phoneNumber={phoneNumber}
            propertyName={propertyName}
            propertyAddress="Sample Address"
            branch={branch}
            accountOfficer={accountOfficer}
            resolvedBy={resolvedBy}
            resolvedDateTime={resolvedDateTime}
          />
        </ModalContent>
      </Modal>
      <div className="flex justify-end px-[18px]">
        <Button
          size="sm_medium"
          className="py-2 px-8"
          onClick={() => {
            if (status === "completed") {
              handleViewDetails();
            } else {
              handleResolve();
            }
          }}
        >
          {status === "completed" ? "Details" : "Resolve"}
        </Button>
      </div>
    </div>
  );
};

export default RequestCallBackCard;
