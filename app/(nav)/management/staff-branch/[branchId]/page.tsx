"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Imports
import Card from "@/components/dashboard/card";
import Button from "@/components/Form/Button/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  dashboardCardData,
  walletBalanceCardData,
} from "@/app/(nav)/dashboard/data";
import NotificationCard from "@/components/dashboard/notification-card";
import { DashboardChart } from "@/components/dashboard/chart";
import { LocationIcon } from "@/public/icons/icons";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { branchIdChartConfig, branchIdChartData } from "./data";
import AccountStatsCard from "@/components/Accounting/account-stats-card";
import { DatePickerWithRange } from "@/components/dashboard/date-picker";
import BranchActivitiesCard from "@/components/Management/Staff-And-Branches/Branch/branch-activity-card";
import BranchBalanceCard from "@/components/Management/Staff-And-Branches/Branch/branch-balance-card";
import CreateStaffModal from "@/components/Management/Staff-And-Branches/create-staff-modal";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import BranchPropertiesSection from "@/components/Management/Staff-And-Branches/Branch/branch-properties-section";
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

const BranchDashboard = ({ params }: { params: { branchId: string } }) => {
  const { branchId } = params;
  const { branch, setBranch } = useBranchStore();
  const setWalletStore = useWalletStore((s) => s.setWalletStore);

  const { data, error, loading, isNetworkError, refetch } =
    useFetch<SingleBranchResponseType>(`branch/${branchId}`);
    useRefetchOnEvent("refetch_staff", () => refetch({ silent: true }));

  const branchData = data ? transformSingleBranchAPIResponse(data) : null;
  const { branch_wallet } = branchData || {};
  const yesNoToActiveInactive = (yesNo: string): boolean => {
    return yesNo === "Yes" ? true : false;
  };  

  setWalletStore("sub_wallet", {
    status: branch_wallet !== null ? "active" : "inactive",
    wallet_id: branch_wallet !== null ? Number(branchData?.branch_wallet?.wallet_id) : undefined,
    is_active: branch_wallet !== null && yesNoToActiveInactive(branchData?.branch_wallet?.is_active as string),
  });

  console.log("branch wallet", branchData)
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
        link = `/management/staff-branch/${branchId}/vacant-units`;
        break;
      case "Invoices":
        stats = branchData?.invoices;
        link = `/management/staff-branch/${branchId}/invoices`;
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


  // set branch data to store
  useEffect(() => {
    if (branch?.branch_name !== branchData?.branch_name) {
      setBranch("branch_name", branchData?.branch_name || "___");
      setBranch("address", branchData?.address || "___");
      setBranch("branch_id", branchId);
      setBranch("branch_picture", branchData?.picture || "___");
      setBranch("branch_details", branchData);
    }
  }, [branchData, branch, setBranch]);

  let isManagerAvailable = false;
  (branch?.branch_details as any)?.staffs?.map((staff: any) => {
    if (staff.position === "manager") {
      isManagerAvailable = true;
      setBranch("isManagerAvailable", isManagerAvailable);
    }
  });

  const [timeRange, setTimeRange] = useState("30d");
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

  const handleDateChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    if (range?.from && range?.to) {
      setTimeRange("custom");
    }
  };

  const handleSelectChange = (value: string) => {
    setTimeRange(value);
    if (value !== "custom") {
      const days =
        value === "90d" ? 90 : value === "30d" ? 30 : value === "7d" ? 7 : 1;
      setSelectedDateRange(calculateDateRange(days));
    }
  };

  // console.log("branch data", branchData);

  if (loading) return <CustomLoader layout="dasboard" />;

  if (isNetworkError) return <NetworkError />;

  if (error) return <div>{error}</div>;
  if (!branchData) return null;

  return (
    <div className="custom-flex-col gap-6">
      <div className="w-full gap-2 flex items-center justify-between flex-wrap">
        <BackButton reducePaddingTop as="div" className="items-start">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
            {branchData.branch_name}
          </h1>
          <div className="text-text-disabled flex items-center space-x-1">
            <LocationIcon />
            <p className="text-sm font-medium">{branchData.address}</p>
          </div>
        </BackButton>

        <div className="flex items-center justify-between gap-2 ml-auto flex-wrap">
          <Modal>
            <ModalTrigger asChild>
              <Button
                type="button"
                variant="border"
                className="page-header-button"
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
            className="page-header-button"
            href={`/management/staff-branch/${branchId}/edit-branch`}
          >
            Edit Branch
          </Button>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row md:justify-between gap-x-8 gap-y-4 md:items-start">
        <div className="md:w-[58%] lg:w-[68%] bg-white dark:bg-[#3C3D37] p-6 space-y-4 rounded-lg border border-[rgba(186,199,213,0.20)]">
          <AutoResizingGrid gap={12} minWidth={230}>
            <AccountStatsCard
              title="Total Receipts"
              balance={1234535}
              percentage={54}
              trendDirection="up"
              trendColor="green"
              variant="greenIncoming"
              forBranch
            />
            <AccountStatsCard
              title="Total Expenses"
              balance={1234535}
              percentage={54}
              trendDirection="up"
              trendColor="green"
              variant="redOutgoing"
              forBranch
            />
            <AccountStatsCard
              title="Total Balance"
              balance={1234535}
              percentage={54}
              trendDirection="up"
              trendColor="red"
              variant="blueIncoming"
              forBranch
            />
          </AutoResizingGrid>
        </div>
        <div className="md:flex-1 space-y-7">
          <Link
            href={"/wallet"}
            className="max-w-full flex items-center justify-between flex-wrap gap-2"
          >
            <h1 className="text-[14px] font-medium">Branch Wallet</h1>
            <p className="text-xs text-text-label">ID: {branch_wallet?.wallet_id}</p>
          </Link>
          <BranchBalanceCard
            mainBalance={Number(branch_wallet?.balance_total)}
            cautionDeposit={Number(branch_wallet?.escrow_balance)}
            className="max-w-full"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-x-8 gap-y-4 lg:items-start">
        <div className="overflow-x-auto flex lg:w-[68%] md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar">
          {updatedDashboardCardData.map((card, index) => (
            <Link
              href={card.link}
              key={index}
              prefetch={false}
            >
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
        <BranchActivitiesCard className="lg:flex-1" />
      </div>
      <div className="flex flex-col lg:flex-row gap-x-8 gap-y-4 items-start">
        <DashboardChart
          chartTitle="Reports"
          visibleRange
          className="hidden md:block md:w-full lg:w-[68%]"
          chartConfig={branchIdChartConfig}
          chartData={branchIdChartData}
        />
        <NotificationCard
          sectionHeader="Staffs"
          seeAllLink={`/management/staff-branch/${branchId}/branch-staff`}
          notifications={branchData.staffs}
          branchId={branchId}
          className="md:flex-1 lg:h-[380px]"
        />
      </div>
      {/* <BranchPropertiesSection branchId={branchId} /> */}
    </div>
  );
};

export default BranchDashboard;
