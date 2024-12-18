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
import { SingleBranchResponseType } from "./types";
import { DateRange } from "react-day-picker";
import BackButton from "@/components/BackButton/back-button";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import { transformSingleBranchAPIResponse } from "./data";
import NetworkError from "@/components/Error/NetworkError";

const BranchDashboard = ({ params }: { params: { branchId: string } }) => {
  const { branchId } = params;

  const { data, error, loading, isNetworkError } =
    useFetch<SingleBranchResponseType>(`branch/${branchId}`);

  const branchData = data ? transformSingleBranchAPIResponse(data) : null;

  const branchAddress = `${branchData?.branch_address}, ${branchData?.city}, ${branchData?.local_government}, ${branchData?.state}`;

  const [timeRange, setTimeRange] = useState("30d");
  // const [highestMetric, setHighestMetric] = useState<string | null>(null);
  // const [primaryColor, setPrimaryColor] = useState<string | null>(null);

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
            <p className="text-sm font-medium">{branchAddress}</p>
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
              <CreateStaffModal branchId={branchId} />
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
          <div className="ml-auto flex w-[390px] max-w-full px-4 bg-[#F5F5F5] dark:bg-darkText-primary rounded-md items-center justify-end">
            <DatePickerWithRange
              selectedRange={selectedDateRange}
              onDateChange={handleDateChange}
            />
            <Select value={timeRange} onValueChange={handleSelectChange}>
              <SelectTrigger
                className="md:w-full lg:w-[120px] rounded-lg sm:ml-auto dark:text-whie dark:bg-[#020617]"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
                <SelectItem value="1d" className="rounded-lg">
                  Yesterday
                </SelectItem>
                <SelectItem value="custom" className="rounded-lg">
                  Custom
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AutoResizingGrid gap={12} minWidth={215}>
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
            <p className="text-xs text-text-label">ID: 2324354678</p>
          </Link>
          <BranchBalanceCard
            mainBalance={walletBalanceCardData.mainBalance}
            cautionDeposit={walletBalanceCardData.cautionDeposit}
            className="max-w-full"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-x-8 gap-y-4 lg:items-start">
        <div className="overflow-x-auto flex lg:w-[68%] md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar">
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
        <BranchActivitiesCard className="lg:flex-1" />
      </div>
      <div className="flex flex-col lg:flex-row gap-x-8 gap-y-4 items-start">
        <DashboardChart
          chartTitle="Reports"
          visibleRange={false}
          className="hidden md:block md:w-full lg:w-[68%]"
          chartConfig={branchIdChartConfig}
          chartData={branchIdChartData}
        />
        <NotificationCard
          sectionHeader="Staffs"
          seeAllLink={`/management/staff-branch/${branchId}/branch-staff`}
          // notifications={fetchedBranchData?.staff || []}
          notifications={[]}
          branchId={branchId}
          className="md:flex-1 lg:h-[380px]"
        />
      </div>
      <BranchPropertiesSection branchId={branchId} />
    </div>
  );
};

export default BranchDashboard;
