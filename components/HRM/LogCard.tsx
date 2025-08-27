"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronUp, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "../Form/Button/button";
import { AnimatePresence, m } from "framer-motion";

// Types
interface LeaveRequestCardProps {
  employeeName: string;
  requestType: string;
  content: string;
  dateTime: string;
  status: "pending" | "approved" | "rejected";
  isNew?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onBack?: () => void;
}

interface LeaveRequestCardProps {
  employeeName: string;
  requestType: string;
  content: string;
  dateTime: string;
  status: "pending" | "approved" | "rejected";
  isNew?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onBack?: () => void;
}

// Remove action props
type BaseWithoutActions = Omit<
  LeaveRequestCardProps,
  "onAccept" | "onReject" | "onBack"
>;

interface LeaveRequestCardLiteProps {
  requestType: string;
  content: string;
  dateTime: string;
  status: "pending" | "approved" | "rejected";
  isNew?: boolean;
  handlerName?: string;
  extraNote?: string;
}

interface CardHeaderProps {
  employeeName: string;
  isNew?: boolean;
  onBack?: () => void;
}

interface CardContentProps {
  requestType: string;
  content: string;
  dateTime: string;
  isExpanded: boolean;
  expandable?: boolean;
  onToggleExpand?: () => void;
}

interface CardFooterProps {
  onAccept?: () => void;
  onReject?: () => void;
}

interface ExpandToggleProps {
  isExpanded: boolean;
  onClick: () => void;
}

// Card Header Component
export const CardHeader: React.FC<CardHeaderProps> = ({
  employeeName,
  isNew,
}) => {
  const router = useRouter();
  return (
    <div className="flex mt-3 items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => {
            router.back();
          }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="size-7 text-gray-600" />
        </button>
        <h1 className="sm:text-2xl text-xl font-semibold text-gray-900">
          {employeeName}
        </h1>
        {isNew && (
          <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-xl">
            New
          </span>
        )}
      </div>
    </div>
  );
};

// Expand Toggle Component
const ExpandToggle: React.FC<ExpandToggleProps> = ({ isExpanded, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full transition-colors"
    >
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </button>
  );
};

// Card Content Component
const CardContent: React.FC<CardContentProps> = ({
  requestType,
  content,
  dateTime,
  isExpanded,
  expandable,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl pb-5 border-b font-bold text-gray-900">
        {requestType}
      </h2>

      {expandable && (
        <span>
          <ArrowDown />
        </span>
      )}

      <div
        className={`text-gray-700 leading-relaxed transition-all duration-300`}
      >
        <p className="text-xl">{content}</p>
      </div>

      <div className="pt-4 text-lg border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className=" font-medium text-gray-900">Date/Time:</span>
          <span className=" font-semibold text-gray-600">{dateTime}</span>
        </div>
      </div>
    </div>
  );
};

interface CardContentProps {
  requestType: string;
  content: string;
  dateTime: string;
  expandable?: boolean;
  extraNote?: string;
  handler?: string;
  status?: "pending" | "approved" | "rejected";
}

export const CardContentVariant: React.FC<CardContentProps> = ({
  requestType,
  content,
  dateTime,
  expandable,
  handler,
  extraNote,
  status,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex pb-5 border-b items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{requestType}</h2>

        <m.button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="p-2 rounded-full text-brand-9 hover:bg-gray-100"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-brand-9" />
        </m.button>
      </div>

      {/* Expandable Section */}
      <AnimatePresence initial={false}>
        <m.div
          key="content"
          initial={{ height: "auto", opacity: 1 }}
          animate={{
            height: isExpanded ? "auto" : 40, // never fully collapse
            opacity: 1,
          }}
          exit={{ height: 80, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="flex gap-6">
            {/* Left Content */}
            <div className="text-gray-700 w-3/5 leading-relaxed">
              <p className="text-xl">{content}</p>
            </div>

            {/* Right Info */}
            <div className="pt-4 w-2/5 text-lg">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">Date/Time:</span>
                <span className="font-semibold text-gray-600">{dateTime}</span>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <span className="font-medium text-gray-900">
                  {status === "approved" ? "Accepted By:" : "Rejected By:"}
                </span>
                <span className="font-semibold text-gray-600">{handler}</span>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <span className="font-medium text-gray-900">Extra Note:</span>
                <span className="font-semibold text-gray-600">{extraNote}</span>
              </div>
            </div>
          </div>
        </m.div>
      </AnimatePresence>
    </div>
  );
};

// Card Footer Component
const CardFooter: React.FC<CardFooterProps> = ({ onAccept, onReject }) => {
  return (
    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
      <Button
        onClick={onAccept}
        className=" text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors font-medium"
      >
        Accept
      </Button>
      <Button
        onClick={onReject}
        className=" text-red-600  border border-red-200 rounded-md !bg-red-100 hover:border-red-300 transition-colors font-medium"
      >
        Reject
      </Button>
    </div>
  );
};

// History Section Component
const HistorySection: React.FC<{ requestType: string }> = ({ requestType }) => {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">History</h3>
        <ExpandToggle
          isExpanded={isHistoryExpanded}
          onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
        />
      </div>

      {isHistoryExpanded && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-900 mb-2">
            {requestType}
          </div>
          <div className="text-sm text-gray-600">
            Previous request details would appear here...
          </div>
        </div>
      )}
    </div>
  );
};

