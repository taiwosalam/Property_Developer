import React, { useState, useMemo } from "react";
import Input from "./Form/Input/input";

// Staff type
interface Staff {
  id: number;
  name: string;
  position: string;
  avatar: string;
}

// Props type
interface StaffSelectionPanelProps {
  staffList: Staff[];
  selectedStaff: number[];
  onStaffSelect: (staffId: number) => void;
  onClose?: () => void;
  title?: string;
}

// Separate Staff Item for reusability
const StaffItem: React.FC<{
  staff: Staff;
  selected: boolean;
  onSelect: () => void;
}> = ({ staff, selected, onSelect }) => (
  <div className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
    <input
      type="checkbox"
      checked={selected}
      onChange={onSelect}
      className="form-checkbox"
    />
    <img src={staff.avatar} alt={staff.name} className="w-8 h-8 rounded-full" />
    <span className="truncate">
      {staff.name} - {staff.position}
    </span>
  </div>
);

const StaffSelectionPanel: React.FC<StaffSelectionPanelProps> = ({
  staffList,
  selectedStaff,
  onStaffSelect,
  onClose,
  title = "Select Staff",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter staff with useMemo for performance
  const filteredStaff = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return staffList.filter(
      (staff) =>
        staff.name.toLowerCase().includes(term) ||
        staff.position.toLowerCase().includes(term)
    );
  }, [staffList, searchTerm]);

  return (
    <div className="w-full  pt-0  flex flex-col max-h-[280px] no-scrollbar overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        )}
      </div>

      <Input
        id="staff"
        type="text"
        placeholder="Search Staff"
        value={searchTerm}
        onChange={(value) => setSearchTerm(value as string)}
      />

      <div className="flex-1 pt-3 no-scrollbar overflow-y-auto space-y-2">
        {filteredStaff.length > 0 ? (
          filteredStaff.map((staff) => (
            <StaffItem
              key={staff.id}
              staff={staff}
              selected={selectedStaff.includes(staff.id)}
              onSelect={() => onStaffSelect(staff.id)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No staff found.</p>
        )}
      </div>
    </div>
  );
};

export default StaffSelectionPanel;
