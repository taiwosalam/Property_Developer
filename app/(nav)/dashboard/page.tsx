"use client";

import Image from "next/image";

// Images
import Avatar from "@/public/empty/avatar.png";

// Imports
import Card from "@/components/dashboard/card";

import {
  complaintsData,
  dashboardCardData,
  dashboardListingsChartConfig,
  dashboardListingsChartData,
  dashboardPerformanceChartConfig,
  dashboardPerformanceChartData,
  recentMessagesData,
  walletBalanceCardData,
} from "./data";
import WalletBalanceCard from "@/components/dashboard/wallet-balance";
import NotificationCard from "@/components/dashboard/notification-card";
import { DashboardChart } from "@/components/dashboard/chart";
import DashboarddCalendar from "@/components/dashboard/Dashcalendar";
import { SectionContainer } from "@/components/Section/section-components";
import { TaskCard } from "@/components/dashboard/kanban/TaskCard";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Link from "next/link";

const Dashboard = () => {
  return (
    <section className="custom-flex-col gap-10">
      <div className="w-full h-full flex flex-col xl:flex-row gap-x-10 gap-y-6">
        <div className="w-full xl:flex-1 space-y-4 xl:space-y-6">
          <div className="w-full flex py-1.5 xl:py-7 overflow-x-auto md:overflow-hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar">
            {dashboardCardData.map((card, index) => (
              <Link href={card.link} key={index} prefetch={false}>
                <Card
                  title={card.title}
                  icon={<card.icon />}
                  value={card.value}
                  subvalue={card.subValue}
                  bg={card.bg}
                />
              </Link>
            ))}
          </div>

          {/* Chart */}
          <div className="hidden md:block space-y-10">
            <div className="w-full h-fit">
              <DashboardChart
                chartTitle="performance"
                visibleRange
                chartConfig={dashboardPerformanceChartConfig}
                chartData={dashboardPerformanceChartData}
              />
            </div>
            <div className="w-full h-fit">
              <DashboardChart
                chartTitle="listings"
                visibleRange
                chartConfig={dashboardListingsChartConfig}
                chartData={dashboardListingsChartData}
              />
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[30%] xl:max-w-[342px] h-full grid md:grid-cols-2 xl:grid-cols-1 gap-6">
          <WalletBalanceCard
            mainBalance={walletBalanceCardData.mainBalance}
            cautionDeposit={walletBalanceCardData.cautionDeposit}
          />
          <DashboarddCalendar />
          <NotificationCard
            className="h-[358px]"
            sectionHeader="Recent Messages"
            notifications={recentMessagesData}
          />
          <NotificationCard
            className="h-[358px]"
            sectionHeader="Complaints"
            notifications={complaintsData}
          />
        </div>
      </div>

      <SectionContainer heading="Recent invoice" href="/accounting/invoice">
        <div className="rounded-lg w-full overflow-x-scroll no-scrollbar dark:bg-[#3C3D37]">
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
                      <div className="flex items-center">
                        <p>Amori Ademakinwa</p>
                        <BadgeIcon color="blue" />
                      </div>
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
      <SectionContainer heading="Recent Complains" href="/tasks/complaints">
        <div className="bg-white dark:bg-[#3C3D37] p-6 border-2 border-dashed rounded-lg border-gray-300 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <TaskCard
                statusChanger
                noDrag
                key={index}
                task={{
                  id: "task9",
                  columnId: "approved",
                  content: {
                    messageCount: 2,
                    linkCount: 1,
                    userAvatars: [
                      "/empty/avatar.png",
                      "/empty/avatar.png",
                      "/empty/avatar.png",
                    ],
                    date: "25 Jan 2024",
                    status: "approved",
                    progress: 50,
                  },
                  name: "John Doe",
                  title: "Project Manager",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  avatarSrc: "/empty/avatar.png",
                }}
              />
            ))}
        </div>
      </SectionContainer>
    </section>
  );
};

export default Dashboard;
