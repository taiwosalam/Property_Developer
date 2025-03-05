"use client";

// Imports
import Card from "@/components/dashboard/card";
import {
  complaintsData,
  dashboardListingsChartConfig,
  dashboardListingsChartData,
  dashboardPerformanceChartConfig,
  invoiceTableFields,
  dashboardInvoiceTableData,
  getDashboardCardData,
  initialDashboardStats,
  getRecentMessages,
} from "./data";
import WalletBalanceCard from "@/components/dashboard/wallet-balance";
import NotificationCard from "@/components/dashboard/notification-card";
import { DashboardChart } from "@/components/dashboard/chart";
import DashboarddCalendar from "@/components/dashboard/Dashcalendar";
import { SectionContainer } from "@/components/Section/section-components";
import { TaskCard } from "@/components/dashboard/kanban/TaskCard";
import CustomTable from "@/components/Table/table";
import Link from "next/link";
import { useWalletStore } from "@/store/wallet-store";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import {
  ConversationsAPIResponse,
  PageMessages,
} from "../(messages-reviews)/messages/types";
import { transformUsersMessages } from "../(messages-reviews)/messages/data";
import { message_card_data } from "@/components/Message/data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { useChatStore } from "@/store/message";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { Modal, ModalContent } from "@/components/Modal/modal";
import CompanyStatusModal from "@/components/dashboard/company-status";
import DashboardLoading from "@/components/Loader/DashboardLoading";

const Dashboard = () => {
  const walletId = useWalletStore((state) => state.walletId);
  const [pageUsersMsg, setPageUsersMsg] =
    useState<PageMessages[]>(message_card_data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setChatData } = useChatStore();

  const company_status = usePersonalInfoStore((state) => state.company_status);
  const company_id = usePersonalInfoStore((state) => state.company_id);

  const recentTransactions = useWalletStore(
    (state) => state.recentTransactions
  );  

  // console.log("company_status", company_status)
  const transactions = useWalletStore((state) => state.transactions);

  const dashboardPerformanceChartData = transactions.map((t) => ({
    date: t.date,
    totalfunds: t.amount,
    credit: t.type === "credit" ? t.amount : 0,
    debit: t.type === "debit" ? t.amount : 0,
  }));

  const { data, loading, error, refetch } = useFetch("/dashboard/data");

  const {
    data: usersMessages,
    loading: usersMsgLoading,
    error: usersMsgError,
    refetch: refetchMsg,
  } = useFetch<ConversationsAPIResponse>("/messages");
  useRefetchOnEvent("refetch-users-msg", () => {
    refetchMsg({ silent: true });
  });

  const [dashboardStats, setDashboardStats] = useState(initialDashboardStats);
  useEffect(() => {
    if (data) {
      setDashboardStats(getDashboardCardData(data));
    }
  }, [data]);

  useEffect(() => {
    if (usersMessages) {
      const transformed = transformUsersMessages(usersMessages);
      setPageUsersMsg(transformed);
      setChatData("users_messages", transformed);
    }
  }, [usersMessages]);

  useEffect(() => {
    if (company_status === "pending" || company_status === "rejected") {
      setIsModalOpen(true);
    }
  }, [company_status]);

  if (!company_status) {
    return <DashboardLoading />;
  }

  return (
    <>
      {isModalOpen && (
        <Modal state={{ isOpen: isModalOpen, setIsOpen: setIsModalOpen }}>
          <ModalContent disableOutsideClick>
            <CompanyStatusModal
              status={company_status as "approved" | "pending" | "rejected"}
              id={Number(company_id)}
            />
          </ModalContent>
        </Modal>
      )}
      <section className="custom-flex-col gap-10">
        <div className="w-full h-full flex flex-col xl:flex-row gap-x-10 gap-y-6">
          <div className="w-full xl:flex-1 space-y-4 xl:space-y-6">
            <div className="w-full flex py-1.5 xl:py-7 overflow-x-auto md:overflow-hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar">
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

            {/* Chart */}
            <div className="hidden md:block space-y-10">
              <div className="w-full h-fit">
                <DashboardChart
                  chartTitle="Wallet Analysis"
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
            <WalletBalanceCard />
            <DashboarddCalendar />
            <NotificationCard
              className="h-[358px]"
              seeAllLink="/messages"
              sectionHeader="Recent Messages"
              notifications={getRecentMessages(pageUsersMsg)}
            />
            <NotificationCard
              className="h-[358px]"
              sectionHeader="Complaints"
              seeAllLink="/tasks/complaints"
              notifications={complaintsData}
            />
          </div>
        </div>

        <SectionContainer heading="Recent invoice" href="/accounting/invoice">
          <CustomTable
            data={dashboardInvoiceTableData}
            fields={invoiceTableFields}
            tableHeadClassName="h-[76px]"
            tableBodyCellSx={{
              fontSize: "1rem",
              paddingTop: "18px",
              paddingBottom: "18px",
            }}
            tableHeadCellSx={{ fontSize: "1rem" }}
          />
        </SectionContainer>
        <SectionContainer heading="Recent Complains" href="/tasks/complaints">
          <div className="bg-white dark:bg-[#3C3D37] p-6 border-2 border-dashed rounded-lg border-gray-300 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <TaskCard
                  statusChanger={false}
                  noDrag
                  isNew
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
                      status: "pending",
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
    </>
  );
};

export default Dashboard;
