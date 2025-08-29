"use client";
import CompanyStatusModal from "@/components/dashboard/company-status";
import { Modal, ModalContent } from "@/components/Modal/modal";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  dashboardCardData,
  dashboardListingsChartConfig,
  invoiceTableFields,
} from "./data";
import {
  SingleBranchResponseType,
  Stats,
} from "../../management/staff-branch/[branchId]/types";
import useFetch from "@/hooks/useFetch";
import Link from "next/link";
import Card from "@/components/dashboard/card";
import {
  branchIdChartConfig,
  transformSingleBranchAPIResponse,
} from "../../management/staff-branch/[branchId]/data";
import { DashboardChart } from "@/components/dashboard/chart";
import BranchBalanceCard, {
  normalizeIsActive,
} from "@/components/Management/Staff-And-Branches/Branch/branch-balance-card";
import DashboarddCalendar from "@/components/dashboard/Dashcalendar";
import { useBranchInfoStore } from "@/store/branch-info-store";
import NotificationCard from "@/components/dashboard/notification-card";
import { getRecentMessages, initialDashboardStats } from "../../dashboard/data";
import { usePermission } from "@/hooks/getPermission";
import { useRole } from "@/hooks/roleContext";
import {
  ConversationsAPIResponse,
  PageMessages,
} from "../../(messages-reviews)/messages/types";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { transformUsersMessages } from "../../(messages-reviews)/messages/data";
import { useChatStore } from "@/store/message";
import {
  ComplaintsPageData,
  ComplaintsResponse,
} from "../../tasks/complaints/types";
import {
  ComplaintsDashboard,
  transformComplaintDashboard,
  transformComplaintsData,
} from "../../tasks/complaints/data";
import { SectionContainer } from "@/components/Section/section-components";
import CustomTable from "@/components/Table/table";
import {
  InvoiceListResponse,
  TransformedInvoiceData,
} from "../accounting/invoice/types";
import { transformInvoiceData } from "../accounting/invoice/data";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { KanbanBoard } from "@/components/dashboard/kanban/KanbanBoard";
import { useTourStore } from "@/store/tour-store";

