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
import { useEffect, useState } from "react";
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
import BranchBalanceCard from "@/components/Management/Staff-And-Branches/Branch/branch-balance-card";
import {
  ConversationsAPIResponse,
  PageMessages,
} from "../../(messages-reviews)/messages/types";
import { transformUsersMessages } from "../../(messages-reviews)/messages/data";
import { useChatStore } from "@/store/message";
import { getRecentMessages } from "../../dashboard/data";
import { InvoiceListResponse } from "../../accounting/invoice/types";
import { transformInvoiceData } from "../accounting/invoice/data";
import { TransformedInvoiceData } from "../accounting/invoice/types";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

const Dashboard = () => {
  const { isMobile } = useWindowWidth();
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const { setChatData } = useChatStore();
  const setWalletStore = useWalletStore((s) => s.setWalletStore);
  const { setGlobalInfoStore } = useGlobalStore((s) => ({
    setGlobalInfoStore: s.setGlobalInfoStore,
  }));
  const [pageUsersMsg, setPageUsersMsg] = useState<PageMessages[] | null>([]);
  const [invoiceData, setInvoiceData] = useState<TransformedInvoiceData | null>(
    null
  );

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
  const transformedRecentInvoiceTableData = invoiceList.map((i) => ({
    ...i,
    client_name: (
      <p className="flex items-center whitespace-nowrap">
        <span>{i.client_name}</span>
        {i.badge_color && <BadgeIcon color={i.badge_color} />}
      </p>
    ),
  }));

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

  setWalletStore("sub_wallet", {
    status: branch_wallet !== null ? "active" : "inactive",
    wallet_id:
      branch_wallet !== null
        ? Number(branchData?.branch_wallet?.wallet_id)
        : undefined,
    is_active:
      branch_wallet !== null &&
      yesNoToActiveInactive(branchData?.branch_wallet?.is_active as string),
  });

  const updatedDashboardCardData = dashboardCardData.map((card) => {
    let stats: Stats | undefined;
    let link = "";
    switch (card.title) {
      case "Properties":
        stats = branchData?.properties;
        link = `/manager/management/staff-branch/${BRANCH_ID}/properties`;
        break;
      case "Landlords":
        stats = branchData?.landlords;
        link = `/manager/management/staff-branch/${BRANCH_ID}/landlords`;
        break;
      case "Tenants & Occupants":
        stats = branchData?.tenants;
        link = `/manager/management/staff-branch/${BRANCH_ID}/tenants`;
        break;
      case "Vacant Unit":
        stats = branchData?.vacant_units;
        link = `/manager/management/staff-branch/${BRANCH_ID}/vacant-units`;
        break;
      case "Expired":
        stats = branchData?.expired;
        link = `/manager/management/staff-branch/${BRANCH_ID}/expired-units`;
        break;
      case "Invoices":
        stats = branchData?.invoices;
        link = `/manager/management/staff-branch/${BRANCH_ID}/invoices`;
        break;
      case "Inquiries":
        stats = branchData?.inquiries;
        link = `/manager/management/staff-branch/${BRANCH_ID}/inquiries`;
        break;
      case "Complaints":
        stats = branchData?.complaints;
        link = `/manager/management/staff-branch/${BRANCH_ID}/complaints`;
        break;
      case "Listings":
        stats = branchData?.listings;
        link = `/manager/management/staff-branch/${BRANCH_ID}/listings`;
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

  const transformedWalletTableData =
    transactions &&
    transactions.map((t: any) => ({
      ...t,
      amount: (
        <span
          className={clsx({
            "text-status-success-3":
              t.transaction_type === "funding" ||
              t.transaction_type === "transfer_in",
            "text-status-error-primary":
              t.transaction_type === "debit" ||
              t.transaction_type === "transfer_out",
          })}
        >
          {`${
            t.transaction_type === "funding" ||
            t.transaction_type === "transfer_in"
              ? "+"
              : t.transaction_type === "debit" ||
                t.transaction_type === "transfer_out"
              ? "-"
              : ""
          }${t.amount}`}
        </span>
      ),
      icon: (
        <div
          className={clsx(
            "flex items-center justify-center w-9 h-9 rounded-full",
            {
              "bg-status-error-1 text-status-error-primary":
                t.transaction_type === "debit" ||
                t.transaction_type === "transfer_out",
              "bg-status-success-1 text-status-success-primary":
                t.transaction_type === "funding" ||
                t.transaction_type === "transfer_in",
            }
          )}
        >
          {getTransactionIcon(t.source as string, t.transaction_type)}
        </div>
      ),
    }));

  const walletChartData =
    recent_transactions &&
    recent_transactions.map((t: any) => ({
      date: t.date,
      totalfunds: t.amount,
      credit:
        t.transaction_type === "funding" || t.transaction_type === "transfer_in"
          ? t.amount
          : 0,
      debit:
        t.transaction_type === "debit" || t.transaction_type === "transfer_out"
          ? t.amount
          : 0,
    }));

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
  }, [transactions, setGlobalInfoStore]);

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
                chartData={[]}
              />
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[30%] xl:max-w-[342px] h-full grid md:grid-cols-2 xl:grid-cols-1 gap-6">
          <BranchBalanceCard
            mainBalance={Number(branch_wallet?.balance_total || 0)}
            cautionDeposit={Number(branch_wallet?.escrow_balance || 0)}
            className="max-w-full"
            page="manager"
          />
          <DashboarddCalendar />
          <div className="recent-messages-card">
            <NotificationCard
              className="h-[358px]"
              seeAllLink="/messages"
              sectionHeader="Recent Messages"
              notifications={getRecentMessages(pageUsersMsg)}
            />
          </div>
          <NotificationCard
            className="h-[358px]"
            sectionHeader="Complaints"
            seeAllLink="/tasks/complaints"
            notifications={complaintsData}
          />
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
                  title: "Window dilapidated and entrance not working",
                  message: "Hello, this is Makinwa, and i want to ask you how",
                  avatarSrc: "/empty/avatar.png",
                }}
              />
            ))}
        </div>
      </SectionContainer>
      {/* {!isMobile && (
        <SectionContainer heading="To do list">
          <KanbanBoard />
        </SectionContainer>
      )} */}
    </section>
  );
};

export default Dashboard;
