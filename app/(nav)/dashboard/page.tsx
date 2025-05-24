"use client";

// Imports
import Card from "@/components/dashboard/card";
import {
  complaintsData,
  dashboardListingsChartConfig,
  dashboardListingsChartData,
  dashboardPerformanceChartConfig,
  invoiceTableFields,
  getDashboardCardData,
  initialDashboardStats,
  getRecentMessages,
  dummyTasks,
  transformWalletChartData,
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
// import { message_card_data } from "@/components/Message/data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { useChatStore } from "@/store/message";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { Modal, ModalContent } from "@/components/Modal/modal";
import CompanyStatusModal from "@/components/dashboard/company-status";
import DashboardLoading from "@/components/Loader/DashboardLoading";
import {
  InvoiceListResponse,
  TransformedInvoiceData,
} from "../accounting/invoice/types";
import { transformInvoiceData } from "../accounting/invoice/data";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import NetworkError from "@/components/Error/NetworkError";
import { DashboardDataResponse } from "./types";
import {
  ComplaintsPageData,
  ComplaintsResponse,
} from "../tasks/complaints/types";
import {
  ComplaintsDashboard,
  transformComplaintDashboard,
  transformComplaintsData,
} from "../tasks/complaints/data";
import { KanbanBoard } from "@/components/dashboard/kanban/KanbanBoard";

const Dashboard = () => {
  const walletId = useWalletStore((state) => state.walletId);
  const [pageUsersMsg, setPageUsersMsg] = useState<PageMessages[] | null>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setChatData } = useChatStore();
  const company_status = usePersonalInfoStore((state) => state.company_status);
  // console.log("company_status", company_status)
  const company_id = usePersonalInfoStore((state) => state.company_id);
  const [invoiceData, setInvoiceData] = useState<TransformedInvoiceData | null>(
    null
  );
  const recentTransactions = useWalletStore(
    (state) => state.recentTransactions
  );
  const transactions = useWalletStore((state) => state.transactions);

  const walletChartData = transformWalletChartData(transactions);
  // Dashboard Stats
  const { data, loading, error, refetch, isNetworkError } =
    useFetch<DashboardDataResponse>("/dashboard/data");
  const [dashboardStats, setDashboardStats] = useState(initialDashboardStats);
  const [performanceChart, setPerformanceChart] =
    useState<DashboardDataResponse | null>(null);
  useEffect(() => {
    if (data) {
      setDashboardStats(getDashboardCardData(data));
      setPerformanceChart(data);
    }
  }, [data]);

  const bookmarkChartData =
    data?.data?.chart_data.map((item) => ({
      date: item?.date,
      views: item?.total_views,
      bookmarks: item?.total_bookmarks,
    })) || [];

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
  }, [usersMessages]);

  // Open modal if company status is "pending" or "rejected"
  useEffect(() => {
    if (company_status === "pending" || company_status === "rejected") {
      setIsModalOpen(true);
    }
  }, [company_status]);

  // Fetch and transform invoice data
  const {
    data: Apiinvoices,
    loading: invoicesLoading,
    error: invoicesError,
    isNetworkError: invoiceNetworkError,
  } = useFetch<InvoiceListResponse>("/invoice/list");
  useEffect(() => {
    if (Apiinvoices) {
      const transformed = transformInvoiceData(Apiinvoices);
      setInvoiceData(transformed);
    }
  }, [Apiinvoices]);

  // Handle invoiceData nullability
  const invoiceList = invoiceData?.invoices?.slice(0, 15) || [];
  const transformedRecentInvoiceTableData = invoiceList.map((i) => ({
    ...i,
    client_name: (
      <p className="flex items-center whitespace-nowrap">
        <span>{i.client_name}</span>
        {i.badge_color && <BadgeIcon color={i.badge_color} />}
      </p>
    ),
  }));

  // Handle Complaints KanbaBoard
  const [pageData, setPageData] = useState<ComplaintsPageData | null>(null);
  const [recentComplaints, setRecentComplaints] =
    useState<ComplaintsDashboard | null>(null);

  const { data: complaintData } = useFetch<ComplaintsResponse>(`/complaints`);

  useEffect(() => {
    if (complaintData) {
      const transformData = transformComplaintsData(complaintData);
      setPageData(transformData);

      const transformRecentComplaints =
        transformComplaintDashboard(complaintData);
      setRecentComplaints(transformRecentComplaints);
    }
  }, [complaintData]);

  if (isNetworkError) return <NetworkError />;
  // ================== CONDITIONAL RENDERING ================== //
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

            {/* Charts */}
            <div className="hidden md:block space-y-10">
              <div className="w-full h-fit">
                <DashboardChart
                  chartTitle="Wallet Analysis"
                  visibleRange
                  chartConfig={dashboardPerformanceChartConfig}
                  // chartData={dashboardPerformanceChartData}
                  chartData={walletChartData}
                />
              </div>
              <div className="w-full h-fit">
                <DashboardChart
                  chartTitle="listing Performance"
                  visibleRange
                  chartConfig={dashboardListingsChartConfig}
                  chartData={bookmarkChartData}
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
              sectionHeader="Recent Complaints"
              seeAllLink="/tasks/complaints"
              notifications={recentComplaints?.complaints || []}
            />
          </div>
        </div>

        <SectionContainer heading="Recent invoice" href="/accounting/invoice">
          <CustomTable
            data={transformedRecentInvoiceTableData}
            fields={invoiceTableFields}
            tableHeadClassName="h-[76px]"
            tableBodyCellSx={{
              fontSize: "1rem",
              paddingTop: "18px",
              paddingBottom: "18px",
            }}
            tableHeadCellSx={{ fontSize: "1rem" }}
          />
          {transformedRecentInvoiceTableData.length === 0 && (
            <div className="flex justify-center items-center min-h-[200px]">
              <p className="text-gray-500 dark:text-gray-400">
                No Recent Invoice Yet.
              </p>
            </div>
          )}
        </SectionContainer>

        <SectionContainer heading="Complains" href="/tasks/complaints">
          {pageData && pageData.complaints.length === 0 ? (
            <div className="bg-white flex w-full justify-center items-center h-full min-h-[300px] dark:bg-[#3C3D37] p-6 border-2 border-dashed rounded-lg border-gray-300">
              <p className="text-gray-500 dark:text-gray-400">
                No Recent Complains.
              </p>
            </div>
          ) : (
            <KanbanBoard kanbanTask={pageData?.complaints} />
          )}
        </SectionContainer>
      </section>
    </>
  );
};

export default Dashboard;
