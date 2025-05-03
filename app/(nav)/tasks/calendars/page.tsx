"use client";
import PageTitle from "@/components/PageTitle/page-title";
import CustomTable from "@/components/Table/table";
import Pagination from "@/components/Pagination/pagination";
import { useEffect, useState } from "react";
import {
  calendarsrFilterOptionsWithDropdown,
  getAllEventsOnCalendar,
  CalendarTableFields,
  ICalendarEventsTable,
  transformEventTable,
  transformCalendarEvents,
} from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CalendarComponent from "@/components/Calendar/calendar";
import useFetch from "@/hooks/useFetch";
import { CalendarEventsApiResponse } from "./types";
import { AxiosRequestConfig } from "axios";
import { LandlordRequestParams } from "../../management/landlord/data";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import CardsLoading from "@/components/Loader/CardsLoading";
import { CalendarEventProps } from "@/components/Calendar/types";


const CalendarPage = () => {
  const [fetchedTabelData, setFetchedTableData] = useState([]);
  const [eventTable, setEventTable] = useState<ICalendarEventsTable | null>(
    null
  );
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventProps[]>([]);
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as LandlordRequestParams,
  });
  const {
    data: calendarEventApiResponse,
    loading,
    error,
    isNetworkError,
  } = useFetch<CalendarEventsApiResponse>("/company/calender", config);

  useEffect(() => {
    if (calendarEventApiResponse) {
      const eventsTable = transformEventTable(calendarEventApiResponse);
      setEventTable(eventsTable);

      const events = transformCalendarEvents(calendarEventApiResponse);
      setCalendarEvents(events);
    }
  }, [calendarEventApiResponse, config]);

  useEffect(() => {
    getAllEventsOnCalendar();
  }, []);

  
  const handlePageChange = (page: number) => {
    setConfig({
      params: { ...config.params, page },
    });
  };

  if(loading) return <CardsLoading />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div className="custom-flex-col gap-8">
        <FilterBar
          azFilter
          pageTitle="Calendar"
          aboutPageModalData={{
            title: "Calendar",
            description:
              "This page contains a list of Calendar on the platform.",
          }}
          searchInputPlaceholder="Search"
          handleFilterApply={() => {}}
          isDateTrue
          filterOptionsMenu={calendarsrFilterOptionsWithDropdown}
          hasGridListToggle={false}
        />
        <CalendarComponent events={calendarEvents}/>
      </div>
      <div className="page-title-container">
        <PageTitle title="up coming events" />
        <p className="text-text-label dark:text-darkText-1 text-sm md:text-base font-medium">
          25TH - 28TH JAN 2024
        </p>
      </div>
      <CustomTable
        fields={CalendarTableFields}
        data={eventTable?.table || []}
        tableHeadClassName="h-[45px]"
        tableBodyCellSx={{
          textTransform: "capitalize",
        }}
      />
      <Pagination
        totalPages={eventTable?.total_pages || 0}
        currentPage={eventTable?.current_page || 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CalendarPage;
