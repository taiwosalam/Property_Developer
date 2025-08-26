import Image from "next/image";
import { EmployeeCardProps } from "../PAGES/DIRECTOR/PropertyDeveloper/VariantA/hrm/logbook/types";
import { SearchIcon } from "@/public/icons/icons";
import { useState } from "react";
import { X } from "lucide-react";
import { Search } from "lucide-react";
import Link from "next/link";

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  name,
  position,
  avatar,
  requestType,
  branch,
  date,
  specialBadge = false,
}) => {
  return (
    <Link
      href="/hrm/logbook/4"
      className="bg-white block cursor-pointer rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200"
    >
      {/* Avatar Container */}
      <div className="flex justify-center mb-3">
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-full overflow-hidden border-1 ${
              specialBadge
                ? "border-yellow-400 bg-yellow-400"
                : "border-teal-400 bg-teal-400"
            } p-1`}
          >
            <Image
              width={74}
              height={74}
              src={avatar}
              alt={name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {specialBadge && (
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Employee Info */}
      <div className="text-center mb-3">
        <h3 className="font-semibold text-lg text-[#010A23]">{name}</h3>
        <p className="text-base text-[#606060] mb-2">{position}</p>
      </div>

      {/* Request Details */}
      <div className="space-y-1">
        <div className="text-center">
          <p className="font-medium text-[#2F364B]">{requestType}</p>
          <p className="text-xs text-gray-500">{branch}</p>
          <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>
      </div>
    </Link>
  );
};

interface Staff {
  id: number;
  name: string;
  position: string;
  avatar: string;
}

interface StaffItemProps {
  staff: Staff;
  isSelected: boolean;
  onSelect: (staffId: number) => void;
}

interface StaffListProps {
  staffList: Staff[];
  selectedStaff: number[];
  onStaffSelect: (staffId: number) => void;
}

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

interface TextAreaProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

interface ModalFooterProps {
  onSubmit: () => void;
  submitText: string;
  isDisabled?: boolean;
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const Avatar: React.FC<{
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
}> = ({ src, alt, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0`}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

// Checkbox Component
const Checkbox: React.FC<{ checked: boolean; onChange: () => void }> = ({
  checked,
  onChange,
}) => {
  return (
    <div
      className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
        checked
          ? "bg-blue-600 border-blue-600"
          : "border-gray-300 hover:border-gray-400"
      }`}
      onClick={onChange}
    >
      {checked && (
        <svg
          className="w-3 h-3 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
};

// Search Bar Component
const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
    </div>
  );
};

// Staff Item Component
const StaffItem: React.FC<StaffItemProps> = ({
  staff,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
      onClick={() => onSelect(staff.id)}
    >
      <Checkbox checked={isSelected} onChange={() => onSelect(staff.id)} />
      <Avatar src={staff.avatar} alt={staff.name} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {staff.name}
        </p>
        <p className="text-xs text-gray-500 truncate">{staff.position}</p>
      </div>
    </div>
  );
};

// Staff List Component
const StaffList: React.FC<StaffListProps> = ({
  staffList,
  selectedStaff,
  onStaffSelect,
}) => {
  return (
    <div className="max-h-64 overflow-y-auto space-y-1">
      {staffList.map((staff) => (
        <StaffItem
          key={staff.id}
          staff={staff}
          isSelected={selectedStaff.includes(staff.id)}
          onSelect={onStaffSelect}
        />
      ))}
    </div>
  );
};

// Text Input Component
const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
    />
  );
};

// Text Area Component
const TextArea: React.FC<TextAreaProps> = ({
  placeholder,
  value,
  onChange,
  rows = 3,
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
    />
  );
};

// Form Field Component
const FormField: React.FC<FormFieldProps> = ({ label, required, children }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {required && <span className="text-red-500">*</span>}
        {label}:
      </label>
      {children}
    </div>
  );
};

// Section Header Component
const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {subtitle && (
        <div className="flex items-center mt-2">
          <Avatar
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
            alt="Selected user"
            size="sm"
          />
          <span className="ml-2 text-sm text-gray-600">{subtitle}</span>
        </div>
      )}
    </div>
  );
};

// Modal Header Component
const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="w-6 h-6 text-gray-500" />
      </button>
    </div>
  );
};

// Modal Footer Component
const ModalFooter: React.FC<ModalFooterProps> = ({
  onSubmit,
  submitText,
  isDisabled,
}) => {
  return (
    <div className="flex justify-end p-6 border-t border-gray-200">
      <button
        onClick={onSubmit}
        disabled={isDisabled}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitText}
      </button>
    </div>
  );
};

// Main Modal Component
const CreateLogbookModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<number[]>([1]); // First staff pre-selected
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  // Mock staff data
  const staffList: Staff[] = [
    {
      id: 1,
      name: "Ajadi Ologuneru",
      position: "Job Position",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Ajadi Ologuneru",
      position: "Job Position",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Ajadi Ologuneru",
      position: "Job Position",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "Ajadi Ologuneru",
      position: "Job Position",
      avatar:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "Ajadi Ologuneru",
      position: "Job Position",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 6,
      name: "Ajadi Ologuneru",
      position: "Job Position",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    },
  ];

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStaffSelect = (staffId: number) => {
    setSelectedStaff((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleSubmit = () => {
    console.log("Submitting:", { selectedStaff, title, note });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <ModalHeader title="Select Staff" onClose={onClose} />

        <div className="flex h-[calc(90vh-140px)]">
          {/* Left Section - Select Staff */}
          <div className="w-1/2 p-6 border-r border-gray-200">
            <SearchBar
              placeholder="Search Staff"
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <StaffList
              staffList={filteredStaff}
              selectedStaff={selectedStaff}
              onStaffSelect={handleStaffSelect}
            />
          </div>

          {/* Right Section - Create Logbook */}
          <div className="w-1/2 p-6">
            <SectionHeader
              title="Create Logbook"
              subtitle="Ajadi Ologuneru Job Position"
            />

            <div className="space-y-4">
              <FormField label="Title" required>
                <TextInput
                  placeholder="Annual Plan"
                  value={title}
                  onChange={setTitle}
                />
              </FormField>

              <FormField label="Attach note">
                <TextArea
                  placeholder="Type here"
                  value={note}
                  onChange={setNote}
                  rows={4}
                />
              </FormField>
            </div>
          </div>
        </div>

        <ModalFooter
          onSubmit={handleSubmit}
          submitText="Submit"
          isDisabled={!title.trim() || selectedStaff.length === 0}
        />
      </div>
    </div>
  );
};

// Demo Component
const LogbookModalDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Open Create Logbook Modal
      </button>

      <CreateLogbookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default LogbookModalDemo;

// Main c
