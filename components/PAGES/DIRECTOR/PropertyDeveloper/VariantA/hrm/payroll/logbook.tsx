import React, { useState, useMemo, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Type definitions
type AttendanceStatus = "AT" | "AB" | "UC" | "--";

interface AttendanceRecord {
  date: string; // ISO date string for better serialization
  status: AttendanceStatus;
}

interface Staff {
  id: string;
  name: string;
  position: string;
  avatar: string;
  attendance: AttendanceRecord[];
}

interface StaffAttendanceSystemProps {
  staffList?: Staff[];
  currentDate?: Date;
  onAttendanceUpdate?: (
    staffId: string,
    date: string,
    status: AttendanceStatus
  ) => void;
  onMonthChange?: (date: Date) => void;
}

// Constants
const ATTENDANCE_STATUS = {
  AT: {
    label: "Attended",
    color: "bg-emerald-500",
    bgColor: "bg-emerald-50",
    text: "AT",
  },
  AB: { label: "Absents", color: "bg-purple-500", bgColor: "bg-purple-50" },
  UC: { label: "Upcoming", color: "bg-gray-400", bgColor: "bg-gray-50" },
  "--": {
    label: "Duty Off",
    color: "bg-white border border-gray-300",
    bgColor: "bg-white",
  },
} as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

// Utility functions
const formatDateKey = (date: Date): string => date.toISOString().split("T")[0];
const getDaysInMonth = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getDateFromDay = (year: number, month: number, day: number): Date =>
  new Date(year, month, day);

const generateMockStaff = (): Staff[] => {
  const names = [
    "Ajadi Ologuneru",
    "Folake Adeleke",
    "Kunle Adeyemi",
    "Blessing Okafor",
    "David Oyewole",
    "Amina Hassan",
    "Samuel Okoro",
  ];

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed

  return Array.from({ length: 7 }, (_, index) => {
    const attendance: AttendanceRecord[] = [];
    const startDate = new Date(2025, 7, 1); // August 2025
    const daysInMonth = getDaysInMonth(startDate);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(2025, 7, day);
      const date = formatDateKey(dateObj);
      const rand = Math.random();
      let status: AttendanceStatus;

      // Mark future days dynamically
      if (
        dateObj > today &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
      ) {
        status = "--";
      } else if (rand > 0.85) status = "AB";
      else if (rand > 0.75) status = "UC";
      else status = "AT";

      attendance.push({ date, status });
    }

    return {
      id: `staff-${index + 1}`,
      name: names[index] || `Staff Member ${index + 1}`,
      position: "Job Position",
      avatar: `https://images.unsplash.com/photo-${
        1500000000000 + index * 1000000
      }?w=40&h=40&fit=crop&crop=face`,
      attendance,
    };
  });
};

// Components
const AttendanceLegend: React.FC = () => (
  <div className="flex items-center  gap-6 text-sm">
    {Object.entries(ATTENDANCE_STATUS).map(([key, config]) => (
      <div key={key} className={`flex  items-center gap-2`}>
        <div className={`p-2 rounded ${config.color} text-white`}>{key}</div>
        <span className="text-gray-900">{config.label}</span>
      </div>
    ))}
  </div>
);

