"use client";

import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import useWindowWidth from "@/hooks/useWindowWidth";
import PageTitle from "@/components/PageTitle/page-title";
import FilterButton from "@/components/FilterButton/filter-button";
import SearchInput from "@/components/SearchInput/search-input";
import DepositRequestCard from "@/components/tasks/CallBack/RequestCard";
import { type DepositRequestCardProps } from "@/components/tasks/CallBack/types";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { DepositRequestData, type DepositRequestDataType } from "./data";

const transformToDepositRequestCardProps = (
  data: DepositRequestDataType
): DepositRequestCardProps => {
  return {
    cardType: "deposit",
    cardViewDetails: [
      { label: "Property Name", accessor: "propertyName" },
      { label: "Location (State)", accessor: "state" },
      { label: "Unit Details", accessor: "unitDetails" },
      { label: "Amount", accessor: "amount" },
      { label: "Branch", accessor: "branch" },
    ],
    ...data,
  };
};

const DepositRequest = () => {
  const { isSmallTablet } = useWindowWidth();
  return (
    <div className="space-y-9">
      {!isSmallTablet && (
        <AutoResizingGrid minWidth={245} containerClassName="w-full">
          <ManagementStatistcsCard
            title="Total Requests"
            newData={657}
            total={34}
          />
          <ManagementStatistcsCard title="Completed" newData={657} total={34} />
          <ManagementStatistcsCard title="Pending" newData={657} total={34} />
        </AutoResizingGrid>
      )}
      <div className="page-title-container">
        <PageTitle title="Caution Deposits Request" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search" />
          <FilterButton />
        </div>
      </div>
      <AutoResizingGrid gap={28} minWidth={400}>
        {DepositRequestData.map((details, index) => (
          <DepositRequestCard
            key={index}
            {...transformToDepositRequestCardProps(details)}
          />
        ))}
      </AutoResizingGrid>
    </div>
  );
};

export default DepositRequest;
