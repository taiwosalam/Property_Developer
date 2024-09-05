import React from "react";

// Imports
import Notification from "@/components/Notification/notification";
import { SectionSeparator } from "@/components/Section/section-components";

const Notifications = () => {
  return (
    <div className="custom-flex-col gap-8 py-4">
      <div className="custom-flex-col gap-3">
        <h1 className="text-black text-2xl font-medium">Notifications</h1>
        <SectionSeparator />
      </div>
      <div className="custom-flex-col gap-6">
        <Notification type="message" />
        <Notification type="payment" />
        <Notification type="profile" />
        <Notification type="service" />
        <Notification type="review" />
        <Notification type="reservation" />
        <Notification type="user" />
        <Notification type="property" />
      </div>
    </div>
  );
};

export default Notifications;
