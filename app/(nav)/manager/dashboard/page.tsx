"use client";

// Imports
import Card from "@/components/dashboard/card";
import {
  dashboardListingsChartConfig,
  invoiceTableFields,
  complaintsData,
  dashboardCardData,
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
import useWindowWidth from "@/hooks/useWindowWidth";
import useFetch from "@/hooks/useFetch";
import { useEffect, useMemo, useState } from "react";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import {
  SingleBranchResponseType,
  Stats,
} from "../../management/staff-branch/[branchId]/types";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import {
  branchIdChartConfig,
  transformSingleBranchAPIResponse,
} from "../../management/staff-branch/[branchId]/data";
import { useGlobalStore } from "@/store/general-store";
import { getTransactionIcon } from "@/components/Wallet/icons";
import clsx from "clsx";
import BranchBalanceCard, {
  normalizeIsActive,
} from "@/components/Management/Staff-And-Branches/Branch/branch-balance-card";
import {
  ConversationsAPIResponse,
  PageMessages,
} from "../../(messages-reviews)/messages/types";
import { transformUsersMessages } from "../../(messages-reviews)/messages/data";
import { useChatStore } from "@/store/message";
import { getRecentMessages, initialDashboardStats } from "../../dashboard/data";
import { InvoiceListResponse } from "../../accounting/invoice/types";
import { transformInvoiceData } from "../accounting/invoice/data";
import { TransformedInvoiceData } from "../accounting/invoice/types";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import NetworkError from "@/components/Error/NetworkError";
import DashboardLoading from "@/components/Loader/DashboardLoading";
import {
  ComplaintsPageData,
  ComplaintsResponse,
} from "../../tasks/complaints/types";
import {
  ComplaintsDashboard,
  transformComplaintDashboard,
  transformComplaintsData,
} from "../../tasks/complaints/data";
import { KanbanBoard } from "@/components/dashboard/kanban/KanbanBoard";
import { useRole } from "@/hooks/roleContext";
import { useTourStore } from "@/store/tour-store";
import { Modal, ModalContent } from "@/components/Modal/modal";
import CompanyStatusModal from "@/components/dashboard/company-status";
import { useBranchInfoStore } from "@/store/branch-info-store";
import { usePermission } from "@/hooks/getPermission";

const Dashboard = () => {
  const { isMobile } = useWindowWidth();
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const { role } = useRole();
  const { setChatData } = useChatStore();
  const setWalletStore = useWalletStore((s) => s.setWalletStore);
  const { setGlobalInfoStore } = useGlobalStore((s) => ({
    setGlobalInfoStore: s.setGlobalInfoStore,
  }));
  // PERMISSIONS
  const canViewComplain = usePermission(role, "Can view complaints");

  const [pageUsersMsg, setPageUsersMsg] = useState<PageMessages[] | null>([]);
  const [invoiceData, setInvoiceData] = useState<TransformedInvoiceData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const company_status = usePersonalInfoStore((state) => state.company_status);
  const company_id = usePersonalInfoStore((state) => state.company_id);
  const branchWallet = useBranchInfoStore((s) => s.sub_wallet);
  const managerWalletIsActive = normalizeIsActive(
    branchWallet?.is_active as string | boolean
  );

  // Open modal if company status is "pending" or "rejected"
  useEffect(() => {
    if (company_status === "pending" || company_status === "rejected") {
      setIsModalOpen(true);
    }
  }, [company_status]);

  const branchURL =
    BRANCH_ID && BRANCH_ID !== 0 ? `/branch/${BRANCH_ID}` : null;
  const { data, error, loading, isNetworkError, refetch } =
    useFetch<SingleBranchResponseType>(branchURL);
  useRefetchOnEvent("refetch-branch-data", () => {
    refetch({ silent: true });
  });

  // =========== INVOICE DATA ===========
  // Conditionally set the URL only if BRANCH_ID is valid
  const fetchUrl =
    BRANCH_ID && BRANCH_ID !== 0
      ? `/invoice/list?branch_id=${BRANCH_ID}`
      : null;

  const {
    data: invoiceResponseData,
    error: invoiceError,
    loading: invoiceLoading,
    isNetworkError: invoiceNetworkError,
    silentLoading: invoiceSilentLoading,
  } = useFetch<InvoiceListResponse>(fetchUrl);

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

  // =========== BRANCH DATA ===========
  const branchData = data ? transformSingleBranchAPIResponse(data) : null;
  const {
    branch_wallet,
    transactions,
    recent_transactions,
    receipt_statistics,
  } = branchData || {};

  const yesNoToActiveInactive = (yesNo: string): boolean => {
    return yesNo === "Yes" ? true : false;
  };

  useEffect(() => {
    if (branchData?.branch_wallet) {
      const walletData = {
        status: branch_wallet !== null ? "active" : "inactive",
        wallet_id: Number(branchData.branch_wallet.wallet_id),
        is_active: yesNoToActiveInactive(
          branchData.branch_wallet.is_active as string
        ),
      };

      // Only update if the data has actually changed
      const currentSubWallet = useWalletStore.getState().sub_wallet;
      if (JSON.stringify(currentSubWallet) !== JSON.stringify(walletData)) {
        setWalletStore("sub_wallet", walletData);
      }
    }
  }, [branchData?.branch_wallet]);

  // useEffect(() => {
  //   if (branchData?.branch_wallet) {
  //     setWalletStore("sub_wallet", {
  //       status: branch_wallet !== null ? "active" : "inactive",
  //       wallet_id: Number(branchData.branch_wallet.wallet_id),
  //       is_active: yesNoToActiveInactive(
  //         branchData.branch_wallet.is_active as string
  //       ),
  //     });
  //   }
  // }, [branchData, setWalletStore]);

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

  // const updatedDashboardCardDatas = dashboardCardData.map((card) => {
  //   let stats: Stats | undefined;
  //   let link = "";
  //   switch (card.title) {
  //     case "Properties":
  //       stats = branchData?.properties;
  //       link = `/manager/management/properties`;
  //       break;
  //     case "Landlords":
  //       stats = branchData?.landlords;
  //       link = `/manager/management/landlord`;
  //       break;
  //     case "Tenants & Occupants":
  //       stats = branchData?.tenants;
  //       link = `/manager/management/tenants`;
  //       break;
  //     case "Vacant Unit":
  //       stats = branchData?.vacant_units;
  //       link = `/manager/management/rent-unit?is_active=vacant`;
  //       break;
  //     case "Expired":
  //       stats = branchData?.expired;
  //       link = `/manager/management/rent-unit?is_active=expired`;
  //       break;
  //     case "Invoices":
  //       stats = branchData?.invoices;
  //       link = `/manager/accounting/invoice?status=pending`;
  //       break;
  //     case "Inquiries":
  //       stats = branchData?.inquiries;
  //       link = `/manager/tasks/inquires`;
  //       break;
  //     case "Complaints":
  //       stats = branchData?.complaints;
  //       link = `/manager/tasks/complaints`;
  //       break;
  //     case "Listings":
  //       stats = branchData?.listings;
  //       link = `/manager/listing/units`;
  //       break;
  //     default:
  //       break;
  //   }

  //   return {
  //     ...card,
  //     link,
  //     value: stats ? stats.total : card.value,
  //     subValue: stats ? stats.new_this_month : card.subValue,
  //   };
  // });

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

  // SAVE BRANCH WALLET TRANSACTIONS TO STORE
  useEffect(() => {
    if (transactions) {
      const currentTransactions =
        useGlobalStore.getState()?.branchWalletTransactions;
      if (
        JSON.stringify(currentTransactions) !== JSON.stringify(transactions)
      ) {
        setGlobalInfoStore("branchWalletTransactions", transactions);
      }
    }
  }, [transactions]); // setGlobalInfoStore (remove global store)

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

  // ======== LISTING PERFORMANCE CHART DATA ===========

  const bookmarkChartData = useMemo(() => {
    return (
      branchData?.chart_data.map((item: any) => ({
        date: item?.date,
        views: item?.total_views,
        bookmarks: item?.total_bookmarks,
      })) || []
    );
  }, [branchData?.chart_data]);

  // ====== Handle Complaints KanbanBoard ======
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
  const { setShouldRenderTour, completeTour, setPersist, isTourCompleted } =
    useTourStore();
  const [dashboardStats, setDashboardStats] = useState(initialDashboardStats);

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

  const gotoPage = () => {
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
  };

  if (isNetworkError) return <NetworkError />;

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
                mainBalance={Number(branch_wallet?.balance_total || 0)}
                cautionDeposit={Number(branch_wallet?.escrow_balance || 0)}
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
      </section>
    </>
  );
};

export default Dashboard;
