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
import { BranchStaff } from "../../(messages-reviews)/messages/types";
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
import { DomainFields, SponsorFields } from "../../settings/add-on/data";
import {
  CalendarTableFields,
  ICalendarEventsTable,
  transformEventTable,
} from "../../../../components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/tasks/calendar/data";
import { CalendarEventsApiResponse } from "../../../../components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/tasks/calendar/types";
import { LandlordRequestParams } from "../../management/landlord/data";

const CalendarEventRecord = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("b");
  const setCalendarEventStore = useGlobalStore((s) => s.setGlobalInfoStore);

  const [eventTable, setEventTable] = useState<ICalendarEventsTable | null>(
    null
  );
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as LandlordRequestParams,
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
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

  useEffect(() => {
    if (!loading && calendarEventApiResponse) {
      const transformedData = transformEventTable(calendarEventApiResponse);

      const events = transformedData.table;
      const currentTenants = useGlobalStore.getState().calendar_events;
      if (JSON.stringify(currentTenants) !== JSON.stringify(events)) {
        setEventTable(transformedData);
        setCalendarEventStore("calendar_events", events);
      }
    }
  }, [calendarEventApiResponse, loading, setCalendarEventStore]);

  const handleAppliedFilter = useCallback(
    debounce((filters: FilterResult) => {
      setAppliedFilters(filters);
      const { startDate, endDate } = filters;

      const queryParams: ReportsRequestParams = { page: 1, search: "" };
      if (startDate)
        queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
      if (endDate)
        queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
      setConfig({ params: queryParams });
    }, 300),
    []
  );

  const handleSearch = (query: string) => {
    setConfig({ params: { ...config.params, search: query } });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({ params: { ...config.params, sort_order: order } });
  };

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
        handleFilterApply={handleAppliedFilter}
        onSort={handleSort}
        handleSearch={handleSearch}
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
