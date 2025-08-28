"use client";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
// import {
//   reportsListingsFilterOptionsWithDropdown,
//   trackingTableFields,
// } from "./data";
// import {
//   ActivityApiResponse,
//   ActivityTable,
//   transformActivityAData,
// } from "./[userId]/types";
import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { ReportsRequestParams } from "../tenants/data";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import ServerError from "@/components/Error/ServerError";
import useAddressFromCoords from "@/hooks/useGeoCoding";
import { useGlobalStore } from "@/store/general-store";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "@/utils/debounce";
import { Activity } from "lucide-react";
import { LandlordRequestParams } from "../../management/landlord/data";
import { ICalendarEventsTable, transformEventTable } from "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/tasks/calendar/data";
import { CalendarEventsApiResponse } from "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/tasks/calendar/types";
import { CalendarTableFields } from "../../tasks/calendars/data";

const CalendarEventRecord = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("b");

  const [eventTable, setEventTable] = useState<ICalendarEventsTable | null>(
    null
  );
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
    }
  }, [calendarEventApiResponse, config]);

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Calendar Event" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <FilterBar
        exports
        isDateTrue
        onBack={search ? true : false}
        pageTitle="Calendar Events"
        aboutPageModalData={{
          title: "Calendar Events",
          description: "This page contains all calendar events",
        }}
        searchInputPlaceholder="Search for calendar events"
        handleFilterApply={() => { }}
        //={() => {}}
        onSort={() => { }}
        handleSearch={() => { }}
        //filterOptionsMenu={() => {}}
        hasGridListToggle={false}
        exportHref="/reports/calendar-event/export"
        xlsxData={eventTable?.table.map((activity) => ({
          ...activity,
        }))}
        fileLabel={"Calendar Event Reports"}
      />
      <section>
        {eventTable && eventTable?.table.length === 0 && !loading ? (
          !!config.params.search ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="  No Events Available Yet"
              body={
                <p>
                  You don&apos;t have any event records at the moment. The
                  calendar helps you stay organized by managing your schedule,
                  setting reminders, and tracking all your activities
                  efficiently. Once events are added, they will appear here
                  automatically.
                </p>
              }
            />
          )
        ) : (
          <CustomTable
            fields={CalendarTableFields}
            data={eventTable?.table || []}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
    </div>
  );
};

export default CalendarEventRecord;
