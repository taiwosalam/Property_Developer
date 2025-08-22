"use client";
import React, { useEffect, useState } from "react";
import { initialPropertyDevDashboardStats } from "./data";
import Link from "next/link";
import Card from "@/components/dashboard/card";
import {
  dashboardListingsChartConfig,
  dashboardPerformanceChartConfig,
  getRecentMessages,
  invoiceTableFields,
} from "@/app/(nav)/dashboard/data";
import { DashboardChart } from "@/components/dashboard/chart";
import WalletBalanceCard from "@/components/dashboard/wallet-balance";
import DashboarddCalendar from "@/components/dashboard/Dashcalendar";
import NotificationCard from "@/components/dashboard/notification-card";
import { ConversationsAPIResponse, PageMessages } from "@/app/(nav)/(messages-reviews)/messages/types";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { transformUsersMessages } from "@/app/(nav)/(messages-reviews)/messages/data";
import { useChatStore } from "@/store/message";
import { SectionContainer } from "@/components/Section/section-components";
import CustomTable from "@/components/Table/table";

const PropertyDevDashboardVariantA = () => {
  const [dashboardStats, setDashboardStats] = useState(
    initialPropertyDevDashboardStats
  );
    const { setChatData } = useChatStore();
  const [pageUsersMsg, setPageUsersMsg] = useState<PageMessages[] | null>([]);

  // Recent messages
  const {
    data: usersMessages,
    loading: usersMsgLoading,
    error: usersMsgError,
    refetch: refetchMsg,
    isNetworkError: MsgNetworkError,
  } = useFetch<ConversationsAPIResponse>("/messages");
  useRefetchOnEvent("refetch-users-msg", () => {
    refetchMsg({ silent: true });
  });

  useEffect(() => {
    if (usersMessages) {
      const transformed = transformUsersMessages(usersMessages);
      setPageUsersMsg(transformed);
      setChatData("users_messages", transformed);
    }
  }, [usersMessages, setChatData]);

  return (
    <>
      <section className="custom-flex-col gap-10">
        <div className="w-full h-full flex flex-col xl:flex-row gap-x-10 gap-y-6">
          <div className="w-full xl:flex-1 space-y-4 mt-4 md:backdrop:mt-0 xl:space-y-6">
            <div className="dashboard-stats w-full flex py-1.5 xl:py-7 overflow-x-auto md:overflow-hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar">
              {dashboardStats.map((card, index) => (
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

            {/* Charts */}
            <div className="hidden md:block space-y-10">
              <div className="wallet-analysis-chart w-full h-fit">
                <DashboardChart
                  chartTitle="Wallet Analysis"
                  visibleRange
                  chartConfig={dashboardPerformanceChartConfig}
                  chartData={[]}
                />
              </div>
              <div className="listing-performance-chart w-full h-fit">
                <DashboardChart
                  chartTitle="listing Performance"
                  visibleRange
                  chartConfig={dashboardListingsChartConfig}
                  chartData={[]}
                />
              </div>
            </div>
          </div>

          <div className="w-full xl:w-[30%] xl:max-w-[342px] h-full grid md:grid-cols-2 xl:grid-cols-1 gap-6">
            <div className="wallet-balance-card">
              <WalletBalanceCard />
            </div>
            <div className="dashboard-calendar">
              <DashboarddCalendar />
            </div>

            <div className="recent-messages-card">
              <NotificationCard
                className="h-[358px]"
                seeAllLink="/messages"
                sectionHeader="Recent Messages"
                notifications={getRecentMessages(pageUsersMsg)}
              />
            </div>
            <div className="complaints-card">
              <NotificationCard
                className="h-[358px]"
                sectionHeader="Recent Applications"
                seeAllLink="#"
                notifications={[]}
              />
            </div>
          </div>
        </div>

        <SectionContainer
          className="recent-invoice-table"
          heading="Recent invoice"
          href="/accounting/invoice"
        >
          <CustomTable
            data={[]}
            fields={invoiceTableFields}
            tableHeadClassName="h-[76px]"
            tableBodyCellSx={{
              fontSize: "1rem",
              paddingTop: "18px",
              paddingBottom: "18px",
            }}
            tableHeadCellSx={{ fontSize: "1rem" }}
          />
          {[].length === 0 && (
            <div className="flex justify-center items-center min-h-[200px]">
              <p className="text-gray-500 dark:text-gray-400">
                No Recent Invoice Yet.
              </p>
            </div>
          )}
        </SectionContainer>

        {/* <SectionContainer
          className="recent-complaints-section"
          heading="Complains"
          href="/tasks/complaints"
        >
          {pageData && pageData.complaints.length === 0 ? (
            <div className="bg-white flex w-full justify-center items-center h-full min-h-[300px] dark:bg-[#3C3D37] p-6 border-2 border-dashed rounded-lg border-gray-300">
              <p className="text-gray-500 dark:text-gray-400">
                No Recent Complains.
              </p>
            </div>
          ) : (
            <KanbanBoard kanbanTask={pageData?.complaints} />
          )}
        </SectionContainer> */}
      </section>
    </>
  );
};

export default PropertyDevDashboardVariantA;
