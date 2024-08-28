import Card from "@/components/dashboard/card";
import React from "react";

import {
  complaintsData,
  dashboardCardData,
  recentMessagesData,
  walletBalanceCardData,
} from "./data";
import WalletBalanceCard from "@/components/dashboard/wallet-balance";
import DashboarddCalendar from "@/components/dashboard/calendar";
import NotificationCard from "@/components/dashboard/notification-card";

const Dashboard = () => {
  return (
    <section>
      <div className="w-full h-full md:flex gap-x-10">
        <div className="w-full md:w-[70%] h-full space-y-10">
          <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dashboardCardData.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                icon={card.icon}
                value={card.value}
                subvalue={card.subValue}
                bg={card.bg}
              />
            ))}
          </div>
          <div className="h-[300px]">{/* performance graph */}</div>
          <div className="h-[300px]">{/* listing grap */}</div>
        </div>
        <div className="w-full md:w-[30%] h-full space-y-4">
          <WalletBalanceCard
            mainBalance={walletBalanceCardData.mainBalance}
            cautionDeposit={walletBalanceCardData.cautionDeposit}
          />
          <DashboarddCalendar />
          <div>
            <NotificationCard
              sectionHeader="Recent Messages"
              notifications={recentMessagesData}
            />
          </div>
          <div>
            <NotificationCard
              sectionHeader="Complaints"
              notifications={complaintsData}
            />
          </div>
        </div>
      </div>
      <div>{/* Recent Invoice */}</div>
      <div>{/* {Todo List} */}</div>
    </section>
  );
};

export default Dashboard;
