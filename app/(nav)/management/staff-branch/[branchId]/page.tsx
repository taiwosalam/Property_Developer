"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Imports
import Card from "@/components/dashboard/card";
import Button from "@/components/Form/Button/button";
import { dashboardCardData } from "@/app/(nav)/dashboard/data";
import NotificationCard from "@/components/dashboard/notification-card";
import { DashboardChart } from "@/components/dashboard/chart";
import { ExclamationMark, LocationIcon } from "@/public/icons/icons";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { branchIdChartConfig } from "./data";
import AccountStatsCard from "@/components/Accounting/account-stats-card";
import BranchActivitiesCard from "@/components/Management/Staff-And-Branches/Branch/branch-activity-card";
import BranchBalanceCard from "@/components/Management/Staff-And-Branches/Branch/branch-balance-card";
import CreateStaffModal from "@/components/Management/Staff-And-Branches/create-staff-modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { DateRange } from "react-day-picker";
import BackButton from "@/components/BackButton/back-button";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import { transformSingleBranchAPIResponse } from "./data";
import NetworkError from "@/components/Error/NetworkError";
import type { Stats, SingleBranchResponseType } from "./types";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import useBranchStore from "@/store/branch-store";
import { useWalletStore } from "@/store/wallet-store";
import { ChevronRight } from "lucide-react";
import CustomTable from "@/components/Table/table";
import { walletTableFields } from "@/app/(nav)/wallet/data";
import clsx from "clsx";
import { getTransactionIcon } from "@/components/Wallet/icons";
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";
import { useTourStore } from "@/store/tour-store";
import { usePathname, useSearchParams } from "next/navigation";

