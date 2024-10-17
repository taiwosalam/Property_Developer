"use client";
import PageTitle from "@/components/PageTitle/page-title";
import CustomTable from "@/components/Table/table";
import Pagination from "@/components/Pagination/pagination";
import type { Field } from "@/components/Table/types";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authstrore";
import {
  calendarsrFilterOptionsWithDropdown,
  getAllEventsOnCalendar,
} from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";

const CalendarPage = () => {
  const access_token = useAuthStore((state) => state.access_token);
  const fields: Field[] = [
    { id: "1", label: "Date & Time", accessor: "date" },
    { id: "2", label: "Event", accessor: "event" },
    { id: "3", label: "creator", accessor: "creator" },
    { id: "4", label: "property name", accessor: "property_name" },
    { id: "5", label: "branch", accessor: "branch" },
    { id: "6", label: "account officer", accessor: "account_officer" },
  ];

  const [fetchedTabelData, setFetchedTableData] = useState([]);

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: (index + 1).toString(),
      date: `28/01/2024 (0${index + 1}:30 pm)`,
      event: `EVENT ${index + 1}`,
      creator: `CREATOR ${index + 1}`,
      property_name: `PROPERTY ${index + 1}`,
      branch: `BRANCH ${index + 1}`,
      account_officer: `OFFICER ${index + 1}`,
    }));
  };

  const tableData = generateTableData(10);

  useEffect(() => {
    getAllEventsOnCalendar(access_token).then((response) => {
      if (response.success) {
        setFetchedTableData(response.data);
        console.log(response.data, "fetched data");
      }
    });
  }, [access_token]);

  return (
    <div className="space-y-9">
      <FilterBar
        azFilter
        onStateSelect={() => {}}
        pageTitle="Calendar"
        aboutPageModalData={{
          title: "Calendar",
          description: "This page contains a list of Calendar on the platform.",
        }}
        searchInputPlaceholder="Search"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptions={[]}
        filterWithOptionsWithDropdown={calendarsrFilterOptionsWithDropdown}
        hasGridListToggle={false}
      />
      <div className="page-title-container">
        <PageTitle title="up coming events" />
        <p className="text-text-label text-sm md:text-base font-medium">
          25TH - 28TH JAN 2024
        </p>
      </div>
      <CustomTable
        fields={fields}
        data={tableData}
        tableHeadClassName="bg-brand-9 h-[45px]"
        tableHeadCellSx={{
          color: "#EFF6FF",
          fontWeight: 500,
          border: "none",
          textAlign: "left",
          fontSize: "14px",
        }}
        tableBodyCellSx={{
          border: "none",
          textAlign: "left",
          fontWeight: 500,
          color: "#050901",
          fontSize: "14px",
          textTransform: "uppercase",
        }}
        evenRowColor="#fff"
        oddRowColor="#FAFAFA"
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default CalendarPage;