// Main Leave Request Card Component
export const LeaveRequestCard: React.FC<LeaveRequestCardProps> = ({
  employeeName,
  requestType,
  content,
  dateTime,
  status,
  isNew = false,
  onAccept,
  onReject,
  onBack,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAccept = () => {
    console.log(`Accepting ${requestType} for ${employeeName}`);
    onAccept?.();
  };

  const handleReject = () => {
    console.log(`Rejecting ${requestType} for ${employeeName}`);
    onReject?.();
  };

  const handleBack = () => {
    console.log("Going back");
    onBack?.();
  };

  const showExpandToggle = status !== "pending";
  const showFooter = status === "pending";

  return (
    <div className=" mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="relative">
        <CardContent
          requestType={requestType}
          content={content}
          dateTime={dateTime}
          isExpanded={isExpanded}
        />

        {showExpandToggle && (
          <div className="flex justify-end mt-4">
            <ExpandToggle
              isExpanded={isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>
        )}

        {showFooter && (
          <CardFooter onAccept={handleAccept} onReject={handleReject} />
        )}
      </div>

      {status !== "pending" && <HistorySection requestType={requestType} />}
    </div>
  );
};

// Main Leave Request Card Component
export const LeaveRequestCardDecided: React.FC<LeaveRequestCardLiteProps> = ({
  requestType,
  content,
  dateTime,
  status,
  handlerName,
  extraNote,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="relative">
        <CardContentVariant
          status={status}
          extraNote={extraNote}
          handler={handlerName}
          requestType={requestType}
          content={content}
          dateTime={dateTime}
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
};

// Demo Component
const LeaveRequestDemo: React.FC = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      employeeName: "David Adekunle",
      requestType: "Letter of Leave",
      content:
        "I am writing to request a [number of days] leave of absence from [start date] to [end date] due to [reason for leave, e.g., personal reasons, medical appointment, family emergency, etc.]. During my absence, I will ensure that my current projects are up to date and provide any necessary information or assistance to my colleagues to minimize disruption to our team's workflow. I understand the importance of maintaining productivity and will do my best to handle any urgent matters before my departure. I will also be available via email or phone should any critical issues arise during my absence. Thank you for considering my request. I appreciate your understanding and support.",
      dateTime: "12/12/12 - 12:00PM",
      status: "pending" as const,
      isNew: true,
    },
    {
      id: 2,
      employeeName: "David Adekunle",
      requestType: "Letter of Leave",
      content:
        "I am writing to request a [number of days] leave of absence from [start date] to [end date] due to [reason for leave, e.g., personal reasons, medical appointment, family emergency, etc.]. During my absence, I will ensure that my current projects are up to date and provide any necessary information or assistance to my colleagues to minimize disruption to our team's workflow.",
      dateTime: "10/10/12 - 10:00PM",
      status: "approved" as const,
      isNew: false,
    },
  ]);

  const [currentRequest, setCurrentRequest] = useState(requests[0]);

  const handleAccept = () => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === currentRequest.id
          ? { ...req, status: "approved" as const }
          : req
      )
    );
    setCurrentRequest((prev) => ({ ...prev, status: "approved" }));
  };

  //   const handleReject = () => {
  //     setRequests((prev) =>
  //       prev.map((req) =>
  //         req.id === currentRequest.id
  //           ? { ...req, status: "rejected" as const }
  //           : req
  //       )
  //     );
  //     setCurrentRequest((prev) => ({ ...prev, status: "rejected" }));
  //   };

  const handleBack = () => {
    console.log("Navigate back to list");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          {requests.map((request) => (
            <button
              key={request.id}
              onClick={() => setCurrentRequest(request)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentRequest.id === request.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {request.status === "pending"
                ? "Pending Request"
                : "Approved Request"}
            </button>
          ))}
        </div>
      </div>

      <LeaveRequestCard
        employeeName={currentRequest.employeeName}
        requestType={currentRequest.requestType}
        content={currentRequest.content}
        dateTime={currentRequest.dateTime}
        status={currentRequest.status}
        isNew={currentRequest.isNew}
        onAccept={handleAccept}
        onReject={() => console.log("rekected")}
        onBack={handleBack}
      />
    </div>
  );
};

export default LeaveRequestDemo;

// leaveRequestsData.ts
export const leaveRequestsData = [
  {
    requestType: "Annual Leave",
    content: "Requesting 5 days leave for family vacation.",
    dateTime: "2025-08-25 09:30 AM",
    status: "approved" as const,
    handlerName: "John Doe (HR Manager)",
    extraNote: "Approved with condition: ensure project handover.",
  },
  {
    requestType: "Sick Leave",
    content: "Flu symptoms, requesting 2 days sick leave.",
    dateTime: "2025-08-20 08:00 AM",
    status: "pending" as const,
    handlerName: "Jane Smith (Supervisor)",
    extraNote: "Doctor's note required upon return.",
  },
  {
    requestType: "Work From Home",
    content: "Request to work remotely for 3 days due to personal reasons.",
    dateTime: "2025-08-18 10:15 AM",
    status: "approved" as const,
    handlerName: "Michael Lee (Team Lead)",
    extraNote: "Ensure online availability during working hours.",
  },
  {
    requestType: "Emergency Leave",
    content: "Urgent personal matter, need leave immediately.",
    dateTime: "2025-08-15 07:45 AM",
    status: "rejected" as const,
    handlerName: "Emily Brown (HR Coordinator)",
    extraNote: "Leave denied due to project deadlines.",
  },
];
