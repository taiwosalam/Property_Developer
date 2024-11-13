"use client";
import PageTitle from "@/components/PageTitle/page-title";
import CustomTable from "@/components/Table/table";
import Pagination from "@/components/Pagination/pagination";
import { useEffect, useState } from "react";
import {
  calendarsrFilterOptionsWithDropdown,
  getAllEventsOnCalendar,
  CalendarTableFields,
} from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CalendarComponent from "@/components/Calendar/calendar";

const CalendarPage = () => {
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
    getAllEventsOnCalendar();
  }, []);

  return (
    <div className="space-y-9">
      <div className="custom-flex-col gap-8">
        <FilterBar
          azFilter
          onStateSelect={() => {}}
          pageTitle="Calendar"
          aboutPageModalData={{
            title: "Calendar",
            description:
              "This page contains a list of Calendar on the platform.",
          }}
          searchInputPlaceholder="Search"
          handleFilterApply={() => {}}
          isDateTrue
          filterOptions={[]}
          filterWithOptionsWithDropdown={calendarsrFilterOptionsWithDropdown}
          hasGridListToggle={false}
        />
        <CalendarComponent />
      </div>
      <div className="page-title-container">
        <PageTitle title="up coming events" />
        <p className="text-text-label dark:text-darkText-1 text-sm md:text-base font-medium">
          25TH - 28TH JAN 2024
        </p>
      </div>
      <CustomTable
        fields={CalendarTableFields}
        data={tableData}
        tableHeadClassName="h-[45px]"
        tableBodyCellSx={{
          textTransform: "uppercase",
        }}
      />
      <Pagination totalPages={2} currentPage={2} onPageChange={() => {}} />
    </div>
  );
};

export default CalendarPage;
