import React, { useState } from "react";
import { Search, X } from "lucide-react";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import TextArea from "@/components/Form/TextArea/textarea";
import { CancelIcon } from "@/public/icons/icons";

// Types
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
  className?: string;
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
  position?: string;
}

// Avatar Component
const Avatar: React.FC<{
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
}> = ({ src, alt, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-20 h-20",
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
  className,
}) => {
  return (
    <div className={`relative mb-4 ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2  outline-none"
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
        <p className=" font-medium text-lg text-text-primary truncate">
          {staff.name}
        </p>
        <p className=" text-gray-500 truncate">{staff.position}</p>
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
    <div className="no-scrollbar flex sm:block  overflow-y-auto space-y-1">
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
// const TextArea: React.FC<TextAreaProps> = ({
//   placeholder,
//   value,
//   onChange,
//   rows = 3,
// }) => {
//   return (
//     <textarea
//       placeholder={placeholder}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       rows={rows}
//       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
//     />
//   );
// };

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

const SectionTitle = ({ title }: { title: string }) => {
  return <h3 className="text-lg mb-4 font-semibold text-gray-600">{title}</h3>;
};

// Section Header Component
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  position,
}) => {
  return (
    <div className="mb-4">
      <SectionTitle title={title} />
      {subtitle && (
        <div className="flex  items-center mt-2">
          <Avatar
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
            alt="Selected user"
            size="lg"
          />
          <div className="flex-col flex">
            <span className="ml-2 text-lg text-text-primary">{subtitle}</span>
            <span className="ml-2 text-sm text-gray-600">{position}</span>
          </div>
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
      <Button
        onClick={onSubmit}
        disabled={isDisabled}
        className=" bg-brand-9 text-white  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitText}
      </Button>
    </div>
  );
};

// Main Modal Component
const CreateLogbookModal = ({ onClose }: { onClose: () => void }) => {
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

  return (
    <div className="bg-white rounded-2xl max-w-[90%] md:max-w-[700px] w-full relative overflow-hidden">
      <div
        onClick={onClose}
        className="cancel cursor-pointer absolute top-0 right-0  p-4"
      >
        <CancelIcon />
      </div>
      <div className=" flex flex-col sm:flex-row">
        {/* Left Section - Select Staff */}
        <div className="sm:w-1/3 w-full p-6 border-r border-gray-200">
          <SectionTitle title="Select Staff" />
          <SearchBar
            placeholder="Search Staff"
            value={searchTerm}
            onChange={setSearchTerm}
            // id="searchbar"
          />
          <StaffList
            staffList={filteredStaff}
            selectedStaff={selectedStaff}
            onStaffSelect={handleStaffSelect}
          />
        </div>

        {/* Right Section - Create Logbook */}
        <div className="sm:w-2/3 w-full p-6">
          <SectionHeader
            title="Create Logbook"
            subtitle="Ajadi Ologuneru "
            position="Job Position"
          />

          <div className="space-y-4">
            <Input
              label="Title"
              value={title}
              onChange={setTitle}
              id="plan"
              required
              placeholder="Annual Plan"
            />

            <TextArea
              label="Attach note"
              required
              id="textnote"
              value={note}
              onChange={setNote}
            />

            {/* <FormField label="Attach note">
              <TextArea
                placeholder="Type here"
                value={note}
                onChange={setNote}
                rows={4}
              />
            </FormField> */}
          </div>
        </div>
      </div>

      <ModalFooter
        onSubmit={handleSubmit}
        submitText="Submit"
        isDisabled={!title.trim() || selectedStaff.length === 0}
      />
    </div>
  );
};

// Demo Component
const LogbookModalDemo = ({ onClose }: { onClose: () => void }) => {
  return <CreateLogbookModal onClose={onClose} />;
};

export default LogbookModalDemo;
