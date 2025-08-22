// Imports
import { calendar_events } from "@/components/Calendar/events";
import { CalendarEventProps } from "@/components/Calendar/types";
import {
  format,
  addDays,
  getDate,
  getHours,
  endOfWeek,
  isSameDay,
  startOfWeek,
  parseISO,
} from "date-fns";

export const event_calendar_hours = [
  "12 AM",
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
];

export const getCurrentWeekData = (referenceDate = new Date()) => {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 0 });

  const weekDates = [];
  const dayNumbers = [];

  for (let i = 0; i <= 6; i++) {
    const currentDay = addDays(weekStart, i);
    weekDates.push(format(currentDay, "yyyy-MM-dd")); // Full date format for display
    dayNumbers.push(getDate(currentDay).toString().padStart(2, "0")); // Day number with leading zero
  }

  const title = `${format(weekStart, "dd MMM")} - ${format(weekEnd, "dd MMM")}`;

  return {
    weekDates, // Array of formatted dates (e.g., "2024-10-26")
    dayNumbers, // Array of day numbers (e.g., ["26", "27", "28", ...])
    title, // String title of the week (e.g., "26 Oct - 01 Nov")
  };
};

const mapHourTo24 = (hourString: string): number => {
  const [hour, period] = hourString.split(" ");
  let hourNumber = parseInt(hour, 10);

  if (period === "PM" && hourNumber !== 12) {
    hourNumber += 12; // Convert PM hours (except for 12 PM)
  }

  if (period === "AM" && hourNumber === 12) {
    hourNumber = 0; // Convert 12 AM to 0
  }

  return hourNumber; // Return hour in 24-hour format
};

export const filterEventsByDayAndHourRange = (
  targetDayString: string, // Expecting a date string
  targetHourString: string,
  events: CalendarEventProps[], // Hour string from event_calendar_hours
) => {
  // Parse the string into a Date object
  const targetDay = parseISO(targetDayString);
  const targetHour = mapHourTo24(targetHourString); // Convert hour string to 24-hour format

  const startHour = targetHour - 1; // Previous hour
  const endHour = targetHour; // The target hour itself

  return events.filter((event) => {
    const eventHour = getHours(event.date);

    return (
      isSameDay(event.date, targetDay) && // Ensure it's the same day
      eventHour === endHour && // Only include events in the target hour
      event.date.getMinutes() >= 0 &&
      event.date.getMinutes() <= 59 // Include all minutes
    );
  });
};