const BranchDashboard = ({ params }: { params: { branchId: string } }) => {
  const { branchId } = params;
  const searchParams = useSearchParams();
  const { branch, setBranch } = useBranchStore();
  const setWalletStore = useWalletStore((s) => s.setWalletStore);
  const { setGlobalInfoStore } = useGlobalStore((s) => ({
    setGlobalInfoStore: s.setGlobalInfoStore,
  }));

  const { data, error, loading, isNetworkError, refetch } =
    useFetch<SingleBranchResponseType>(`branch/${branchId}`);
  useRefetchOnEvent("refetch_staff", () => refetch({ silent: true }));

  const [inoiceStatus, setInvoiceStatus] = useState("");

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
        link = `/management/staff-branch/${branchId}/properties`;
        break;
      case "Landlords":
        stats = branchData?.landlords;
        link = `/management/staff-branch/${branchId}/landlords`;
        break;
      case "Tenants & Occupants":
        stats = branchData?.tenants;
        link = `/management/staff-branch/${branchId}/tenants`;
        break;
      case "Vacant Unit":
        stats = branchData?.vacant_units;
        link = `/management/staff-branch/${branchId}/vacant-units`;
        break;
      case "Expired":
        stats = branchData?.expired;
        link = `/management/staff-branch/${branchId}/expired-units`;
        break;
      case "Invoices":
        stats = branchData?.invoices;
        link = `/management/staff-branch/${branchId}/invoices?status=pending`;
        break;
      case "Inquiries":
        stats = branchData?.inquiries;
        link = `/management/staff-branch/${branchId}/inquiries`;
        break;
      case "Complaints":
        stats = branchData?.complaints;
        link = `/management/staff-branch/${branchId}/complaints`;
        break;
      case "Listings":
        stats = branchData?.listings;
        link = `/management/staff-branch/${branchId}/listings`;
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

  // set branch data to store
  useEffect(() => {
    if (branch?.branch_name !== branchData?.branch_name) {
      setBranch("branch_name", branchData?.branch_name || "___");
      setBranch("address", branchData?.address || "___");
      setBranch("branch_id", branchId);
      setBranch("branch_picture", branchData?.picture || "___");
      setBranch("branch_details", branchData);
    }
  }, [branchData, branch, setBranch, branchId]);

  let isManagerAvailable = false;
  (branch?.branch_details as any)?.staffs?.map((staff: any) => {
    if (staff.position === "manager") {
      isManagerAvailable = true;
      setBranch("isManagerAvailable", isManagerAvailable);
    }
  });

  const calculateDateRange = (days: number) => {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - days);
    return { from: fromDate, to: now };
  };

  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(calculateDateRange(30));

  useEffect(() => {
    if (!selectedDateRange) {
      const initialRange = calculateDateRange(30);
      setSelectedDateRange(initialRange);
    }
  }, [selectedDateRange]);

  const {
    setShouldRenderTour,
    setPersist,
    isTourCompleted,
    goToStep,
    restartTour,
  } = useTourStore();

  const pathname = usePathname();

  useEffect(() => {
    setPersist(false);
    if (!isTourCompleted("branchDetailsTour")) {
      setShouldRenderTour(true);
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [setShouldRenderTour, setPersist, isTourCompleted]);

  if (loading) return <CustomLoader layout="dasboard" />;

  if (isNetworkError) return <NetworkError />;

  if (error) return <ServerError error={error} />;
  if (!branchData) return null;

  return (
    <div className="custom-flex-col gap-6">
      <div className="w-full gap-2 flex items-center justify-between flex-wrap">
        <BackButton reducePaddingTop as="div" className="items-start">
          <div className="flex gap-2 items-center">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
              {branchData.branch_name}
            </h1>
            <button
              onClick={() => restartTour(pathname)}
              type="button"
              className="text-orange-normal"
            >
              <ExclamationMark />
            </button>
          </div>

          <div className="text-text-disabled flex items-center space-x-1">
            <LocationIcon />
            <p className="text-sm font-medium">{branchData.address}</p>
          </div>
        </BackButton>

        <div className=" flex items-center justify-between gap-2 ml-auto flex-wrap">
          <Modal>
            <ModalTrigger asChild>
              <Button
                type="button"
                variant="border"
                className="create-staff-button page-header-button"
              >
                + create staff
              </Button>
            </ModalTrigger>
            <ModalContent>
              <CreateStaffModal
                branchId={branchId}
                hasManager={branchData.hasManager}
              />
            </ModalContent>
          </Modal>
          <Button
            type="button"
            className="edit-branch-button page-header-button"
            href={`/management/staff-branch/${branchId}/edit-branch`}
          >
            Edit Branch
          </Button>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row md:justify-between gap-x-8 gap-y-4 md:items-start">
        <div className="invoice-summary-section md:w-[58%] lg:w-[68%] bg-white dark:bg-[#3C3D37] overflow-x-auto p-6 space-y-4 rounded-lg border border-[rgba(186,199,213,0.20)]">
          <div className="account-card-container">
            <AccountStatsCard
              title="Total Invoice Created"
              className="account-card"
              balance={Number(receipt_statistics?.total_receipt || 0)}
              percentage={
                Number(
                  Number(receipt_statistics?.percentage_change_total).toFixed(2)
                ) || 0
              }
              trendDirection={
                Number(receipt_statistics?.percentage_change_total) >= 0
                  ? "up"
                  : "down"
              }
              variant="greenIncoming"
              forBranch
            />
            <AccountStatsCard
              title="Total Paid Invoice"
               className="account-card"
              balance={Number(receipt_statistics?.total_paid_receipt || 0)}
              percentage={
                Number(
                  Number(receipt_statistics?.percentage_change_paid).toFixed(2)
                ) || 0
              }
              trendDirection={
                Number(receipt_statistics?.percentage_change_paid) >= 0
                  ? "up"
                  : "down"
              }
              variant="redOutgoing"
              forBranch
            />
            <AccountStatsCard
              title="Total Pending Invoice"
               className="account-card"
              balance={Number(receipt_statistics?.total_pending_receipt) || 0}
              percentage={
                Number(
                  Number(receipt_statistics?.percentage_change_pending).toFixed(
                    2
                  )
                ) || 0
              }
              trendDirection={
                Number(receipt_statistics?.percentage_change_pending) >= 0
                  ? "up"
                  : "down"
              }
              variant="blueIncoming"
              forBranch
            />
          </div>
        </div>
        <div className="branch-wallet-card md:flex-1 space-y-7">
          <Link
            href={"/wallet"}
            className="max-w-full flex items-center justify-between flex-wrap gap-2"
          >
            <h1 className="text-[14px] font-medium">Branch Wallet</h1>
            <p className="text-xs text-text-label">
              ID: {branch_wallet?.wallet_id}
            </p>
          </Link>
          <BranchBalanceCard
            mainBalance={Number(branch_wallet?.balance_total)}
            cautionDeposit={Number(branch_wallet?.escrow_balance)}
            className="max-w-full"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-x-8 gap-y-4 lg:items-start">
        <div className="branch-summary-card overflow-x-auto flex lg:w-[68%] md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar">
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

        <NotificationCard
          sectionHeader="Staffs"
          seeAllLink={`/management/staff-branch/${branchId}/branch-staff`}
          notifications={branchData.staffs}
          branchId={branchId}
          className="md:flex-1 lg:h-[380px] staff-summary-card"
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-x-8 gap-y-4 items-start">
        <DashboardChart
          chartTitle="Wallet Analysis"
          visibleRange
          className="wallet-analysis-card hidden md:block md:w-full lg:w-[68%]"
          chartConfig={branchIdChartConfig}
          chartData={walletChartData}
        />

        <BranchActivitiesCard
          className="branch-activities-card lg:flex-1 w-full"
          branchId={Number(branchId) ?? 0}
        />
      </div>
      <div className="recent-transactions-section custom-flex-col gap-10">
        <div className="flex justify-between">
          <h2 className="text-text-primary dark:text-white text-xl font-medium">
            Recent Transaction
          </h2>
          <Link
            href={`/management/staff-branch/${branchId}/transactions`}
            className="flex items-center gap-1"
          >
            <span className="text-text-label dark:text-darkText-1">
              See all
            </span>
            <ChevronRight color="#5A5D61" size={16} />
          </Link>
        </div>
        <CustomTable
          fields={walletTableFields}
          data={transformedWalletTableData ?? []}
          className="max-h-[unset]"
          tableBodyCellSx={{
            paddingTop: "12px",
            paddingBottom: "12px",
            fontSize: "16px",
            whiteSpace: "nowrap",
          }}
          tableHeadCellSx={{
            paddingTop: "14px",
            paddingBottom: "14px",
            fontSize: "16px",
          }}
        />
        {transformedWalletTableData?.length === 0 && (
          <div className="flex items-center justify-center w-full h-20">
            <p className="text-text-label dark:text-darkText-1 text-base font-medium">
              No Recent Transaction
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchDashboard;
