"use client";

// Imports
import Card from "@/components/dashboard/card";
import {
  invoiceTableFields,
  getDashboardCardData,
  dashboardListingsChartConfig,
} from "./data";
import DashboarddCalendar from "@/components/dashboard/Dashcalendar";
import { SectionContainer } from "@/components/Section/section-components";
import CustomTable from "@/components/Table/table";
import Link from "next/link";
import { useWalletStore } from "@/store/wallet-store";
import clsx from "clsx";
import { useRole } from "@/hooks/roleContext";
import DashboardLoading from "@/components/Loader/DashboardLoading";
import { useEffect, useState } from "react";
import { DashboardBranchDataResponse } from "./types";
import { CardData } from "./types";
import useFetch from "@/hooks/useFetch";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import NetworkError from "@/components/Error/NetworkError";
import {
  InvoiceListResponse,
  TransformedInvoiceData,
} from "../accounting/invoice/types";
import { transformInvoiceData } from "../accounting/invoice/data";
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
import { DashboardChart } from "@/components/dashboard/chart";
import { getRecentMessages, initialDashboardStats } from "../../dashboard/data";
import { DashboardDataResponse } from "../../dashboard/types";
import { useTourStore } from "@/store/tour-store";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { Modal, ModalContent } from "@/components/Modal/modal";
import CompanyStatusModal from "@/components/dashboard/company-status";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { transformUsersMessages } from "../../(messages-reviews)/messages/data";
import {
  ConversationsAPIResponse,
  PageMessages,
} from "../../(messages-reviews)/messages/types";
import NotificationCard from "@/components/dashboard/notification-card";
import { useChatStore } from "@/store/message";

const AccountManagerDashboard = () => {
  const { role, setRole } = useRole();
  const walletId = useWalletStore((state) => state.walletId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageUsersMsg, setPageUsersMsg] = useState<PageMessages[] | null>([]);
  const { setChatData } = useChatStore();
  const [dashboardStats, setDashboardStats] = useState<CardData[]>([]);
  const { setShouldRenderTour, completeTour, setPersist, isTourCompleted } =
    useTourStore();

  const company_status = usePersonalInfoStore((state) => state.company_status);
  // console.log("company_status", company_status)
  const company_id = usePersonalInfoStore((state) => state.company_id);
  const [invoiceData, setInvoiceData] = useState<TransformedInvoiceData | null>(
    null
  );
  const { data, loading, error, isNetworkError } =
    useFetch<DashboardBranchDataResponse>("/branch-data");

  // Update state when data is fetched
  useEffect(() => {
    if (data) {
      setDashboardStats(getDashboardCardData(data));
    }
  }, [data]);

  // Dashboard Stats
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: dashboardRefetch,
    isNetworkError: dashboardIsNetworkError,
  } = useFetch<DashboardDataResponse>("/dashboard/data");
  const [performanceChart, setPerformanceChart] =
    useState<DashboardDataResponse | null>(null);
  useEffect(() => {
    if (dashboardData) {
      setDashboardStats(getDashboardCardData(dashboardData as any));
      setPerformanceChart(dashboardData);
    }
  }, [dashboardData]);

  const bookmarkChartData =
    dashboardData?.data?.chart_data.map((item: any) => ({
      date: item?.date,
      views: item?.total_views,
      bookmarks: item?.total_bookmarks,
    })) || [];

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

  // Handle Complaints KanbanBoard
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

  // Tour logic
  useEffect(() => {
    if (loading) {
      // Wait for data to load
      setShouldRenderTour(false);
      return;
    }
    // Set persist to false for NavTour and DashboardTour
    setPersist(false);
    const hasNoProperties = dashboardStats.some(
      (stat) => stat.title === "Properties" && stat.value === "0"
    );

    const hasNoVacantUnits = dashboardStats.some(
      (stat) => stat.title === "Vacant Unit" && stat.value === "0"
    );
    const shouldRunTour =
      company_status === "approved" && hasNoProperties && hasNoVacantUnits;

    if (shouldRunTour) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [
    company_status,
    dashboardStats,
    loading,
    setShouldRenderTour,
    setPersist,
    isTourCompleted,
  ]);
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

  // Handle error
  if (isNetworkError) return <NetworkError />;
  if (loading) return <DashboardLoading />;

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
          <div className="w-full xl:flex-1 space-y- xl:space-y-2">
            <div className="w-full flex py-1.5 xl:py-1 overflow-x-auto md:overflow-hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar">
              {dashboardStats.map((card, index) => (
                <Link
                  href={card.link}
                  key={index}
                  prefetch={false}
                  className={clsx({
                    "lg:mt-6": index >= dashboardStats.length - 3,
                  })}
                >
                  <Card
                    title={card.title}
                    icon={<card.icon />}
                    value={card.value.toString()}
                    subvalue={card.subValue.toString()}
                    bg={card.bg}
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="w-full xl:w-[30%] xl:max-w-[342px] h-full grid md:grid-cols-2 xl:grid-cols-1 gap-6">
            <DashboarddCalendar />
          </div>
        </div>

        <div className="w-full h-full flex flex-col xl:flex-row gap-x-10 gap-y-6">
          <div className="listing-performance-chart w-full xl:flex-1 space-y- xl:space-y-2">
            <DashboardChart
              chartTitle="listing Performance"
              visibleRange
              chartConfig={dashboardListingsChartConfig}
              chartData={bookmarkChartData}
            />
          </div>

          <div className="w-full xl:w-[30%] xl:max-w-[342px] h-full grid md:grid-cols-2 xl:grid-cols-1 gap-6">
            <NotificationCard
              className="h-[358px]"
              seeAllLink="/messages"
              sectionHeader="Recent Messages"
              notifications={getRecentMessages(pageUsersMsg)}
            />
          </div>
        </div>

        {/* Recent Invoice */}
        <SectionContainer
          className="recent-invoice-table"
          heading="Recent invoice"
          href="/accountant/accounting/invoice"
        >
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

        {/* Recent Complains */}
        <SectionContainer
          className="recent-complaints-section"
          heading="Complains"
          href="/accountant/tasks/complaints"
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
        </SectionContainer>
      </section>
    </>
  );
};

export default AccountManagerDashboard;
