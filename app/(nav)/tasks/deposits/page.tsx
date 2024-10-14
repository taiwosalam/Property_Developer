"use client";

import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import DepositRequestCard from "@/components/tasks/CallBack/RequestCard";
import { type DepositRequestCardProps } from "@/components/tasks/CallBack/types";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { DepositRequestData, depositRequestOptionsWithDropdown, type DepositRequestDataType } from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";

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
  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Requests"
          newData={657}
          total={34}
        />
        <ManagementStatistcsCard title="Completed" newData={657} total={34} />
        <ManagementStatistcsCard title="Pending" newData={657} total={34} />
      </div>
      <FilterBar azFilter onStateSelect={() => { }} pageTitle="Caution Deposit Request" aboutPageModalData={
        { title: "Caution Deposit Request", description: "This page contains a list of Caution Deposit Request on the platform." }
      } searchInputPlaceholder="Search" handleFilterApply={() => { }} isDateTrue filterOptions={[]} filterWithOptionsWithDropdown={depositRequestOptionsWithDropdown} />
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