const ManagerDashboard = () => {
  // ============= HOOKS (PUT FIRST ALWAYS) ==============
  const { role } = useRole();
  const company_status = usePersonalInfoStore((state) => state.company_status);
  const company_id = usePersonalInfoStore((state) => state.company_id);
  const { branch } = usePersonalInfoStore();
  const branchWallet = useBranchInfoStore((s) => s.sub_wallet);
  const setChatData = useChatStore((s) => s.setChatData);
  const { setShouldRenderTour, completeTour, setPersist, isTourCompleted } =
    useTourStore();
  const [dashboardStats, setDashboardStats] = useState(initialDashboardStats);

  // ============== useState HOOKS follows ============
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageUsersMsg, setPageUsersMsg] = useState<PageMessages[] | null>([]);
  const [pageData, setPageData] = useState<ComplaintsPageData | null>(null);
  const [recentComplaints, setRecentComplaints] =
    useState<ComplaintsDashboard | null>(null);
  const [invoiceData, setInvoiceData] = useState<TransformedInvoiceData | null>(
    null
  );

  const BRANCH_ID = branch?.branch_id || 0;
  // ============ Use refs to prevent infinite loops ===========
  const prevSetChatDataRef = useRef<string>("");
  const prevWalletStoreRef = useRef<string>("");
  const prevGlobalStoreRef = useRef<string>("");
  const prevBranchInfoRef = useRef<string>("");

  // ============== PERMISSIONS ==================
  const canViewComplain = usePermission(role, "Can view complaints");

  // Open modal if company status is "pending" or "rejected"
  useEffect(() => {
    if (company_status === "pending" || company_status === "rejected") {
      setIsModalOpen(true);
    }
  }, [company_status]);

  //=============== GET BRANCH DATA with cache ===============
  const branchURL =
    BRANCH_ID && BRANCH_ID !== 0 ? `/branch/${BRANCH_ID}` : null;

  const { data, error, loading, isNetworkError, refetch } =
    useFetch<SingleBranchResponseType>(branchURL, {
      cache: {
        enabled: true,
        key: `branch-${BRANCH_ID}`,
        ttl: 5 * 60 * 1000, // 5 minutes (adjust as needed)
      },
    });
  useRefetchOnEvent("refetch-branch-data", () => {
    refetch({ silent: true });
  });
  const branchData = data ? transformSingleBranchAPIResponse(data) : null;

  //================= STATS CARD ================
  const updatedDashboardCardData = useMemo(() => {
    return dashboardCardData.map((card) => {
      let stats: Stats | undefined;
      let link = "";
      switch (card.title) {
        case "Properties":
          stats = branchData?.properties;
          link = `/manager/management/properties`;
          break;
        case "Landlords":
          stats = branchData?.landlords;
          link = `/manager/management/landlord`;
          break;
        case "Tenants & Occupants":
          stats = branchData?.tenants;
          link = `/manager/management/tenants`;
          break;
        case "Vacant Unit":
          stats = branchData?.vacant_units;
          link = `/manager/management/rent-unit?is_active=vacant`;
          break;
        case "Expired":
          stats = branchData?.expired;
          link = `/manager/management/rent-unit?is_active=expired`;
          break;
        case "Invoices":
          stats = branchData?.invoices;
          link = `/manager/accounting/invoice?status=pending`;
          break;
        case "Inquiries":
          stats = branchData?.inquiries;
          link = `/manager/tasks/inquires`;
          break;
        case "Complaints":
          stats = branchData?.complaints;
          link = `/manager/tasks/complaints`;
          break;
        case "Listings":
          stats = branchData?.listings;
          link = `/manager/listing/units`;
          break;
        default:
          break;
      }

      return {
        ...card,
        link,
        value: stats ? stats.total : card.value,
        subValue: stats ? stats.new_this_month : card.subValue,
      };
    });
  }, [branchData]);

  // ============== DASHBOARD CHART DATA ===============
  const { branch_wallet, recent_transactions } = branchData || {};
  const walletChartData = useMemo(() => {
    return recent_transactions?.map((t: any) => ({
      date: t.date,
      totalfunds: t.amount - 1000,
      credit:
        t.transaction_type === "funding" || t.transaction_type === "transfer_in"
          ? t.amount - 1000
          : 0,
      debit:
        t.transaction_type === "debit" || t.transaction_type === "transfer_out"
          ? t.amount - 1000
          : 0,
    }));
  }, [recent_transactions]);

  // ============= LISTING PERFORMANCE DATA  ===========
  const bookmarkChartData = useMemo(() => {
    return (
      branchData?.chart_data?.map((item: any) => ({
        date: item?.date,
        views: item?.total_views,
        bookmarks: item?.total_bookmarks,
      })) || []
    );
  }, [branchData?.chart_data]);

  // ================= CONDITIONAL CHECKS ==========
  const managerWalletIsActive = normalizeIsActive(
    branchWallet?.is_active as string | boolean
  );

  // ================= RECENT MESSAGCES ============
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

  // FIXED: Chat data update with proper change detection
  useEffect(() => {
    if (usersMessages) {
      const transformed = transformUsersMessages(usersMessages);
      const transformedString = JSON.stringify(transformed);

      if (prevSetChatDataRef.current !== transformedString) {
        prevSetChatDataRef.current = transformedString;
        setPageUsersMsg(transformed);
        setChatData("users_messages", transformed);
      }
    }
  }, [usersMessages, setChatData]);

  //=============== GET COMPLAINT DATA with cache ===============
  const complaintsURL = `/complaints`;
  const { data: complaintData } = useFetch<ComplaintsResponse>(complaintsURL, {
    cache: {
      enabled: true,
      key: "complaints-data", // unique cache key
      ttl: 5 * 60 * 1000, // 5 minutes
    },
  });

  useEffect(() => {
    if (complaintData) {
      const transformData = transformComplaintsData(complaintData);
      setPageData(transformData);

      const transformRecentComplaints =
        transformComplaintDashboard(complaintData);
      setRecentComplaints(transformRecentComplaints);
    }
  }, [complaintData]);

  // =========== INVOICE DATA ===========
  const fetchUrl =
    BRANCH_ID && BRANCH_ID !== 0
      ? `/invoice/list?branch_id=${BRANCH_ID}`
      : null;

  const { data: invoiceResponseData } = useFetch<InvoiceListResponse>(
    fetchUrl,
    {
      cache: {
        enabled: true,
        key: `invoices-${BRANCH_ID}`, // unique per branch
        ttl: 5 * 60 * 1000, // 5 minutes cache
      },
    }
  );

  useEffect(() => {
    if (invoiceResponseData) {
      const transformed = transformInvoiceData(invoiceResponseData);
      setInvoiceData(transformed);
    }
  }, [invoiceResponseData]);

  // Handle invoiceData nullability
  const invoiceList = invoiceData?.invoices?.slice(0, 15) || [];
  const transformedRecentInvoiceTableData = useMemo(() => {
    const invoiceList = invoiceData?.invoices?.slice(0, 15) || [];
    return invoiceList.map((i) => ({
      ...i,
      client_name: (
        <p className="flex items-center whitespace-nowrap">
          <span>{i.client_name}</span>
          {i.badge_color && <BadgeIcon color={i.badge_color} />}
        </p>
      ),
    }));
  }, [invoiceData?.invoices]);

  // ============= REDIRECT & HELPERS =============
  const gotoPage = useCallback(() => {
    switch (role) {
      case "director":
        return "/tasks/complaints";
      case "manager":
        return "/manager/tasks/complaints";
      case "staff":
        return "/staff/tasks/complaints";
      case "accountant":
        return "/accountant/tasks/complaints";
      default:
        return "/unauthorized";
    }
  }, [role]);

  const yesNoToActiveInactive = useCallback((yesNo: string): boolean => {
    return yesNo === "Yes";
  }, []);

  // =============== TOUR LOGIC HANDLER =================
  // Memoize tour conditions
  const tourShouldRun = useMemo(() => {
    if (loading) return false;

    const hasNoProperties = dashboardStats.some(
      (stat) => stat.title === "Properties" && stat.value === "0"
    );
    const hasNoVacantUnits = dashboardStats.some(
      (stat) => stat.title === "Vacant Unit" && stat.value === "0"
    );

    return company_status === "approved" && hasNoProperties && hasNoVacantUnits;
  }, [company_status, dashboardStats, loading]);

  useEffect(() => {
    setPersist(false);
    setShouldRenderTour(tourShouldRun);

    return () => setShouldRenderTour(false);
  }, [tourShouldRun, setShouldRenderTour, setPersist]);

  //================================= RENDER STARTS HERE ========================================
  return (
    <div>
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

      {/* BODY */}
      <section className="custom-flex-col gap-10">
        <div className="w-full h-full flex flex-col xl:flex-row gap-x-10 gap-y-6">
          <div className="w-full xl:flex-1 space-y-4 xl:space-y-6">
            <div className="w-full flex py-1.5 xl:py-7 overflow-x-auto md:overflow-hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar">
              {updatedDashboardCardData.map((card, index) => (
                <Link href={card.link} key={index} prefetch={false}>
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

            {/* Chart */}
            <div className="hidden md:block space-y-10">
              <div className="w-full h-fit">
                <DashboardChart
                  chartTitle="Wallet Analysis"
                  visibleRange
                  className="wallet-analysis-card"
                  chartConfig={branchIdChartConfig}
                  chartData={walletChartData}
                />
              </div>
              <div className="listing-performance-chart w-full h-fit">
                <DashboardChart
                  chartTitle="listing Performance"
                  visibleRange
                  chartConfig={dashboardListingsChartConfig}
                  chartData={bookmarkChartData || []}
                />
              </div>
            </div>
          </div>

          <div className="w-full xl:w-[30%] xl:max-w-[342px] h-full grid md:grid-cols-2 xl:grid-cols-1 gap-6">
            {managerWalletIsActive && (
              <BranchBalanceCard
                mainBalance={parseFloat(branch_wallet?.balance_total || 0)}
                cautionDeposit={parseFloat(branch_wallet?.escrow_balance || 0)}
                className="max-w-full"
              />
            )}
            <DashboarddCalendar />
            <div className="recent-messages-card">
              <NotificationCard
                className="h-[358px]"
                seeAllLink="/messages"
                sectionHeader="Recent Messages"
                notifications={getRecentMessages(pageUsersMsg)}
              />
            </div>
            {canViewComplain && (
              <div className="complaints-card">
                <NotificationCard
                  className="h-[358px]"
                  sectionHeader="Recent Complaints"
                  seeAllLink={gotoPage()}
                  notifications={recentComplaints?.complaints.slice(0, 7) || []}
                />
              </div>
            )}
          </div>
        </div>
        {/* =========== RECENT INVOICES =========== */}
        <SectionContainer
          className="recent-invoice-table"
          heading="Recent invoice"
          href="/manager/accounting/invoice"
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
        {/* =========== RECENT COMPLAINS =========== */}
        {canViewComplain && (
          <SectionContainer
            heading="Recent Complains"
            href="/manager/tasks/complaints"
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
        )}
        ˝
      </section>
    </div>
  );
};

export default ManagerDashboard;
