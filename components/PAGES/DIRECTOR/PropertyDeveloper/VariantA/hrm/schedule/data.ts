export interface Shift {
    type: string; // e.g., "Morning", "Afternoon", "Night Off"
    slot: string | null; // e.g., "M1", null for off statuses
    start: string | null; // e.g., "06:00", null for off
    end: string | null; // e.g., "10:00", null for off
}

export type Schedules = Record<string, Shift[]>; // Key: date "YYYY-MM-DD", Value: array of shifts

export interface Staff {
    id: string;
    name: string;
    position: string;
    photo: string;
    schedules: Schedules;
}


export interface WeekViewProps {
    staffList: Staff[];
    fromDate: Date;
    onEditShift: (staffId: string, date: string, shift: Shift) => void;
}

export interface StaffRowProps {
    staff: Staff;
    fromDate: Date;
    onEditShift: (staffId: string, date: string, shift: Shift) => void;
}

export interface DayCellProps {
    date: Date;
    shifts: Shift[];
    onEditShift: (staffId: string, date: string, shift: Shift) => void;
    staffId: string;
}

export interface ShiftBadgeProps {
    shift: Shift;
    onEdit: (shift: Shift) => void;
}

export const staffData: Staff[] = Array.from({ length: 7 }, (_, i) => ({
    id: `${i + 1}`,
    name: "Ajadi Ologuneru",
    position: "Job Position",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b2e8cc13?w=100&h=100&fit=crop&crop=face",
    schedules: {
        "2024-02-26": i === 0 ? [{ type: "Night Off", slot: null, start: "06:00 AM", end: "12:00PM" }] :
            i === 1 ? [
                { type: "Morning Shift", slot: "M1", start: "06:00 AM", end: "12:00PM" },
                { type: "Afternoon Shift", slot: "A1", start: "12:00 PM", end: "06:00PM" }
            ] :
                [{ type: "Night Off", slot: null, start: "06:00 AM", end: "12:00PM" }],
        "2024-02-27": i === 0 ? [{ type: "Night Off", slot: null, start: "06:00 AM", end: "12:00PM" }] :
            i === 2 ? [
                { type: "Morning Shift", slot: "M1", start: "06:00 AM", end: "12:00PM" },
                { type: "Evening Shift", slot: "E1", start: "06:00 PM", end: "12:00AM" },
                { type: "Night Shift", slot: "N1", start: "12:00 AM", end: "06:00AM" }
            ] :
                [{ type: "Morning Shift", slot: "M1", start: "06:00 AM", end: "12:00PM" }],
        "2024-02-28": i === 0 ? [{ type: "Afternoon Shift", slot: "A1", start: "06:00 AM", end: "12:00PM" }] :
            [{ type: "Afternoon Shift", slot: "A1", start: "06:00 AM", end: "12:00PM" }],
        "2024-02-29": i === 0 ? [{ type: "Night Off", slot: null, start: "06:00 AM", end: "12:00PM" }] :
            [{ type: "Night Off", slot: null, start: "06:00 AM", end: "12:00PM" }],
        "2024-03-01": [{ type: "Afternoon Shift", slot: "A1", start: "06:00 AM", end: "12:00PM" }],
        "2024-03-02": [{ type: "Afternoon Shift", slot: "A1", start: "06:00 AM", end: "12:00PM" }],
    } as Schedules
}));

export const handleEditShift = (staffId: string, date: string, shift: Shift) => {
    console.log(`Edit ${staffId}, ${date}, ${JSON.stringify(shift)}`);
};

export const fromDate = new Date("2024-02-26");