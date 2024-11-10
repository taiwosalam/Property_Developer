import React from "react";

// Imports
import Notification from "@/components/Notification/notification";
import { SectionSeparator } from "@/components/Section/section-components";

const Notifications = () => {
  return (
    <div
      className="space-y-8 overflow-auto custom-round-scrollbar pr-2"
      style={{ height: "calc(100vh - 200px)" }}
    >
      <div className="space-y-3 sticky top-0 bg-neutral-2 dark:bg-[#000000] z-[1]">
        <div className="flex items-center justify-between gap-4 text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium">
          <h1>Notifications</h1>
          <button type="button">Clear All</button>
        </div>
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
