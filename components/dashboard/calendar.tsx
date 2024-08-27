"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";

const DashboarddCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg shadow-md border w-full"
    />
  );
};

export default DashboarddCalendar;
