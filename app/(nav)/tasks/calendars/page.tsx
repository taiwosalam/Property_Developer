"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useModule } from "@/contexts/moduleContext";
import { useRole } from "@/hooks/roleContext";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { AnimatePresence, motion } from "framer-motion";

const PropertyManagerCalendarVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/variantA/tasks/calendar/calendarPage"
    ),
  { ssr: false }
);

const PropertyManagerCalendarVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantB/tasks/calendar/calendarPage"
    ),
  { ssr: false }
);

const PropertyManagerCalendarVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyManager/VariantC/tasks/calendar/calendarPage"
    ),
  { ssr: false }
);

const PropertyDeveloperCalendarVariantA = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/tasks/calendar/calendarPage"
    ),
  { ssr: false }
);

const PropertyDeveloperCalendarVariantB = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantB/tasks/calendar/calendarPage"
    ),
  { ssr: false }
);

const PropertyDeveloperCalendarVariantC = dynamic(
  () =>
    import(
      "@/components/PAGES/DIRECTOR/PropertyDeveloper/VariantC/tasks/calendar/calendarPage"
    ),
  { ssr: false }
);

const DashboardPage = () => {
  const { activeModule, designVariant } = useModule();
  const { role } = useRole();

  if (role !== "director") {
    return (
      <div className="p-4 text-red-500">
        Access Denied: Director role required.
      </div>
    );
  }

  const DashboardComponent =
    {
      property_manager: {
        variant_a: PropertyManagerCalendarVariantA,
        variant_b: PropertyManagerCalendarVariantB,
        variant_c: PropertyManagerCalendarVariantC,
      },
      hospitality_manager: {
      },
      property_developer: {
        variant_a: PropertyDeveloperCalendarVariantA,
        variant_b: PropertyDeveloperCalendarVariantB,
        variant_c: PropertyDeveloperCalendarVariantC,
      },
    }[activeModule.id]?.[designVariant] || PropertyManagerCalendarVariantA;

  return (
    <Suspense fallback={<PageCircleLoader />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeModule.id}-${designVariant}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <DashboardComponent />
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

export default DashboardPage;



// "use client";
// import PageTitle from "@/components/PageTitle/page-title";
// import CustomTable from "@/components/Table/table";
// import Pagination from "@/components/Pagination/pagination";
// import { useEffect, useState } from "react";
// import {
//   calendarsrFilterOptionsWithDropdown,
//   getAllEventsOnCalendar,
//   CalendarTableFields,
//   ICalendarEventsTable,
//   transformEventTable,
//   transformCalendarEvents,
// } from "./data";
// import FilterBar from "@/components/FIlterBar/FilterBar";
// import CalendarComponent from "@/components/Calendar/calendar";
// import useFetch from "@/hooks/useFetch";
// import { CalendarEventsApiResponse } from "./types";
// import { AxiosRequestConfig } from "axios";
// import { LandlordRequestParams } from "../../management/landlord/data";
// import NetworkError from "@/components/Error/NetworkError";
// import ServerError from "@/components/Error/ServerError";
// import CardsLoading from "@/components/Loader/CardsLoading";
// import { CalendarEventProps } from "@/components/Calendar/types";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import Link from "next/link";
// import PageLoader from "next/dist/client/page-loader";
// import PageCircleLoader from "@/components/Loader/PageCircleLoader";
// import CalendarSkeletonLoader from "@/components/Loader/calendar-page-loader";

// const CalendarPage = () => {
//   const [fetchedTabelData, setFetchedTableData] = useState([]);
//   const [eventTable, setEventTable] = useState<ICalendarEventsTable | null>(
//     null
//   );
//   const [calendarEvents, setCalendarEvents] = useState<CalendarEventProps[]>(
//     []
//   );
//   const [config, setConfig] = useState<AxiosRequestConfig>({
//     params: {
//       page: 1,
//       search: "",
//     } as LandlordRequestParams,
//   });
//   const {
//     data: calendarEventApiResponse,
//     loading,
//     error,
//     isNetworkError,
//   } = useFetch<CalendarEventsApiResponse>("/company/calender", config);

//   useEffect(() => {
//     if (calendarEventApiResponse) {
//       const eventsTable = transformEventTable(calendarEventApiResponse);
//       setEventTable(eventsTable);

//       const events = transformCalendarEvents(calendarEventApiResponse);
//       setCalendarEvents(events);
//     }
//   }, [calendarEventApiResponse, config]);

//   useEffect(() => {
//     getAllEventsOnCalendar();
//   }, []);

//   const handlePageChange = (page: number) => {
//     setConfig({
//       params: { ...config.params, page },
//     });
//   };

//   if (loading) {
//     return <CalendarSkeletonLoader />;
//   }

//   if (isNetworkError) return <NetworkError />;
//   if (error) return <ServerError error={error} />;

//   return (
//     <div className="space-y-9">
//       <div className="custom-flex-col gap-8">
//         <PageTitle title="Calendar" />
//         <CalendarComponent events={calendarEvents} />
//       </div>
//       <div className="page-title-container">
//         <PageTitle title="up coming events" />
//         <Link
//           href={"/reports/calendar-event"}
//           className="text-text-label dark:text-darkText-1 text-sm md:text-base font-medium flex gap-2 items-center"
//         >
//           See all{" "}
//           <span>
//             <ChevronRight />{" "}
//           </span>
//         </Link>
//       </div>
//       <div className="scroll-m-8 pb-10" id="event">
//         <CustomTable
//           fields={CalendarTableFields}
//           data={eventTable?.table.slice(0, 3) || []}
//           tableHeadClassName="h-[45px]"
//           tableBodyCellSx={{
//             textTransform: "capitalize",
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default CalendarPage;
