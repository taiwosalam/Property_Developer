"use client";

import React, { useEffect } from "react";
import Image from "next/image";

// Images
import Avatar from "@/public/empty/avatar.png";

// Imports
import Card from "@/components/dashboard/card";

import {
  complaintsData,
  dashboardCardData,
  getDashboardData,
  recentMessagesData,
  walletBalanceCardData,
} from "./data";
import WalletBalanceCard from "@/components/dashboard/wallet-balance";
import NotificationCard from "@/components/dashboard/notification-card";
import { DashboardChart } from "@/components/dashboard/chart";
import DashboarddCalendar from "@/components/dashboard/calendar";
import { SectionContainer } from "@/components/Section/section-components";
import { KanbanBoard } from "@/components/dashboard/kanban/KanbanBoard";
import useWindowWidth from "@/hooks/useWindowWidth";

const Dashboard = () => {
  useEffect(() => {
    getDashboardData(), [];
  });
  const { isMobile } = useWindowWidth();

  return (
    <section className="custom-flex-col gap-10">
      <div className="w-full h-full xl:flex gap-x-10">
        <div className="w-full flex-1 h-full xl:w-[70%] space-y-4 xl:space-y-10">
          <div className="w-full flex flex-row overflow-x-scroll md:overflow-auto py-1.5 md:grid md:grid-cols-2 xl:py-7 lg:grid-cols-3 gap-3 no-scrollbar">
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
          {!isMobile && (
            <>
              <div className="w-full h-fit">
                <DashboardChart />
              </div>
              <div className="w-full h-fit">
                <DashboardChart />
              </div>
            </>
          )}
        </div>
        <div className="w-full xl:w-[30%] xl:max-w-[342px] h-full space-y-6 mt-6 xl:mt-0">
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
        <div className="rounded-lg w-full overflow-x-scroll no-scrollbar">
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
      {!isMobile && (
        <SectionContainer heading="To do list" href="/">
          <KanbanBoard />
        </SectionContainer>
      )}
    </section>
  );
};

export default Dashboard;
