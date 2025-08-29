// TypeScript interfaces
export interface EmployeeCardProps {
    name: string;
    position: string;
    avatar: string;
    requestType: string;
    branch: string;
    date: string;
    specialBadge?: boolean;
    action: () => void
}

export interface Employee extends EmployeeCardProps {
    id: number;
}


// Types
export interface Staff {
    id: number;
    name: string;
    position: string;
    avatar: string;
}

export interface StaffItemProps {
    staff: Staff;
    isSelected: boolean;
    onSelect: (staffId: number) => void;
}

export interface StaffListProps {
    staffList: Staff[];
    selectedStaff: number[];
    onStaffSelect: (staffId: number) => void;
}

export interface SearchBarProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

export interface FormFieldProps {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}

export interface TextInputProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

export interface TextAreaProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}

export interface ModalHeaderProps {
    title: string;
    onClose: () => void;
}

export interface ModalFooterProps {
    onSubmit: () => void;
    submitText: string;
    isDisabled?: boolean;
}

export interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}