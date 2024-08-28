import React from "react";
import Image from "next/image";

// Images
import Avatar from "@/public/empty/avatar.png";

// Imports
import Card from "@/components/dashboard/card";

import {
  complaintsData,
  dashboardCardData,
  recentMessagesData,
  walletBalanceCardData,
} from "./data";
import WalletBalanceCard from "@/components/dashboard/wallet-balance";
import NotificationCard from "@/components/dashboard/notification-card";
import { DashboardChart } from "@/components/dashboard/chart";
import DashboarddCalendar from "@/components/dashboard/calendar";
import { SectionContainer } from "@/components/Section/section-components";

const Dashboard = () => {
  return (
    <section className="custom-flex-col gap-10">
      <div className="w-full h-full md:flex gap-x-10">
        <div className="w-full flex-2 h-full space-y-8">
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
          <div className="w-full h-fit">
            <DashboardChart />
          </div>
          <div className="w-full h-fit">
            <DashboardChart />
          </div>
        </div>
        <div className="w-full flex-1 h-full space-y-7">
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
      <SectionContainer heading="Recent invoice" href="/">
        <div className="rounded-lg overflow-hidden">
          <table className="dash-table">
            <colgroup>
              <col className="w-[72px]" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>client name</th>
                <th>invoive ID</th>
                <th>payment reason</th>
                <th>total amount</th>
                <th>date</th>
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <tr key={index}>
                    <td>
                      <Image
                        src={Avatar}
                        alt="profile picture"
                        className="min-w-10 w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td>
                      <p>Amori Ademakinwa</p>
                    </td>
                    <td>
                      <p>1234563456</p>
                    </td>
                    <td>
                      <p>Rent cost: Start date: Sept 22, 2023 - Expiry date:</p>
                    </td>
                    <td>
                      <p>₦35,000.00</p>
                    </td>
                    <td>
                      <p>02/03/2024</p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </SectionContainer>
      <div>{/* {Todo List} */}</div>
    </section>
  );
};

export default Dashboard;