const MonthNavigator: React.FC<{
  currentMonth: Date;
  onPrevious: () => void;
  onNext: () => void;
}> = ({ currentMonth, onPrevious, onNext }) => (
  <div className="flex items-center gap-4">
    <button
      onClick={onPrevious}
      className="p-1 rounded hover:bg-gray-100 transition-colors"
      aria-label="Previous month"
    >
      <ChevronLeft className="w-5 h-5 text-gray-600" />
    </button>
    <h2 className="text-lg font-semibold text-gray-900 min-w-[140px] text-center">
      {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
    </h2>
    <button
      onClick={onNext}
      className="p-1 rounded hover:bg-gray-100 transition-colors"
      aria-label="Next month"
    >
      <ChevronRight className="w-5 h-5 text-gray-600" />
    </button>
  </div>
);

const AttendanceCell: React.FC<{
  status: AttendanceStatus;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ status, onClick, disabled = false }) => {
  const config = ATTENDANCE_STATUS[status];

  return (
    <div className="flex justify-center p-1">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-7 h-6 rounded text-xs font-medium transition-all duration-150
          ${status === "AT" ? "bg-emerald-500 text-white" : ""}
          ${status === "AB" ? "bg-purple-500 text-white" : ""}
          ${status === "UC" ? "bg-gray-400 text-white" : ""}
          ${
            status === "--"
              ? "bg-white border border-gray-200 text-gray-400"
              : ""
          }
          ${
            !disabled
              ? "hover:scale-105 hover:shadow-sm cursor-pointer"
              : "cursor-default opacity-60"
          }
        `}
        title={`${config.label} - Click to change`}
      >
        {status}
      </button>
    </div>
  );
};

export const StaffRow: React.FC<{
  staff: Staff;
  currentMonth: Date;
  daysInMonth: number;
  onAttendanceUpdate?: (date: string, status: AttendanceStatus) => void;
}> = ({ staff, currentMonth, daysInMonth, onAttendanceUpdate }) => {
  // Calculate worked days for current month
  const workedDays = useMemo(() => {
    const monthKey = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, "0")}`;
    return staff.attendance.filter(
      (record) => record.date.startsWith(monthKey) && record.status === "AT"
    ).length;
  }, [staff.attendance, currentMonth]);

  // Get attendance for specific day
  const getAttendanceForDay = (day: number): AttendanceStatus => {
    const dateKey = formatDateKey(
      getDateFromDay(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    );
    const record = staff.attendance.find((r) => r.date === dateKey);
    return record?.status || "--";
  };

  // Handle status cycling
  const handleStatusChange = (day: number) => {
    if (!onAttendanceUpdate) return;

    const dateKey = formatDateKey(
      getDateFromDay(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    );
    const currentStatus = getAttendanceForDay(day);
    const statusOrder: AttendanceStatus[] = ["AT", "AB", "UC", "--"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    onAttendanceUpdate(dateKey, nextStatus);
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      {/* Staff Info */}
      <td className="p-4 w-64">
        <div className="flex items-center gap-3">
          <Image
            height={40}
            width={40}
            src={staff.avatar}
            alt={staff.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                staff.name
              )}&size=40&background=random`;
            }}
          />
          <div>
            <div className="font-medium text-gray-900 text-sm">
              {staff.name}
            </div>
            <div className="text-xs text-gray-500">{staff.position}</div>
          </div>
        </div>
      </td>

      {/* Worked Days */}
      <td className="p-4 text-center">
        <div className="font-medium text-gray-900">{workedDays} Days</div>
      </td>

      {/* Daily Attendance */}
      {Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;
        const status = getAttendanceForDay(day);
        const isDisabled =
          day > new Date().getDate() &&
          currentMonth.getMonth() === new Date().getMonth();

        return (
          <td key={day} className="p-1 text-center border-l border-gray-100">
            <AttendanceCell
              status={status}
              onClick={() => handleStatusChange(day)}
              disabled={isDisabled}
            />
          </td>
        );
      })}
    </tr>
  );
};

const StaffAttendanceSystem: React.FC<StaffAttendanceSystemProps> = ({
  staffList: initialStaffList,
  currentDate = new Date(2025, 7, 1), // August 2025
  onAttendanceUpdate,
  onMonthChange,
}) => {
  const [currentMonth, setCurrentMonth] = useState(currentDate);
  const [staffList, setStaffList] = useState<Staff[]>(
    () => initialStaffList || generateMockStaff()
  );

  const daysInMonth = useMemo(
    () => getDaysInMonth(currentMonth),
    [currentMonth]
  );

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handlePreviousMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    handleMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    handleMonthChange(newMonth);
  };

  const handleAttendanceUpdate =
    (staffId: string) => (date: string, status: AttendanceStatus) => {
      setStaffList((prevList) =>
        prevList.map((staff) => {
          if (staff.id !== staffId) return staff;

          return {
            ...staff,
            attendance: staff.attendance.some((record) => record.date === date)
              ? staff.attendance.map((record) =>
                  record.date === date ? { ...record, status } : record
                )
              : [...staff.attendance, { date, status }],
          };
        })
      );

      onAttendanceUpdate?.(staffId, date, status);
    };

  // Generate day headers
  const dayHeaders = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      return String(day).padStart(2, "0");
    });
  }, [daysInMonth]);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <MonthNavigator
          currentMonth={currentMonth}
          onPrevious={handlePreviousMonth}
          onNext={handleNextMonth}
        />
        <AttendanceLegend />
      </div>

      {/* Attendance Table */}
      <div className="relative">
        {/* Sticky Headers */}
        <div className="flex">
          {/* Sticky Left Columns */}
          <div className="sticky left-0 z-20 bg-white shadow-lg">
            <table>
              <thead>
                <tr className="bg-brand-9 text-white">
                  <th className="text-left p-4 font-medium w-64 border-r border-blue-400">
                    Staff Name
                  </th>
                  <th className="text-center p-4 font-medium w-24 border-r border-blue-600">
                    Worked
                  </th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => {
                  const workedDays = () => {
                    const monthKey = `${currentMonth.getFullYear()}-${String(
                      currentMonth.getMonth() + 1
                    ).padStart(2, "0")}`;
                    return staff.attendance.filter(
                      (record) =>
                        record.date.startsWith(monthKey) &&
                        record.status === "AT"
                    ).length;
                  };

                  return (
                    <tr
                      key={staff.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4 w-64 border-r border-gray-200">
                        <div className="flex items-center gap-3">
                          <Image
                            height={40}
                            width={40}
                            src={staff.avatar}
                            alt={staff.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                staff.name
                              )}&size=40&background=random`;
                            }}
                          />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {staff.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {staff.position}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center w-24 border-r border-gray-200">
                        <div className="font-medium text-gray-900">
                          {workedDays()} Days
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Scrollable Days Section */}
          <div className="flex-1 no-scrollbar overflow-x-auto">
            <table>
              <thead>
                <tr className="bg-brand-9 h-[45px] text-white">
                  {dayHeaders.map((day, index) => (
                    <th
                      key={index}
                      className="text-center p-2 font-medium min-w-[40px] border-l border-brand-9"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr
                    key={staff.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    {Array.from({ length: daysInMonth }, (_, index) => {
                      const day = index + 1;
                      const dateKey = formatDateKey(
                        getDateFromDay(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          day
                        )
                      );
                      const record = staff.attendance.find(
                        (r) => r.date === dateKey
                      );
                      const status = record?.status || "--";
                      const isDisabled =
                        day > new Date().getDate() &&
                        currentMonth.getMonth() === new Date().getMonth();

                      const handleStatusChange = () => {
                        if (isDisabled) return;
                        const statusOrder: AttendanceStatus[] = [
                          "AT",
                          "AB",
                          "UC",
                          "--",
                        ];
                        const currentIndex = statusOrder.indexOf(status);
                        const nextStatus =
                          statusOrder[(currentIndex + 1) % statusOrder.length];
                        handleAttendanceUpdate(staff.id)(dateKey, nextStatus);
                      };

                      return (
                        <td
                          key={day}
                          className="p-5 text-center border-l border-gray-100"
                        >
                          <div className="flex justify-center p-1">
                            <button
                              onClick={handleStatusChange}
                              disabled={isDisabled}
                              className={`
                                w-7 h-6 rounded text-xs font-medium transition-all duration-150
                                ${
                                  status === "AT"
                                    ? "bg-emerald-500 text-white"
                                    : ""
                                }
                                ${
                                  status === "AB"
                                    ? "bg-purple-500 text-white"
                                    : ""
                                }
                                ${
                                  status === "UC"
                                    ? "bg-gray-400 text-white"
                                    : ""
                                }
                                ${
                                  status === "--"
                                    ? "bg-white border border-gray-200 text-gray-400"
                                    : ""
                                }
                                ${
                                  !isDisabled
                                    ? "hover:scale-105 hover:shadow-sm cursor-pointer"
                                    : "cursor-default opacity-60"
                                }
                              `}
                              title={`${ATTENDANCE_STATUS[status].label} - Click to change`}
                            >
                              {status}
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendanceSystem;
