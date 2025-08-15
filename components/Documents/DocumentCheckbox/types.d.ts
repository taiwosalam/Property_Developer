export interface DocumentCheckboxProps {
  title?: string;
  checked?: boolean;
  children?: React.ReactNode;
  darkText?: boolean;
  state?: {
    isChecked: boolean;
    setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  };
  alignCheckboxCenter?: boolean;
  className?: string;
  onClick?: () => void;
  onChange?: (name: string, checked: boolean) => void; // Added onChange
  name?: string; //
}
