"use client";
import {
  CardHeader,
  LeaveRequestCard,
  LeaveRequestCardDecided,
} from "@/components/HRM/LogCard";
import { useState } from "react";
import { leaveRequestsData } from "@/components/HRM/LogCard";

const LogbookUser = () => {
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

  return (
    <section>
      <CardHeader isNew={true} employeeName="Bamimore Sogo" />
      <LeaveRequestCard
        employeeName={currentRequest.employeeName}
        requestType={currentRequest.requestType}
        content={currentRequest.content}
        dateTime={currentRequest.dateTime}
        status={currentRequest.status}
        isNew={currentRequest.isNew}
        onAccept={() => console.log("hello")}
        onReject={() => console.log("rekected")}
        onBack={() => console.log("hello")}
      />

      <div className="pt-6">
        <h2 className="text-2xl mb-4 font-bold text-gray-900">History</h2>
        <div className="py-4 flex flex-col gap-6">
          {leaveRequestsData.map((item, index) => {
            return <LeaveRequestCardDecided key={index} {...item} />;
          })}
        </div>
      </div>
    </section>
  );
};
export default LogbookUser;
